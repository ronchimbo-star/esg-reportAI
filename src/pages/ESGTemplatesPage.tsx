import { useState, useEffect } from 'react';
import { Search, Download, Eye, FileText, Image, File } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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
  content: string;
  category: string;
}

export default function ESGTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedFramework, setSelectedFramework] = useState('');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewingTemplate, setViewingTemplate] = useState<Template | null>(null);

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

  const incrementDownloadCount = async (templateId: string) => {
    try {
      const template = templates.find(t => t.id === templateId);
      if (!template) return;

      const { error } = await supabase
        .from('esg_templates')
        .update({ download_count: (template.download_count || 0) + 1 })
        .eq('id', templateId);

      if (error) console.error('Error incrementing download count:', error);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const downloadAsHTML = (template: Template) => {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${template.title}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 20px; }
    h1, h2, h3 { color: #059669; }
    table { border-collapse: collapse; width: 100%; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f3f4f6; }
  </style>
</head>
<body>
  ${template.content}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.slug}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    incrementDownloadCount(template.id);
  };

  const downloadAsPNG = async (template: Template) => {
    const container = document.createElement('div');
    container.innerHTML = template.content;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '800px';
    container.style.padding = '40px';
    container.style.backgroundColor = 'white';
    document.body.appendChild(container);

    try {
      const canvas = await html2canvas(container);
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.slug}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      incrementDownloadCount(template.id);
    } catch (error) {
      console.error('Error generating PNG:', error);
      alert('Failed to generate PNG');
    } finally {
      document.body.removeChild(container);
    }
  };

  const downloadAsPDF = async (template: Template) => {
    const container = document.createElement('div');
    container.innerHTML = template.content;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '800px';
    container.style.padding = '40px';
    container.style.backgroundColor = 'white';
    document.body.appendChild(container);

    try {
      const canvas = await html2canvas(container);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${template.slug}.pdf`);

      incrementDownloadCount(template.id);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    } finally {
      document.body.removeChild(container);
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frameworks</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industries</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jurisdictions</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTemplates.map(template => (
                      <tr key={template.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{template.title}</div>
                          {template.description && (
                            <div className="text-sm text-gray-500 line-clamp-1">{template.description}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {template.frameworks.slice(0, 3).map(fw => (
                              <span key={fw} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium whitespace-nowrap">
                                {fw}
                              </span>
                            ))}
                            {template.frameworks.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                +{template.frameworks.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {template.industries.slice(0, 2).map(ind => (
                              <span key={ind} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium whitespace-nowrap">
                                {ind}
                              </span>
                            ))}
                            {template.industries.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                +{template.industries.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {template.jurisdictions.slice(0, 2).map(jur => (
                              <span key={jur} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium whitespace-nowrap">
                                {jur}
                              </span>
                            ))}
                            {template.jurisdictions.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                +{template.jurisdictions.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setViewingTemplate(template)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                              title="View Template"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                            <div className="relative group">
                              <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                                <Download className="w-4 h-4" />
                                Download
                              </button>
                              <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                <button
                                  onClick={() => downloadAsHTML(template)}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <FileText className="w-4 h-4" />
                                  HTML
                                </button>
                                <button
                                  onClick={() => downloadAsPNG(template)}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Image className="w-4 h-4" />
                                  PNG
                                </button>
                                <button
                                  onClick={() => downloadAsPDF(template)}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <File className="w-4 h-4" />
                                  PDF
                                </button>
                              </div>
                            </div>
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

      {viewingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-4xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{viewingTemplate.title}</h3>
                {viewingTemplate.description && (
                  <p className="text-sm text-gray-600 mt-1">{viewingTemplate.description}</p>
                )}
              </div>
              <button
                onClick={() => setViewingTemplate(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: viewingTemplate.content }}
              />
            </div>

            <div className="flex items-center justify-between p-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {viewingTemplate.frameworks.map(fw => (
                  <span key={fw} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                    {fw}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => downloadAsHTML(viewingTemplate)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Download HTML
                </button>
                <button
                  onClick={() => downloadAsPNG(viewingTemplate)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Image className="w-4 h-4" />
                  Download PNG
                </button>
                <button
                  onClick={() => downloadAsPDF(viewingTemplate)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <File className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
