import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ShareButtons from '../components/ShareButtons';

interface PageData {
  title: string;
  content: string;
  meta_description?: string;
  og_title?: string;
  og_description?: string;
  published_at?: string;
  categories?: string[];
  excerpt?: string;
  featured_image?: string;
  image_caption?: string;
}

interface NavigationArticle {
  slug: string;
  title: string;
}

export default function CMSPage() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewsArticle, setIsNewsArticle] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [previousArticle, setPreviousArticle] = useState<NavigationArticle | null>(null);
  const [nextArticle, setNextArticle] = useState<NavigationArticle | null>(null);

  useEffect(() => {
    loadPage();
    loadSettings();
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

        // Load navigation articles (previous and next)
        if (data) {
          // Get all articles ordered by date
          const { data: allArticles } = await supabase
            .from('news_articles')
            .select('slug, title, published_at')
            .eq('is_published', true)
            .order('published_at', { ascending: false });

          if (allArticles) {
            const currentIndex = allArticles.findIndex(a => a.slug === slug);
            if (currentIndex > 0) {
              setNextArticle({ slug: allArticles[currentIndex - 1].slug, title: allArticles[currentIndex - 1].title });
            } else {
              setNextArticle(null);
            }
            if (currentIndex < allArticles.length - 1 && currentIndex !== -1) {
              setPreviousArticle({ slug: allArticles[currentIndex + 1].slug, title: allArticles[currentIndex + 1].title });
            } else {
              setPreviousArticle(null);
            }
          }
        }
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
        setPreviousArticle(null);
        setNextArticle(null);
      }
    } catch (error) {
      console.error('Error loading page:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['contact_email', 'support_email', 'enterprise_email', 'partnerships_email']);

      if (error) throw error;

      const settingsMap: Record<string, string> = {};
      data?.forEach(item => {
        settingsMap[item.key] = item.value;
      });
      setSettings(settingsMap);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const replaceTemplateVars = (content: string): string => {
    let result = content;
    Object.keys(settings).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, settings[key]);
    });
    return result;
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          {isNewsArticle && (
            <>
              <div className="mb-6">
                <button
                  onClick={() => navigate('/news')}
                  className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-6"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to News
                </button>

                {page.published_at && (
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

          {isNewsArticle && (
            <>
              <ShareButtons
                url={currentUrl}
                title={page.title}
                description={page.excerpt}
                position="top"
              />

              <div className="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 z-10">
                <div className="bg-white shadow-lg rounded-full p-3 border border-gray-200">
                  <ShareButtons
                    url={currentUrl}
                    title={page.title}
                    description={page.excerpt}
                    position="middle"
                    layout="vertical"
                  />
                </div>
              </div>
            </>
          )}

                            >
                              {category}
                            </span>
                          ))}

          {isNewsArticle && (
            <ShareButtons
              url={currentUrl}
              title={page.title}
              description={page.excerpt}
              position="bottom"
            />
          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {page.featured_image && (
                <div className="mb-8">
                  <img
                    src={page.featured_image}
                    alt={page.title}
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                  {page.image_caption && (
                    <p className="mt-2 text-sm text-gray-600 italic text-center">
                      {page.image_caption}
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: replaceTemplateVars(page.content) }}
          />

          {isNewsArticle && (previousArticle || nextArticle) && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="grid md:grid-cols-2 gap-6">
                {previousArticle && (
                  <Link
                    to={`/news/${previousArticle.slug}`}
                    className="group bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors border border-gray-200"
                  >
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <ArrowLeft className="w-4 h-4" />
                      <span>Previous Article</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
                      {previousArticle.title}
                    </h3>
                  </Link>
                )}

                {nextArticle && (
                  <Link
                    to={`/news/${nextArticle.slug}`}
                    className={`group bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors border border-gray-200 ${!previousArticle ? 'md:col-start-2' : ''}`}
                  >
                    <div className="flex items-center justify-end gap-2 text-sm text-gray-500 mb-2">
                      <span>Next Article</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 text-right">
                      {nextArticle.title}
                    </h3>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
