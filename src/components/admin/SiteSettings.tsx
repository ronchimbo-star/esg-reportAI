import { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Save, BarChart3, Mail, Phone, Share2, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Toast from './Toast';

export default function SiteSettings() {
  const [faviconUrl, setFaviconUrl] = useState('');
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [enterpriseEmail, setEnterpriseEmail] = useState('');
  const [partnershipsEmail, setPartnershipsEmail] = useState('');
  const [socialLinkedin, setSocialLinkedin] = useState('');
  const [socialTwitter, setSocialTwitter] = useState('');
  const [socialFacebook, setSocialFacebook] = useState('');
  const [siteMetaTitle, setSiteMetaTitle] = useState('');
  const [siteMetaDescription, setSiteMetaDescription] = useState('');
  const [siteMetaKeywords, setSiteMetaKeywords] = useState('');
  const [footerTagline, setFooterTagline] = useState('');
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
        .select('*');

      if (data) {
        data.forEach((setting) => {
          switch (setting.key) {
            case 'favicon_url':
              setFaviconUrl(setting.value || '');
              break;
            case 'google_analytics_id':
              setGoogleAnalyticsId(setting.value || '');
              break;
            case 'contact_email':
              setContactEmail(setting.value || '');
              break;
            case 'contact_phone':
              setContactPhone(setting.value || '');
              break;
            case 'support_email':
              setSupportEmail(setting.value || '');
              break;
            case 'enterprise_email':
              setEnterpriseEmail(setting.value || '');
              break;
            case 'partnerships_email':
              setPartnershipsEmail(setting.value || '');
              break;
            case 'social_linkedin':
              setSocialLinkedin(setting.value || '');
              break;
            case 'social_twitter':
              setSocialTwitter(setting.value || '');
              break;
            case 'social_facebook':
              setSocialFacebook(setting.value || '');
              break;
            case 'site_meta_title':
              setSiteMetaTitle(setting.value || '');
              break;
            case 'site_meta_description':
              setSiteMetaDescription(setting.value || '');
              break;
            case 'site_meta_keywords':
              setSiteMetaKeywords(setting.value || '');
              break;
            case 'footer_tagline':
              setFooterTagline(setting.value || '');
              break;
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
        { key: 'favicon_url', value: faviconUrl, updated_by: user?.id },
        { key: 'google_analytics_id', value: googleAnalyticsId, updated_by: user?.id },
        { key: 'contact_email', value: contactEmail, updated_by: user?.id },
        { key: 'contact_phone', value: contactPhone, updated_by: user?.id },
        { key: 'support_email', value: supportEmail, updated_by: user?.id },
        { key: 'enterprise_email', value: enterpriseEmail, updated_by: user?.id },
        { key: 'partnerships_email', value: partnershipsEmail, updated_by: user?.id },
        { key: 'social_linkedin', value: socialLinkedin, updated_by: user?.id },
        { key: 'social_twitter', value: socialTwitter, updated_by: user?.id },
        { key: 'social_facebook', value: socialFacebook, updated_by: user?.id },
        { key: 'site_meta_title', value: siteMetaTitle, updated_by: user?.id },
        { key: 'site_meta_description', value: siteMetaDescription, updated_by: user?.id },
        { key: 'site_meta_keywords', value: siteMetaKeywords, updated_by: user?.id },
        { key: 'footer_tagline', value: footerTagline, updated_by: user?.id },
      ];

      const { error } = await supabase
        .from('site_settings')
        .upsert(updates, { onConflict: 'key' });

      if (error) throw error;

      updateFavicon(faviconUrl);
      setToast({ message: 'Settings saved successfully', type: 'success' });
      setTimeout(() => window.location.reload(), 1000);
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

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Mail className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
            <p className="text-sm text-gray-600">Email addresses and phone number for different departments</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              General Contact Email
            </label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="info@esgreport.ai"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="+44 20 1234 5678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Support Email
            </label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="support@esgreport.ai"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enterprise Email
            </label>
            <input
              type="email"
              value={enterpriseEmail}
              onChange={(e) => setEnterpriseEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="enterprise@esgreport.ai"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Partnerships Email
            </label>
            <input
              type="email"
              value={partnershipsEmail}
              onChange={(e) => setPartnershipsEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="partnerships@esgreport.ai"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Share2 className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Social Media Links</h3>
            <p className="text-sm text-gray-600">Connect your social media profiles</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={socialLinkedin}
              onChange={(e) => setSocialLinkedin(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="https://linkedin.com/company/esgreport-ai"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twitter/X URL
            </label>
            <input
              type="url"
              value={socialTwitter}
              onChange={(e) => setSocialTwitter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="https://twitter.com/esgreportai"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facebook URL
            </label>
            <input
              type="url"
              value={socialFacebook}
              onChange={(e) => setSocialFacebook(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="https://facebook.com/esgreportai"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Footer Content</h3>
            <p className="text-sm text-gray-600">Customize text displayed in the footer</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Footer Tagline
          </label>
          <input
            type="text"
            value={footerTagline}
            onChange={(e) => setFooterTagline(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Free AI-powered ESG report generation aligned with global standards."
            maxLength={200}
          />
          <p className="mt-1 text-sm text-gray-500">
            Text displayed below the logo in the footer ({footerTagline.length}/200 characters)
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Search className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">SEO Settings</h3>
            <p className="text-sm text-gray-600">Optimize your site for search engines</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Meta Title
            </label>
            <input
              type="text"
              value={siteMetaTitle}
              onChange={(e) => setSiteMetaTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="ESG Report AI - Free AI-Powered ESG Reporting"
              maxLength={60}
            />
            <p className="mt-1 text-sm text-gray-500">
              {siteMetaTitle.length}/60 characters (recommended: 50-60)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Meta Description
            </label>
            <textarea
              value={siteMetaDescription}
              onChange={(e) => setSiteMetaDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Generate professional ESG reports for free using AI. Aligned with GRI, TCFD, SASB, EU CSRD and other global sustainability reporting standards."
              rows={3}
              maxLength={160}
            />
            <p className="mt-1 text-sm text-gray-500">
              {siteMetaDescription.length}/160 characters (recommended: 150-160)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Meta Keywords
            </label>
            <input
              type="text"
              value={siteMetaKeywords}
              onChange={(e) => setSiteMetaKeywords(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="ESG reporting, sustainability reporting, AI ESG, GRI, TCFD, SASB"
            />
            <p className="mt-1 text-sm text-gray-500">
              Separate keywords with commas
            </p>
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
