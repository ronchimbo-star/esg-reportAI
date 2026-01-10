import { useState, useEffect } from 'react';
import { MessageCircle, Check, X, Edit2, Trash2, Search, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Toast from './Toast';

interface Comment {
  id: string;
  template_id: string;
  template_title?: string;
  user_id: string | null;
  user_name: string | null;
  user_email: string | null;
  comment_text: string;
  is_approved: boolean;
  is_edited: boolean;
  parent_comment_id: string | null;
  created_at: string;
  updated_at: string;
  likes_count?: number;
}

export default function CommentModeration() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved'>('all');
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editedText, setEditedText] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadComments();
  }, [filterStatus]);

  const loadComments = async () => {
    try {
      setLoading(true);

      const { data: commentsData, error: commentsError } = await supabase
        .from('template_comments')
        .select('*')
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;

      const { data: templatesData } = await supabase
        .from('esg_templates')
        .select('id, title');

      const templatesMap = new Map(
        (templatesData || []).map(t => [t.id, t.title])
      );

      let filteredComments = commentsData || [];
      if (filterStatus === 'pending') {
        filteredComments = filteredComments.filter(c => !c.is_approved);
      } else if (filterStatus === 'approved') {
        filteredComments = filteredComments.filter(c => c.is_approved);
      }

      const commentsWithDetails = await Promise.all(
        filteredComments.map(async (comment: any) => {
          const { count } = await supabase
            .from('comment_likes')
            .select('id', { count: 'exact', head: true })
            .eq('comment_id', comment.id);

          return {
            ...comment,
            template_title: templatesMap.get(comment.template_id) || 'Unknown Template',
            likes_count: count || 0
          };
        })
      );

      setComments(commentsWithDetails);
    } catch (error) {
      console.error('Error loading comments:', error);
      showToast('Failed to load comments', 'error');
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('template_comments')
        .update({ is_approved: true })
        .eq('id', commentId);

      if (error) throw error;

      showToast('Comment approved successfully', 'success');
      loadComments();
    } catch (error) {
      console.error('Error approving comment:', error);
      showToast('Failed to approve comment', 'error');
    }
  };

  const handleReject = async (commentId: string) => {
    if (!confirm('Are you sure you want to reject this comment?')) return;

    try {
      const { error } = await supabase
        .from('template_comments')
        .update({ is_approved: false })
        .eq('id', commentId);

      if (error) throw error;

      showToast('Comment rejected', 'success');
      loadComments();
    } catch (error) {
      console.error('Error rejecting comment:', error);
      showToast('Failed to reject comment', 'error');
    }
  };

  const handleEdit = (comment: Comment) => {
    setEditingComment(comment);
    setEditedText(comment.comment_text);
  };

  const handleSaveEdit = async () => {
    if (!editingComment) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data: adminData } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', user?.id)
        .maybeSingle();

      const { error } = await supabase
        .from('template_comments')
        .update({
          comment_text: editedText,
          is_edited: true,
          edited_at: new Date().toISOString(),
          edited_by: adminData?.id
        })
        .eq('id', editingComment.id);

      if (error) throw error;

      showToast('Comment updated successfully', 'success');
      setEditingComment(null);
      loadComments();
    } catch (error) {
      console.error('Error updating comment:', error);
      showToast('Failed to update comment', 'error');
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('template_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      showToast('Comment deleted successfully', 'success');
      loadComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      showToast('Failed to delete comment', 'error');
    }
  };

  const filteredComments = comments.filter((comment) => {
    const search = searchTerm.toLowerCase();
    return (
      comment.comment_text.toLowerCase().includes(search) ||
      comment.user_name?.toLowerCase().includes(search) ||
      comment.user_email?.toLowerCase().includes(search) ||
      comment.template_title?.toLowerCase().includes(search)
    );
  });

  const pendingCount = comments.filter(c => !c.is_approved).length;
  const approvedCount = comments.filter(c => c.is_approved).length;

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Comment Moderation</h2>
          <p className="text-gray-600">Review and moderate template comments</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({comments.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'pending'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'approved'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Approved ({approvedCount})
            </button>
          </div>

          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search comments..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full sm:w-64"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading comments...</p>
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No comments found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComments.map((comment) => (
              <div
                key={comment.id}
                className={`bg-white border rounded-lg p-6 ${
                  !comment.is_approved ? 'border-orange-300 bg-orange-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900">
                        {comment.user_name || 'Anonymous'}
                      </span>
                      {comment.user_email && (
                        <span className="text-sm text-gray-500">
                          ({comment.user_email})
                        </span>
                      )}
                      {!comment.is_approved && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                          Pending
                        </span>
                      )}
                      {comment.is_edited && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                          Edited by Admin
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Template: <span className="font-medium">{comment.template_title}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {comment.likes_count! > 0 && (
                      <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">{comment.likes_count}</span>
                      </div>
                    )}
                  </div>
                </div>

                {editingComment?.id === comment.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={4}
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingComment(null)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-700 whitespace-pre-wrap mb-4">
                      {comment.comment_text}
                    </p>

                    <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                      {!comment.is_approved ? (
                        <button
                          onClick={() => handleApprove(comment.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          Approve
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReject(comment.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Unapprove
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(comment)}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
