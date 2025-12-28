import { useState } from 'react';
import { FileText, Layout, Newspaper, Image } from 'lucide-react';
import ESGTemplatesManagement from './ESGTemplatesManagement';
import NewsArticlesManagement from './NewsArticlesManagement';
import MediaLibraryManagement from './MediaLibraryManagement';

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

        {activeTab === 'templates' && <ESGTemplatesManagement />}

        {activeTab === 'news' && <NewsArticlesManagement />}

        {activeTab === 'media' && <MediaLibraryManagement />}
      </div>
    </div>
  );
}
