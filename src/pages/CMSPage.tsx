import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface PageData {
  title: string;
  content: string;
  meta_description?: string;
  og_title?: string;
  og_description?: string;
  published_at?: string;
  categories?: string[];
  excerpt?: string;
}

export default function CMSPage() {
  const { slug } = useParams();
  const location = useLocation();
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewsArticle, setIsNewsArticle] = useState(false);

  useEffect(() => {
    loadPage();
  }, [slug, location.pathname]);

  const loadPage = async () => {
    try {
      setLoading(true);

      // Check if this is a news article route
      const isNews = location.pathname.startsWith('/news/');
      setIsNewsArticle(isNews);

      if (isNews) {
        // Load from news_articles table
        const { data, error } = await supabase
          .from('news_articles')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .maybeSingle();

        if (error) throw error;
        setPage(data);
      } else {
        // Load from cms_pages table
        const { data, error } = await supabase
          .from('cms_pages')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .maybeSingle();

        if (error) throw error;
        setPage(data);
      }
    } catch (error) {
      console.error('Error loading page:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
            <p className="text-gray-600">The page you're looking for doesn't exist.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {isNewsArticle && page.published_at && (
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-4">
                <time dateTime={page.published_at}>
                  {new Date(page.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                {page.categories && page.categories.length > 0 && (
                  <>
                    <span>•</span>
                    <div className="flex flex-wrap gap-2">
                      {page.categories.map((category, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
