import { useState } from 'react';
import { FileText, Newspaper, Image } from 'lucide-react';
import StaticPageManagement from './StaticPageManagement';
import NewsArticleManagement from './NewsArticleManagement';
import MediaLibraryManagement from './MediaLibraryManagement';

export default function CMSManagement() {
  const [activeTab, setActiveTab] = useState<'pages' | 'news' | 'media'>('pages');

  const tabs = [
    { id: 'pages' as const, label: 'Static Pages', icon: FileText },
    { id: 'news' as const, label: 'News Articles', icon: Newspaper },
    { id: 'media' as const, label: 'Media Library', icon: Image },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Content Management</h2>
        <p className="text-gray-600">Manage static pages and news articles with full HTML and SEO control</p>
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

      <div>
        {activeTab === 'pages' && <StaticPageManagement />}
        {activeTab === 'news' && <NewsArticleManagement />}
        {activeTab === 'media' && <MediaLibraryManagement />}
      </div>
    </div>
  );
}
