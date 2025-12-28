import { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SEOData {
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  favicon_url: string;
  sitemap_urls: string[];
}

export default function SEOSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [seoData, setSeoData] = useState<SEOData>({
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    favicon_url: '',
    sitemap_urls: [],
  });
  const [sitemapInput, setSitemapInput] = useState('');

  useEffect(() => {
    loadSEOSettings();
  }, []);

  const loadSEOSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSeoData({
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
          meta_keywords: data.meta_keywords || '',
          favicon_url: data.favicon_url || '',
          sitemap_urls: data.sitemap_urls || [],
        });
        setSitemapInput((data.sitemap_urls || []).join('\n'));
      }
    } catch (error) {
      console.error('Error loading SEO settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const urls = sitemapInput
        .split('\n')
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('seo_settings')
        .update({
          ...seoData,
          sitemap_urls: urls,
          updated_at: new Date().toISOString(),
          updated_by: user?.id,
        })
        .eq('id', (await supabase.from('seo_settings').select('id').limit(1).single()).data?.id);

      if (error) throw error;

      setMessage('SEO settings saved successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving settings: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">SEO Settings</h2>
        <p className="text-sm sm:text-base text-gray-600">Manage site metadata, favicon, and sitemap configuration</p>
      </div>

      {message && (
        <div className={`p-3 sm:p-4 rounded-lg text-sm ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {message}
        </div>
      )}

      <div className="space-y-4 sm:space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Title
          </label>
          <input
            type="text"
            value={seoData.meta_title}
            onChange={(e) => setSeoData({ ...seoData, meta_title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="AI ESG Report Generator"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Description
          </label>
          <textarea
            value={seoData.meta_description}
            onChange={(e) => setSeoData({ ...seoData, meta_description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Generate professional ESG reports aligned with global standards"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Keywords
          </label>
          <input
            type="text"
            value={seoData.meta_keywords}
            onChange={(e) => setSeoData({ ...seoData, meta_keywords: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="ESG, reporting, sustainability, compliance"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Favicon URL
          </label>
          <input
            type="text"
            value={seoData.favicon_url}
            onChange={(e) => setSeoData({ ...seoData, favicon_url: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="/favicon.ico"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sitemap URLs (one per line)
          </label>
          <textarea
            value={sitemapInput}
            onChange={(e) => setSitemapInput(e.target.value)}
            rows={8}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
            placeholder="https://esgReportAI.com/&#10;https://esgReportAI.com/about&#10;https://esgReportAI.com/contact"
          />
          <p className="text-sm text-gray-500 mt-1">
            Enter each URL on a new line. These will be used to generate the sitemap.xml
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
