import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { Download, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
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
  meta_description: string | null;
  og_title: string | null;
}

export default function TemplateDetailPage() {
  const { slug } = useParams();
  const [template, setTemplate] = useState<ESGTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState<string>('');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadTemplate();
  }, [slug]);

  const loadTemplate = async () => {
    try {
      const { data, error } = await supabase
        .from('esg_templates')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .is('archived_at', null)
        .maybeSingle();

      if (error) throw error;
      setTemplate(data);
    } catch (error) {
      console.error('Error loading template:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementDownloadCount = async () => {
    if (!template) return;

    try {
      await supabase
        .from('esg_templates')
        .update({ download_count: (template.download_count || 0) + 1 })
        .eq('id', template.id);
    } catch (error) {
      console.error('Error updating download count:', error);
    }
  };

  const downloadHTML = async () => {
    if (!template) return;

    setDownloading(true);
    setDownloadType('HTML');

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

      await incrementDownloadCount();
    } catch (error) {
      console.error('Error downloading HTML:', error);
      alert('Failed to download HTML file');
    } finally {
      setDownloading(false);
      setDownloadType('');
    }
  };

  const downloadPNG = async () => {
    if (!contentRef.current || !template) return;

    setDownloading(true);
    setDownloadType('PNG');

    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

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

      await incrementDownloadCount();
    } catch (error) {
      console.error('Error downloading PNG:', error);
      alert('Failed to download PNG file');
    } finally {
      setDownloading(false);
      setDownloadType('');
    }
  };

  const downloadPDF = async () => {
    if (!contentRef.current || !template) return;

    setDownloading(true);
    setDownloadType('PDF');

    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${template.slug}.pdf`);

      await incrementDownloadCount();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF file');
    } finally {
      setDownloading(false);
      setDownloadType('');
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

  if (!template) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Template Not Found</h1>
            <p className="text-gray-600">The template you're looking for doesn't exist.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{template.og_title || template.title} | ESG Report AI</title>
        {template.meta_description && <meta name="description" content={template.meta_description} />}
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                <div className="flex-1">
                  <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800 mb-3">
                    {template.category}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{template.title}</h1>
                  <p className="text-lg text-gray-600 mb-6">{template.description}</p>

                  {template.frameworks && template.frameworks.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Frameworks:</h3>
                      <div className="flex flex-wrap gap-2">
                        {template.frameworks.map((framework, idx) => (
                          <span
                            key={idx}
                            className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-blue-50 text-blue-700"
                          >
                            {framework}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {template.industries && template.industries.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Industries:</h3>
                      <div className="flex flex-wrap gap-2">
                        {template.industries.map((industry, idx) => (
                          <span
                            key={idx}
                            className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-purple-50 text-purple-700"
                          >
                            {industry}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 md:min-w-[200px]">
                  <button
                    onClick={downloadHTML}
                    disabled={downloading}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {downloading && downloadType === 'HTML' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                    Download HTML
                  </button>

                  <button
                    onClick={downloadPNG}
                    disabled={downloading}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {downloading && downloadType === 'PNG' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ImageIcon className="w-4 h-4" />
                    )}
                    Download PNG
                  </button>

                  <button
                    onClick={downloadPDF}
                    disabled={downloading}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {downloading && downloadType === 'PDF' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    Download PDF
                  </button>

                  <div className="text-center text-sm text-gray-500 mt-2">
                    {template.download_count || 0} downloads
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Preview</h2>
                <div
                  ref={contentRef}
                  className="prose prose-lg max-w-none bg-gray-50 p-6 rounded-lg overflow-auto max-h-[800px]"
                  dangerouslySetInnerHTML={{ __html: template.content }}
                />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
