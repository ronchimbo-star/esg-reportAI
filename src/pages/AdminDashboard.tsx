import { useState, useEffect } from 'react';
import { LogOut, Settings, FileText, Database, Ban, Shield, Layout, Globe, BarChart3, MessageCircle, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEOSettings from '../components/admin/SEOSettings';
import ReportsView from '../components/admin/ReportsView';
import DatabaseExport from '../components/admin/DatabaseExport';
import IPBanManagement from '../components/admin/IPBanManagement';
import IPWhitelistManagement from '../components/admin/IPWhitelistManagement';
import CMSManagement from '../components/admin/CMSManagement';
import SiteSettings from '../components/admin/SiteSettings';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';
import CommentModeration from '../components/admin/CommentModeration';
import ContactSubmissions from '../components/admin/ContactSubmissions';

type TabType = 'analytics' | 'reports' | 'cms' | 'comments' | 'contact' | 'site' | 'seo' | 'ip-bans' | 'ip-whitelist' | 'database';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('analytics');
  const [adminInfo, setAdminInfo] = useState<{ email: string; full_name: string } | null>(null);

  useEffect(() => {
    loadAdminInfo();
  }, []);

  const loadAdminInfo = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('admin_users')
        .select('email, full_name')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) setAdminInfo(data);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const tabs = [
    { id: 'analytics' as TabType, label: 'Analytics', icon: BarChart3 },
    { id: 'reports' as TabType, label: 'Reports', icon: FileText },
    { id: 'cms' as TabType, label: 'CMS', icon: Layout },
    { id: 'comments' as TabType, label: 'Comments', icon: MessageCircle },
    { id: 'contact' as TabType, label: 'Contact', icon: Mail },
    { id: 'site' as TabType, label: 'Site Settings', icon: Globe },
    { id: 'seo' as TabType, label: 'SEO', icon: Settings },
    { id: 'ip-bans' as TabType, label: 'IP Bans', icon: Ban },
    { id: 'ip-whitelist' as TabType, label: 'IP Whitelist', icon: Shield },
    { id: 'database' as TabType, label: 'Database', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <img src="/esgreport-icon.png" alt="ESG Report" className="h-8 sm:h-10" />
              <div>
                <h1 className="text-base sm:text-xl font-bold text-gray-900">Admin Dashboard</h1>
                {adminInfo && (
                  <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">{adminInfo.full_name} ({adminInfo.email})</p>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex-1 inline-flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 font-medium transition-colors text-xs sm:text-sm md:text-base whitespace-nowrap
                      ${activeTab === tab.id
                        ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === 'seo' && <SEOSettings />}
            {activeTab === 'analytics' && <AnalyticsDashboard />}
            {activeTab === 'reports' && <ReportsView />}
            {activeTab === 'cms' && <CMSManagement />}
            {activeTab === 'comments' && <CommentModeration />}
            {activeTab === 'contact' && <ContactSubmissions />}
            {activeTab === 'site' && <SiteSettings />}
            {activeTab === 'database' && <DatabaseExport />}
            {activeTab === 'ip-bans' && <IPBanManagement />}
            {activeTab === 'ip-whitelist' && <IPWhitelistManagement />}
          </div>
        </div>
      </div>
    </div>
  );
}
