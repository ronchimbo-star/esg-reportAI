import { useState } from 'react';
import { FileText, Layout, Newspaper, Image } from 'lucide-react';

export default function CMSManagement() {
  const [activeTab, setActiveTab] = useState<'pages' | 'templates' | 'news' | 'media'>('pages');

  const tabs = [
    { id: 'pages' as const, label: 'Pages', icon: FileText },
    { id: 'templates' as const, label: 'ESG Templates', icon: Layout },
    { id: 'news' as const, label: 'News Articles', icon: Newspaper },
    { id: 'media' as const, label: 'Media Library', icon: Image },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Content Management</h2>
        <p className="text-gray-600">Manage pages, templates, news articles, and media</p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {activeTab === 'pages' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Manage Pages</h3>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                Create New Page
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Manage static pages like About, Contact, Privacy Policy, Terms of Service, and Cookie Policy.
              Each page includes SEO metadata, HTML content, and publishing controls.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> This is a placeholder interface. Full CRUD operations for pages will be implemented with forms for title, slug, meta description, keywords, OG tags, and HTML content editor.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">ESG Templates</h3>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                Create New Template
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Create and manage ESG report templates filterable by industry, framework, and jurisdiction.
              Templates include featured images, download counters, and SEO settings.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> This is a placeholder interface. Full management includes template editor, industry/framework/jurisdiction selection, featured image upload, and download tracking.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'news' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">News & Blog Articles</h3>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                Create New Article
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Write and publish news articles and blog posts about ESG insights, industry trends, and AI innovations.
              Includes featured images, categories, tags, and full SEO controls.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> This is a placeholder interface. Full editor includes rich text editing, featured image selection, category/tag management, publishing schedule, and SEO fields.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Media Library</h3>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                Upload Media
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Upload and manage images and media files. Set alt text, captions, titles, and descriptions for SEO.
              All uploaded media can be used across pages, templates, and articles.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> This is a placeholder interface. Full media manager includes drag-drop upload, image preview grid, SEO metadata editor, and file management tools.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h4 className="text-lg font-bold text-yellow-900 mb-2">Implementation Status</h4>
        <p className="text-yellow-900 mb-4">
          The CMS database structure is complete and ready. This interface provides a foundation for full content management.
          For production use, implement:
        </p>
        <ul className="list-disc list-inside space-y-2 text-yellow-900">
          <li>Rich text editor (e.g., TipTap, Quill, or Draft.js)</li>
          <li>Image upload with Supabase Storage integration</li>
          <li>Form validation and error handling</li>
          <li>Real-time preview functionality</li>
          <li>Drag-and-drop media management</li>
          <li>Automatic sitemap generation on publish</li>
        </ul>
      </div>
    </div>
  );
}
