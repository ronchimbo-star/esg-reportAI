import { useState, useEffect } from 'react';
import { TrendingUp, Users, FileText, Download, Eye, BarChart3, Calendar, Globe, Activity } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  totalReports: number;
  reportsThisMonth: number;
  totalPageViews: number;
  pageViewsThisMonth: number;
  totalDownloads: number;
  downloadsThisMonth: number;
  totalUsers: number;
  usersThisMonth: number;
}

interface TopPage {
  page_url: string;
  view_count: number;
}

interface TopIndustry {
  industry: string;
  count: number;
}

interface TopFramework {
  framework: string;
  count: number;
}

interface ReportTrend {
  date: string;
  count: number;
}

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalReports: 0,
    reportsThisMonth: 0,
    totalPageViews: 0,
    pageViewsThisMonth: 0,
    totalDownloads: 0,
    downloadsThisMonth: 0,
    totalUsers: 0,
    usersThisMonth: 0,
  });
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [topIndustries, setTopIndustries] = useState<TopIndustry[]>([]);
  const [topFrameworks, setTopFrameworks] = useState<TopFramework[]>([]);
  const [reportTrends, setReportTrends] = useState<ReportTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days' | 'all'>('30days');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      await Promise.allSettled([
        loadDashboardStats(),
        loadTopPages(),
        loadTopIndustries(),
        loadTopFrameworks(),
        loadReportTrends(),
      ]);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  const getDateFilter = () => {
    const now = new Date();
    switch (timeRange) {
      case '7days':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case '30days':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      case '90days':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return '2020-01-01';
    }
  };

  const loadDashboardStats = async () => {
    try {
      const firstOfMonth = new Date();
      firstOfMonth.setDate(1);
      firstOfMonth.setHours(0, 0, 0, 0);

      const { data: allReports } = await supabase
        .from('generated_reports')
        .select('created_at, deleted_at');

      const activeReports = (allReports || []).filter(r => !r.deleted_at);
      const reportsThisMonth = activeReports.filter(r => new Date(r.created_at) >= firstOfMonth);

      setStats({
        totalReports: activeReports.length,
        reportsThisMonth: reportsThisMonth.length,
        totalPageViews: 0,
        pageViewsThisMonth: 0,
        totalDownloads: 0,
        downloadsThisMonth: 0,
        totalUsers: 0,
        usersThisMonth: 0,
      });
    } catch (error) {
      console.error('[Analytics] Error loading dashboard stats:', error);
    }
  };

  const loadTopPages = async () => {
    try {
      setTopPages([]);
    } catch (error) {
      setTopPages([]);
    }
  };

  const loadTopIndustries = async () => {
    try {
      const dateFilter = getDateFilter();
      const { data, error } = await supabase
        .from('generated_reports')
        .select('industries, deleted_at')
        .gte('created_at', dateFilter);

      if (error || !data) {
        setTopIndustries([]);
        return;
      }

      const activeReports = data.filter(r => !r.deleted_at);

      const industryCounts: Record<string, number> = {};
      activeReports.forEach(report => {
        report.industries?.forEach((industry: string) => {
          industryCounts[industry] = (industryCounts[industry] || 0) + 1;
        });
      });

      const sorted = Object.entries(industryCounts)
        .map(([industry, count]) => ({ industry, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      setTopIndustries(sorted);
    } catch (error) {
      setTopIndustries([]);
    }
  };

  const loadTopFrameworks = async () => {
    try {
      const dateFilter = getDateFilter();
      const { data, error } = await supabase
        .from('generated_reports')
        .select('frameworks, deleted_at')
        .gte('created_at', dateFilter);

      if (error || !data) {
        setTopFrameworks([]);
        return;
      }

      const activeReports = data.filter(r => !r.deleted_at);

      const frameworkCounts: Record<string, number> = {};
      activeReports.forEach(report => {
        report.frameworks?.forEach((framework: string) => {
          frameworkCounts[framework] = (frameworkCounts[framework] || 0) + 1;
        });
      });

      const sorted = Object.entries(frameworkCounts)
        .map(([framework, count]) => ({ framework, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      setTopFrameworks(sorted);
    } catch (error) {
      setTopFrameworks([]);
    }
  };

  const loadReportTrends = async () => {
    try {
      const dateFilter = getDateFilter();
      const { data, error } = await supabase
        .from('generated_reports')
        .select('created_at, deleted_at')
        .gte('created_at', dateFilter)
        .order('created_at', { ascending: true});

      if (error || !data) {
        setReportTrends([]);
        return;
      }

      const activeReports = data.filter(r => !r.deleted_at);

      const dateCounts: Record<string, number> = {};
      activeReports.forEach(report => {
        const date = new Date(report.created_at).toISOString().split('T')[0];
        dateCounts[date] = (dateCounts[date] || 0) + 1;
      });

      const trends = Object.entries(dateCounts)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

      setReportTrends(trends);
    } catch (error) {
      setReportTrends([]);
    }
  };

  const StatCard = ({ icon: Icon, title, value, change, color }: { icon: any, title: string, value: string | number, change: string, color: string }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-sm text-gray-600">{change}</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-sm text-gray-600 mt-1">{title}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-4 text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Comprehensive insights into application usage and performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FileText}
          title="ESG Reports Generated"
          value={stats.totalReports}
          change={`+${stats.reportsThisMonth} this month`}
          color="bg-blue-600"
        />
        <StatCard
          icon={Eye}
          title="Total Page Views"
          value={stats.totalPageViews.toLocaleString()}
          change={`+${stats.pageViewsThisMonth.toLocaleString()} this month`}
          color="bg-green-600"
        />
        <StatCard
          icon={Download}
          title="Template Downloads"
          value={stats.totalDownloads}
          change={`+${stats.downloadsThisMonth} this month`}
          color="bg-purple-600"
        />
        <StatCard
          icon={Users}
          title="Registered Users"
          value={stats.totalUsers}
          change={`+${stats.usersThisMonth} this month`}
          color="bg-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-bold text-gray-900">Report Generation Trends</h3>
          </div>
          {reportTrends.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No data available for this period</p>
          ) : (
            <div className="space-y-2">
              <div className="flex items-end justify-between h-48 gap-2">
                {reportTrends.map((trend, index) => {
                  const maxCount = Math.max(...reportTrends.map(t => t.count), 1);
                  const height = (trend.count / maxCount) * 100;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-green-600 rounded-t transition-all hover:bg-green-700"
                        style={{ height: `${height}%`, minHeight: '20px' }}
                        title={`${trend.date}: ${trend.count} reports`}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="text-xs text-gray-500 text-center pt-2">
                {reportTrends.length > 0 && (
                  <span>{new Date(reportTrends[0].date).toLocaleDateString()} - {new Date(reportTrends[reportTrends.length - 1].date).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">Top Industries</h3>
          </div>
          {topIndustries.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No industry data available</p>
          ) : (
            <div className="space-y-3">
              {topIndustries.slice(0, 5).map((item, index) => {
                const maxCount = topIndustries[0].count;
                const percentage = (item.count / maxCount) * 100;
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{item.industry}</span>
                      <span className="text-sm text-gray-600">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">Popular Frameworks</h3>
          </div>
          {topFrameworks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No framework data available</p>
          ) : (
            <div className="space-y-3">
              {topFrameworks.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold text-sm">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-700">{item.framework}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{item.count} reports</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-6 h-6 text-orange-600" />
            <h3 className="text-lg font-bold text-gray-900">Most Viewed Pages</h3>
          </div>
          {topPages.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No page view data available</p>
          ) : (
            <div className="space-y-3">
              {topPages.slice(0, 5).map((page, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{page.page_url}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900 ml-4">{page.view_count} views</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
