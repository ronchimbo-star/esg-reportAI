import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { FileText, Download, Eye, Filter } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface ESGTemplate {
  id: string;
  slug: string;
  title: string;
  description: string;
  featured_image: string | null;
  industries: string[] | null;
  frameworks: string[] | null;
  jurisdictions: string[] | null;
  category: string;
  download_count: number;
  created_at: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<ESGTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('esg_templates')
        .select('*')
        .eq('is_published', true)
        .is('archived_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTemplates(data || []);

      const uniqueCategories = ['All', ...new Set(data?.map(t => t.category) || [])];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = selectedCategory === 'All'
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  return (
    <>
      <Helmet>
        <title>ESG Report Templates | ESG Report AI</title>
        <meta name="description" content="Download professional ESG report templates for various industries and frameworks" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                ESG Report Templates
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Professional ESG report templates aligned with global standards. Download in HTML, PDF, or PNG formats.
              </p>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading templates...</p>
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No templates found</h3>
                <p className="text-gray-600">
                  {selectedCategory === 'All'
                    ? 'Check back soon for new templates.'
                    : `No templates available in the ${selectedCategory} category.`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    {template.featured_image && (
                      <div className="h-48 bg-gray-200 overflow-hidden">
                        <img
                          src={template.featured_image}
                          alt={template.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {template.category}
                        </span>
                        <div className="flex items-center text-sm text-gray-500">
                          <Download className="w-4 h-4 mr-1" />
                          {template.download_count || 0}
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {template.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {template.description}
                      </p>

                      {template.frameworks && template.frameworks.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {template.frameworks.map((framework, idx) => (
                              <span
                                key={idx}
                                className="inline-flex px-2 py-1 text-xs font-medium rounded bg-blue-50 text-blue-700"
                              >
                                {framework}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Link
                          to={`/template/${template.slug}`}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
