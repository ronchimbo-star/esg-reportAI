import { useState, useEffect } from 'react';
import { Search, Download, Filter } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

interface Template {
  id: string;
  slug: string;
  title: string;
  description: string;
  featured_image: string | null;
  industries: string[];
  frameworks: string[];
  jurisdictions: string[];
  download_count: number;
}

export default function ESGTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedFramework, setSelectedFramework] = useState('');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('');
  const [loading, setLoading] = useState(true);

  const industries = Array.from(new Set(templates.flatMap(t => t.industries))).sort();
  const frameworks = Array.from(new Set(templates.flatMap(t => t.frameworks))).sort();
  const jurisdictions = Array.from(new Set(templates.flatMap(t => t.jurisdictions))).sort();

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, searchTerm, selectedIndustry, selectedFramework, selectedJurisdiction]);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('esg_templates')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = templates;

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedIndustry) {
      filtered = filtered.filter(t => t.industries.includes(selectedIndustry));
    }

    if (selectedFramework) {
      filtered = filtered.filter(t => t.frameworks.includes(selectedFramework));
    }

    if (selectedJurisdiction) {
      filtered = filtered.filter(t => t.jurisdictions.includes(selectedJurisdiction));
    }

    setFilteredTemplates(filtered);
  };

  const handleDownload = async (templateId: string) => {
    try {
      const { error } = await supabase.rpc('increment_template_downloads', {
        template_id: templateId
      });
      if (error) console.error('Error incrementing download count:', error);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-gradient-to-br from-green-50 to-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              ESG Report Templates
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready-to-use ESG report templates for different industries, frameworks, and jurisdictions
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search templates..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Industries</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>

              <select
                value={selectedFramework}
                onChange={(e) => setSelectedFramework(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Frameworks</option>
                {frameworks.map(framework => (
                  <option key={framework} value={framework}>{framework}</option>
                ))}
              </select>

              <select
                value={selectedJurisdiction}
                onChange={(e) => setSelectedJurisdiction(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Jurisdictions</option>
                {jurisdictions.map(jurisdiction => (
                  <option key={jurisdiction} value={jurisdiction}>{jurisdiction}</option>
                ))}
              </select>

              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedIndustry('');
                  setSelectedFramework('');
                  setSelectedJurisdiction('');
                }}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No templates found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map(template => (
                <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  {template.featured_image && (
                    <img
                      src={template.featured_image}
                      alt={template.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{template.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{template.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {template.frameworks.slice(0, 2).map(fw => (
                        <span key={fw} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                          {fw}
                        </span>
                      ))}
                      {template.frameworks.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          +{template.frameworks.length - 2} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {template.download_count} downloads
                      </span>
                      <Link
                        to={`/template/${template.slug}`}
                        onClick={() => handleDownload(template.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        <Download className="w-4 h-4" />
                        View
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
  );
}
