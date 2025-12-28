import { useState, useEffect } from 'react';
import { MessageCircle, ThumbsUp, Send, Reply, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Comment {
  id: string;
  template_id: string;
  user_id: string | null;
  user_name: string | null;
  user_email: string | null;
  comment_text: string;
  is_approved: boolean;
  parent_comment_id: string | null;
  created_at: string;
  likes_count?: number;
  user_liked?: boolean;
  replies?: Comment[];
}

interface TemplateCommentsProps {
  templateId: string;
  currentUserId?: string | null;
}

export default function TemplateComments({ templateId, currentUserId }: TemplateCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commenting, setCommenting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadComments();
  }, [templateId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('template_comments')
        .select('*')
        .eq('template_id', templateId)
        .eq('is_approved', true)
        .is('parent_comment_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const commentsWithDetails = await Promise.all(
        (data || []).map(async (comment) => {
          const [likesResult, repliesResult] = await Promise.all([
            supabase
              .from('comment_likes')
              .select('id', { count: 'exact', head: true })
              .eq('comment_id', comment.id),
            supabase
              .from('template_comments')
              .select('*')
              .eq('parent_comment_id', comment.id)
              .eq('is_approved', true)
              .order('created_at', { ascending: true })
          ]);

          return {
            ...comment,
            likes_count: likesResult.count || 0,
            replies: repliesResult.data || []
          };
        })
      );

      setComments(commentsWithDetails);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return;
    if (!currentUserId && (!userName.trim() || !userEmail.trim())) {
      setMessage('Please provide your name and email');
      return;
    }

    setCommenting(true);
    setMessage('');

    try {
      const commentData: any = {
        template_id: templateId,
        comment_text: newComment,
        parent_comment_id: replyingTo,
      };

      if (currentUserId) {
        commentData.user_id = currentUserId;
      } else {
        commentData.user_name = userName;
        commentData.user_email = userEmail;
      }

      const { error } = await supabase
        .from('template_comments')
        .insert([commentData]);

      if (error) throw error;

      setMessage('Comment submitted! It will appear after admin approval.');
      setNewComment('');
      setUserName('');
      setUserEmail('');
      setReplyingTo(null);

      setTimeout(() => {
        setMessage('');
      }, 5000);
    } catch (error: any) {
      console.error('Error submitting comment:', error);
      setMessage('Failed to submit comment. Please try again.');
    } finally {
      setCommenting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!currentUserId) {
      setMessage('Please log in to like comments');
      return;
    }

    try {
      const { error } = await supabase
        .from('comment_likes')
        .insert([{
          comment_id: commentId,
          user_id: currentUserId
        }]);

      if (error) {
        if (error.code === '23505') {
          await supabase
            .from('comment_likes')
            .delete()
            .eq('comment_id', commentId)
            .eq('user_id', currentUserId);
        } else {
          throw error;
        }
      }

      loadComments();
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`${isReply ? 'ml-12 mt-4' : ''} ${isReply ? 'border-l-2 border-gray-200 pl-4' : ''}`}>
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900">
                {comment.user_name || 'Anonymous User'}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{comment.comment_text}</p>
            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={() => handleLikeComment(comment.id)}
                className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-green-600 transition-colors"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{comment.likes_count || 0}</span>
              </button>
              {!isReply && (
                <button
                  onClick={() => setReplyingTo(comment.id)}
                  className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-green-600 transition-colors"
                >
                  <Reply className="w-4 h-4" />
                  Reply
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {replyingTo === comment.id && (
        <form onSubmit={handleSubmitComment} className="mt-4 ml-12">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your reply..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              rows={3}
              required
            />
            {!currentUserId && (
              <div className="grid grid-cols-2 gap-3 mt-3">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Your name"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Your email"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            )}
            <div className="flex items-center gap-2 mt-3">
              <button
                type="submit"
                disabled={commenting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {commenting ? 'Sending...' : 'Reply'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setReplyingTo(null);
                  setNewComment('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MessageCircle className="w-6 h-6 text-green-600" />
        <h3 className="text-xl font-bold text-gray-900">
          Comments ({comments.length})
        </h3>
      </div>

      <form onSubmit={handleSubmitComment} className="bg-white border border-gray-200 rounded-lg p-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts about this template..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          rows={4}
          required
        />

        {!currentUserId && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your name"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Your email"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
        )}

        {message && (
          <div className={`mt-4 p-3 rounded-lg ${
            message.includes('Failed')
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-green-50 text-green-800 border border-green-200'
          }`}>
            {message}
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Comments are moderated and will appear after approval
          </p>
          <button
            type="submit"
            disabled={commenting}
            className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {commenting ? 'Submitting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}
