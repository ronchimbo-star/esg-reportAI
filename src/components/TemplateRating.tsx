import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface TemplateRatingProps {
  templateId: string;
  currentUserId?: string | null;
}

export default function TemplateRating({ templateId, currentUserId }: TemplateRatingProps) {
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadRatings();
  }, [templateId, currentUserId]);

  const loadRatings = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .rpc('get_template_average_rating', { template_uuid: templateId });

      if (error) throw error;

      if (data && data.length > 0) {
        setAverageRating(parseFloat(data[0].average_rating) || 0);
        setTotalRatings(parseInt(data[0].total_ratings) || 0);
      }

      if (currentUserId) {
        const { data: userRatingData } = await supabase
          .from('template_ratings')
          .select('rating')
          .eq('template_id', templateId)
          .eq('user_id', currentUserId)
          .maybeSingle();

        if (userRatingData) {
          setUserRating(userRatingData.rating);
        }
      }
    } catch (error) {
      console.error('Error loading ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (rating: number) => {
    if (!currentUserId) {
      alert('Please log in to rate this template');
      return;
    }

    setSubmitting(true);

    try {
      if (userRating > 0) {
        const { error } = await supabase
          .from('template_ratings')
          .update({ rating, updated_at: new Date().toISOString() })
          .eq('template_id', templateId)
          .eq('user_id', currentUserId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('template_ratings')
          .insert([{
            template_id: templateId,
            user_id: currentUserId,
            rating
          }]);

        if (error) throw error;
      }

      setUserRating(rating);
      loadRatings();
    } catch (error: any) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const StarIcon = ({ filled, half = false }: { filled: boolean; half?: boolean }) => (
    <div className="relative">
      <Star className={`w-6 h-6 ${filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
      {half && (
        <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
          <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-6 h-6 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Rate This Template</h3>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => {
            const filled = star <= Math.floor(averageRating);
            const half = !filled && star === Math.ceil(averageRating) && averageRating % 1 !== 0;

            return (
              <div key={star}>
                <StarIcon filled={filled} half={half} />
              </div>
            );
          })}
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-bold text-gray-900">{averageRating.toFixed(1)}</span>
          {' '}out of 5 ({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <p className="text-sm text-gray-700 mb-3">
          {userRating > 0 ? 'Your rating:' : 'Click to rate:'}
        </p>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              disabled={submitting}
              className="transition-transform hover:scale-110 disabled:opacity-50"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoverRating || userRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 hover:text-yellow-200'
                }`}
              />
            </button>
          ))}
        </div>
        {userRating > 0 && (
          <p className="text-sm text-green-600 mt-3">
            Thank you for rating! You gave {userRating} {userRating === 1 ? 'star' : 'stars'}.
          </p>
        )}
      </div>
    </div>
  );
}
