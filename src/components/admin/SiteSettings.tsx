import { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Save, BarChart3 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Toast from './Toast';

export default function SiteSettings() {
  const [faviconUrl, setFaviconUrl] = useState('');
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .in('key', ['favicon_url', 'google_analytics_id']);

      if (data) {
        data.forEach((setting) => {
          if (setting.key === 'favicon_url') {
            setFaviconUrl(setting.value || '');
          } else if (setting.key === 'google_analytics_id') {
            setGoogleAnalyticsId(setting.value || '');
          }
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('image') && !file.name.endsWith('.ico')) {
      setToast({ message: 'Please upload an image or .ico file', type: 'error' });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setToast({ message: 'File size must be less than 2MB', type: 'error' });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `favicon-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);

      setFaviconUrl(publicUrl);
      setToast({ message: 'File uploaded successfully', type: 'success' });
    } catch (error) {
      console.error('Error uploading file:', error);
      setToast({ message: 'Failed to upload file', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const updates = [
        {
          key: 'favicon_url',
          value: faviconUrl,
          updated_by: user?.id,
          updated_at: new Date().toISOString(),
        },
        {
          key: 'google_analytics_id',
          value: googleAnalyticsId,
          updated_by: user?.id,
          updated_at: new Date().toISOString(),
        },
      ];

      const { error } = await supabase
        .from('site_settings')
        .upsert(updates);

      if (error) throw error;

      updateFavicon(faviconUrl);
      window.location.reload();
    } catch (error) {
      console.error('Error saving settings:', error);
      setToast({ message: 'Failed to save settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const updateFavicon = (url: string) => {
    const link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    if (link) {
      link.href = url;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Site Settings</h2>
        <p className="text-gray-600">Manage your site-wide settings and branding</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Favicon</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Favicon
            </label>
            {faviconUrl ? (
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 border-2 border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
                  <img src={faviconUrl} alt="Favicon" className="w-12 h-12 object-contain" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 break-all">{faviconUrl}</p>
                </div>
              </div>
            ) : (
              <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload New Favicon
            </label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Upload className="w-4 h-4" />
                {uploading ? 'Uploading...' : 'Choose File'}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,.ico"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </label>
              <span className="text-sm text-gray-500">
                Recommended: 32x32px or 16x16px, PNG or ICO format
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Favicon URL
            </label>
            <input
              type="text"
              value={faviconUrl}
              onChange={(e) => setFaviconUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="/favicon.ico or https://..."
            />
            <p className="mt-1 text-sm text-gray-500">
              You can also paste a URL directly if the file is hosted elsewhere
            </p>
          </div>

        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Google Analytics</h3>
            <p className="text-sm text-gray-600">Track your website analytics</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Measurement ID
            </label>
            <input
              type="text"
              value={googleAnalyticsId}
              onChange={(e) => setGoogleAnalyticsId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
              placeholder="G-XXXXXXXXXX"
            />
            <p className="mt-2 text-sm text-gray-500">
              Enter your Google Analytics 4 Measurement ID. Find it in your GA4 property settings under Data Streams.
            </p>
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>How to get your Measurement ID:</strong>
              </p>
              <ol className="text-xs text-blue-700 mt-2 space-y-1 list-decimal list-inside">
                <li>Go to Google Analytics dashboard</li>
                <li>Click Admin (gear icon) at the bottom left</li>
                <li>Under Property, click Data Streams</li>
                <li>Select your web stream</li>
                <li>Copy the Measurement ID (starts with G-)</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
