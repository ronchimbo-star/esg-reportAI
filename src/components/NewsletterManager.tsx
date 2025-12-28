import { useState, useEffect } from 'react';
import { Mail, Check, X, Bell, BellOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewsletterManagerProps {
  userEmail?: string;
}

export default function NewsletterManager({ userEmail }: NewsletterManagerProps) {
  const [email, setEmail] = useState(userEmail || '');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (userEmail) {
      checkSubscription(userEmail);
    }
  }, [userEmail]);

  const checkSubscription = async (emailToCheck: string) => {
    try {
      const { data } = await supabase
        .from('newsletter_subscriptions')
        .select('status')
        .eq('email', emailToCheck)
        .maybeSingle();

      setIsSubscribed(data?.status === 'active');
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/subscribe-newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'apikey': supabaseAnonKey,
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to subscribe');
      }

      setMessage(result.message);
      setIsSubscribed(true);
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!confirm('Are you sure you want to unsubscribe from the newsletter?')) {
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .update({
          status: 'unsubscribed',
          unsubscribed_at: new Date().toISOString()
        })
        .eq('email', email || userEmail);

      if (error) throw error;

      setMessage('Successfully unsubscribed from newsletter');
      setIsSubscribed(false);
    } catch (err: any) {
      setError(err.message || 'Failed to unsubscribe');
    } finally {
      setLoading(false);
    }
  };

  if (isSubscribed && userEmail) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <Bell className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Newsletter Subscription</h3>
            <p className="text-sm text-gray-600">You're subscribed to our newsletter</p>
          </div>
        </div>

        {message && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-green-800">{message}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <button
          onClick={handleUnsubscribe}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          <BellOff className="w-4 h-4" />
          {loading ? 'Processing...' : 'Unsubscribe'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-green-600 rounded-lg">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Subscribe to Our Newsletter</h3>
          <p className="text-sm text-gray-600">Get the latest ESG insights and updates</p>
        </div>
      </div>

      {message && (
        <div className="bg-green-100 border border-green-300 rounded-lg p-3 mb-4 flex items-start gap-2">
          <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-green-800">{message}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start gap-2">
          <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubscribe} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
    </div>
  );
}
