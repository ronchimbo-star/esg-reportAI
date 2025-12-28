import { Link } from 'react-router-dom';
import { BookOpen, Newspaper, Mail, ExternalLink, TrendingUp, HelpCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ResourcesPage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/subscribe-newsletter`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setSubscribed(true);
      setEmail('');
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      setError(err instanceof Error ? err.message : 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-gradient-to-br from-green-50 to-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              ESG Resources Hub
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to understand, implement, and excel in ESG reporting.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Link
              to="/news"
              className="bg-white p-8 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
                <Newspaper className="w-6 h-6 text-green-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">News & Blog</h3>
              <p className="text-gray-600">
                Latest insights on ESG reporting, AI innovations, and industry trends.
              </p>
            </Link>

            <Link
              to="/esg-templates"
              className="bg-white p-8 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                <BookOpen className="w-6 h-6 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">ESG Templates</h3>
              <p className="text-gray-600">
                Ready-to-use templates for different industries, frameworks, and jurisdictions.
              </p>
            </Link>

            <Link
              to="/about"
              className="bg-white p-8 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
                <HelpCircle className="w-6 h-6 text-purple-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">About Us</h3>
              <p className="text-gray-600">
                Learn about our mission to democratize ESG reporting with AI.
              </p>
            </Link>

            <Link
              to="/contact"
              className="bg-white p-8 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-600 transition-colors">
                <Mail className="w-6 h-6 text-orange-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Contact Us</h3>
              <p className="text-gray-600">
                Get in touch with our team for support, partnerships, or questions.
              </p>
            </Link>

            <a
              href="https://esgreport.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-8 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
                <TrendingUp className="w-6 h-6 text-green-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                Full ESG Platform <ExternalLink className="w-4 h-4" />
              </h3>
              <p className="text-gray-600">
                Upgrade to our comprehensive SaaS platform for ongoing tracking and support.
              </p>
            </a>

            <a
              href="https://greenregistry.org"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-8 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-600 transition-colors">
                <ExternalLink className="w-6 h-6 text-teal-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                Green Registry <ExternalLink className="w-4 h-4" />
              </h3>
              <p className="text-gray-600">
                Publish and showcase your ESG reports on our public indexing platform.
              </p>
            </a>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl p-8 md:p-12 text-white">
            <div className="max-w-2xl mx-auto text-center">
              <Mail className="w-12 h-12 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="text-xl mb-8 text-green-50">
                Subscribe to our newsletter for weekly ESG tips, industry insights, and reporting best practices.
              </p>
              {subscribed ? (
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
                  <p className="text-lg font-semibold">Thank you for subscribing!</p>
                  <p className="text-green-50 mt-2">You'll receive our next newsletter soon.</p>
                </div>
              ) : (
                <>
                  <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      disabled={loading}
                      className="flex-1 px-6 py-3 rounded-lg text-gray-900 disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3 bg-white text-green-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Subscribing...' : 'Subscribe'}
                    </button>
                  </form>
                  {error && (
                    <div className="mt-4 bg-red-500/20 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto">
                      <p className="text-white">{error}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
