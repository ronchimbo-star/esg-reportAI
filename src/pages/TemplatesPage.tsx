import { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { Search, Eye, Download, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ESGTemplate {
  id: string;
  slug: string;
  title: string;
  description: string;
  featured_image: string | null;
  industries: string[] | null;
  frameworks: string[] | null;
  jurisdictions: string[] | null;
  content: string;
  category: string;
  download_count: number;
  created_at: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<ESGTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [selectedFramework, setSelectedFramework] = useState<string>('');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>('');
  const [industries, setIndustries] = useState<string[]>([]);
  const [frameworks, setFrameworks] = useState<string[]>([]);
  const [jurisdictions, setJurisdictions] = useState<string[]>([]);
  const [downloading, setDownloading] = useState<string>('');
  const [viewingTemplate, setViewingTemplate] = useState<ESGTemplate | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

      const allIndustries = new Set<string>();
      const allFrameworks = new Set<string>();
      const allJurisdictions = new Set<string>();

      data?.forEach(template => {
        template.industries?.forEach(ind => allIndustries.add(ind));
        template.frameworks?.forEach(fw => allFrameworks.add(fw));
        template.jurisdictions?.forEach(jur => allJurisdictions.add(jur));
      });

      setIndustries(Array.from(allIndustries).sort());
      setFrameworks(Array.from(allFrameworks).sort());
      setJurisdictions(Array.from(allJurisdictions).sort());
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedIndustry('');
    setSelectedFramework('');
    setSelectedJurisdiction('');
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = !searchQuery ||
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesIndustry = !selectedIndustry ||
      template.industries?.includes(selectedIndustry);

    const matchesFramework = !selectedFramework ||
      template.frameworks?.includes(selectedFramework);

    const matchesJurisdiction = !selectedJurisdiction ||
      template.jurisdictions?.includes(selectedJurisdiction);

    return matchesSearch && matchesIndustry && matchesFramework && matchesJurisdiction;
  });

  const incrementDownloadCount = async (templateId: string) => {
    try {
      const template = templates.find(t => t.id === templateId);
      if (!template) return;

      await supabase
        .from('esg_templates')
        .update({ download_count: (template.download_count || 0) + 1 })
        .eq('id', templateId);
    } catch (error) {
      console.error('Error updating download count:', error);
    }
  };

  const downloadHTML = async (template: ESGTemplate) => {
    setDownloading(`html-${template.id}`);
    try {
      const blob = new Blob([template.content], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.slug}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      await incrementDownloadCount(template.id);
    } catch (error) {
      console.error('Error downloading HTML:', error);
      alert('Failed to download HTML file');
    } finally {
      setDownloading('');
    }
  };

  const downloadPNG = async (template: ESGTemplate) => {
    setDownloading(`png-${template.id}`);
    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = template.content;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      document.body.removeChild(tempDiv);

      canvas.toBlob((blob) => {
        if (blob) {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${template.slug}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }
      });

      await incrementDownloadCount(template.id);
    } catch (error) {
      console.error('Error downloading PNG:', error);
      alert('Failed to download PNG file');
    } finally {
      setDownloading('');
    }
  };

  const downloadPDF = async (template: ESGTemplate) => {
    setDownloading(`pdf-${template.id}`);
    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = template.content;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      document.body.removeChild(tempDiv);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${template.slug}.pdf`);

      await incrementDownloadCount(template.id);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF file');
    } finally {
      setDownloading('');
    }
  };

  const viewHTML = (template: ESGTemplate) => {
    setViewingTemplate(template);
  };

  return (
    <>
      <Helmet>
        <title>ESG Report Templates | ESG Report AI</title>
        <meta name="description" content="Ready-to-use ESG report templates for different industries, frameworks, and jurisdictions" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                ESG Report Templates
              </h1>
              <p className="text-lg text-gray-600">
                Ready-to-use ESG report templates for different industries, frameworks, and jurisdictions
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">All Industries</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedFramework}
                  onChange={(e) => setSelectedFramework(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">All Frameworks</option>
                  {frameworks.map((framework) => (
                    <option key={framework} value={framework}>
                      {framework}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedJurisdiction}
                  onChange={(e) => setSelectedJurisdiction(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">All Jurisdictions</option>
                  {jurisdictions.map((jurisdiction) => (
                    <option key={jurisdiction} value={jurisdiction}>
                      {jurisdiction}
                    </option>
                  ))}
                </select>

                <button
                  onClick={clearFilters}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12 bg-white rounded-xl shadow">
                <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading templates...</p>
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow">
                <p className="text-gray-600">No templates found matching your criteria.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Frameworks
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Industries
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Jurisdictions
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTemplates.map((template) => (
                        <tr key={template.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{template.title}</div>
                            {template.description && (
                              <div className="text-sm text-gray-500 line-clamp-1">{template.description}</div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {template.frameworks?.map((fw, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex px-2 py-1 text-xs font-medium rounded bg-blue-50 text-blue-700"
                                >
                                  {fw}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {template.industries?.map((ind, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex px-2 py-1 text-xs font-medium rounded bg-purple-50 text-purple-700"
                                >
                                  {ind}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {template.jurisdictions?.map((jur, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex px-2 py-1 text-xs font-medium rounded bg-green-50 text-green-700"
                                >
                                  {jur}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => viewHTML(template)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="View HTML"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => downloadHTML(template)}
                                disabled={downloading === `html-${template.id}`}
                                className="p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors disabled:opacity-50"
                                title="Download HTML"
                              >
                                {downloading === `html-${template.id}` ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <FileText className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => downloadPNG(template)}
                                disabled={downloading === `png-${template.id}`}
                                className="p-2 text-purple-600 hover:bg-purple-50 rounded transition-colors disabled:opacity-50"
                                title="Download PNG"
                              >
                                {downloading === `png-${template.id}` ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <ImageIcon className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => downloadPDF(template)}
                                disabled={downloading === `pdf-${template.id}`}
                                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                                title="Download PDF"
                              >
                                {downloading === `pdf-${template.id}` ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Download className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>

      {viewingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">{viewingTemplate.title}</h2>
              <button
                onClick={() => setViewingTemplate(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div
              className="flex-1 overflow-auto p-6"
              dangerouslySetInnerHTML={{ __html: viewingTemplate.content }}
            />
          </div>
        </div>
      )}
    </>
  );
}
