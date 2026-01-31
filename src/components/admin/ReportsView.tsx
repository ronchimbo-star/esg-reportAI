import { useState, useEffect } from 'react';
import { Search, Download, Calendar, Mail, User, Building, Loader2, ChevronLeft, ChevronRight, Filter, Send, Archive, Trash2, StickyNote } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import NotesModal from './NotesModal';
import ConfirmDialog from '../ConfirmDialog';

interface Report {
  id: string;
  company_name: string;
  industries: string[];
  jurisdictions: string[];
  frameworks: string[];
  report_content: string;
  user_email: string | null;
  user_ip: string;
  created_at: string;
  email_sent: boolean;
  status: 'new' | 'followed_up' | 'archived';
  followed_up_at: string | null;
  followed_up_by: string | null;
  archived_at: string | null;
  archived_by: string | null;
  deleted_at: string | null;
  deleted_by: string | null;
  admin_notes: string | null;
}

interface AdminUser {
  id: string;
  user_id: string;
}

const ITEMS_PER_PAGE = 20;

export default function ReportsView() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'followed_up' | 'archived'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [currentNotesReport, setCurrentNotesReport] = useState<Report | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<{ id: string; companyName: string } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    console.log('[ReportsView] Component mounted, loading admin user...');
    loadAdminUser();
  }, []);

  useEffect(() => {
    console.log('[ReportsView] Status filter changed to:', statusFilter);
    loadReports();
  }, [statusFilter]);

  const loadAdminUser = async () => {
    try {
      console.log('[ReportsView] Loading admin user...');
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError) {
        console.error('[ReportsView] Auth error:', authError);
        return;
      }

      console.log('[ReportsView] Authenticated user:', user?.email, 'ID:', user?.id);

      if (user) {
        const { data, error: dbError } = await supabase
          .from('admin_users')
          .select('id, user_id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (dbError) {
          console.error('[ReportsView] Database error loading admin user:', dbError);
          return;
        }

        if (data) {
          console.log('[ReportsView] Admin user loaded successfully:', data);
          setAdminUser(data);
        } else {
          console.warn('[ReportsView] No admin user record found for:', user.email);
        }
      } else {
        console.warn('[ReportsView] No authenticated user found');
      }
    } catch (error) {
      console.error('[ReportsView] Error loading admin user:', error);
    }
  };

  const loadReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('generated_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      let filteredData = (data || []).filter(r => !r.deleted_at);

      if (statusFilter !== 'all') {
        filteredData = filteredData.filter(r => r.status === statusFilter);
      }

      setReports(filteredData);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error loading reports:', error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (
    reportId: string,
    newStatus: 'new' | 'followed_up' | 'archived'
  ) => {
    console.log('[ReportsView] updateReportStatus called', {
      reportId,
      newStatus,
      adminUser: adminUser?.id,
      hasAdminUser: !!adminUser
    });

    if (!adminUser) {
      console.error('[ReportsView] Cannot update status: Admin user not loaded');
      alert('Error: Admin user not loaded. Please refresh the page.');
      return;
    }

    try {
      setActionLoading(reportId);
      const updateData: any = {
        status: newStatus,
      };

      if (newStatus === 'followed_up') {
        updateData.followed_up_at = new Date().toISOString();
        updateData.followed_up_by = adminUser.id;
      } else if (newStatus === 'archived') {
        updateData.archived_at = new Date().toISOString();
        updateData.archived_by = adminUser.id;
      }

      console.log('[ReportsView] Updating report with data:', updateData);

      const { data, error } = await supabase
        .from('generated_reports')
        .update(updateData)
        .eq('id', reportId)
        .select();

      if (error) {
        console.error('[ReportsView] Database error updating report:', error);
        throw error;
      }

      console.log('[ReportsView] Report updated successfully:', data);
      await loadReports();
      alert(`Report status updated to ${newStatus}`);
    } catch (error: any) {
      console.error('[ReportsView] Error updating report status:', {
        error,
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code
      });
      alert(`Failed to update report status: ${error?.message || 'Unknown error'}. Check console for details.`);
    } finally {
      setActionLoading(null);
    }
  };

  const promptDeleteReport = (reportId: string, companyName: string) => {
    console.log('[ReportsView] promptDeleteReport called', { reportId, companyName });
    setReportToDelete({ id: reportId, companyName });
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteReport = async () => {
    console.log('[ReportsView] confirmDeleteReport called', {
      reportToDelete,
      adminUser: adminUser?.id,
      hasAdminUser: !!adminUser
    });

    if (!reportToDelete) {
      console.warn('[ReportsView] No report to delete');
      return;
    }

    if (!adminUser) {
      console.error('[ReportsView] Cannot delete: Admin user not loaded');
      alert('Error: Admin user not loaded. Please refresh the page.');
      return;
    }

    try {
      setActionLoading(reportToDelete.id);
      console.log('[ReportsView] Deleting report:', reportToDelete.id);

      const { data, error } = await supabase
        .from('generated_reports')
        .update({
          deleted_at: new Date().toISOString(),
          deleted_by: adminUser.id,
        })
        .eq('id', reportToDelete.id)
        .select();

      if (error) {
        console.error('[ReportsView] Database error deleting report:', error);
        throw error;
      }

      console.log('[ReportsView] Report deleted successfully:', data);
      await loadReports();
      setDeleteConfirmOpen(false);
      setReportToDelete(null);
      alert('Report deleted successfully');
    } catch (error: any) {
      console.error('[ReportsView] Error deleting report:', {
        error,
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code
      });
      alert(`Failed to delete report: ${error?.message || 'Unknown error'}. Check console for details.`);
    } finally {
      setActionLoading(null);
    }
  };

  const updateNotes = async (reportId: string, notes: string) => {
    console.log('[ReportsView] updateNotes called', { reportId, notesLength: notes.length });

    try {
      setActionLoading(reportId);
      console.log('[ReportsView] Updating notes for report:', reportId);

      const { data, error } = await supabase
        .from('generated_reports')
        .update({ admin_notes: notes })
        .eq('id', reportId)
        .select();

      if (error) {
        console.error('[ReportsView] Database error updating notes:', error);
        throw error;
      }

      console.log('[ReportsView] Notes updated successfully:', data);
      await loadReports();
      alert('Notes updated successfully');
    } catch (error: any) {
      console.error('[ReportsView] Error updating notes:', {
        error,
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code
      });
      alert(`Failed to update notes: ${error?.message || 'Unknown error'}. Check console for details.`);
    } finally {
      setActionLoading(null);
    }
  };

  const openNotesModal = (report: Report) => {
    console.log('[ReportsView] openNotesModal called', { reportId: report.id, companyName: report.company_name });
    setCurrentNotesReport(report);
    setNotesModalOpen(true);
  };

  const handleSaveNotes = (notes: string) => {
    if (currentNotesReport) {
      updateNotes(currentNotesReport.id, notes);
    }
  };

  const filteredReports = reports.filter((report) => {
    const search = searchTerm.toLowerCase();
    return (
      report.company_name?.toLowerCase().includes(search) ||
      report.user_email?.toLowerCase().includes(search) ||
      report.user_ip?.includes(search) ||
      report.industries?.some((i) => i?.toLowerCase().includes(search)) ||
      report.admin_notes?.toLowerCase().includes(search)
    );
  });

  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentReports = filteredReports.slice(startIndex, endIndex);

  const handleDownloadReport = (report: Report) => {
    console.log('[ReportsView] handleDownloadReport called', { reportId: report.id, companyName: report.company_name });

    try {
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${report.company_name} - ESG Report</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 20px; }
    h1 { color: #059669; border-bottom: 2px solid #d1fae5; padding-bottom: 10px; }
    h2 { color: #047857; margin-top: 30px; }
    .metadata { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; }
  </style>
</head>
<body>
  <h1>${report.company_name} - ESG Report</h1>
  <div class="metadata">
    <p><strong>Generated:</strong> ${new Date(report.created_at).toLocaleString()}</p>
    <p><strong>Contact:</strong> ${report.user_email || 'Not provided'}</p>
    <p><strong>Industries:</strong> ${report.industries.join(', ')}</p>
    <p><strong>Jurisdictions:</strong> ${report.jurisdictions.join(', ')}</p>
    <p><strong>Frameworks:</strong> ${report.frameworks.join(', ')}</p>
  </div>
  <hr>
  ${report.report_content.split('\n').map(line => {
    if (line.startsWith('# ')) return `<h1>${line.substring(2)}</h1>`;
    if (line.startsWith('## ')) return `<h2>${line.substring(3)}</h2>`;
    if (line.startsWith('### ')) return `<h3>${line.substring(4)}</h3>`;
    return `<p>${line}</p>`;
  }).join('\n')}
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.company_name.replace(/\s+/g, '-')}-esg-report-${report.id.substring(0, 8)}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log('[ReportsView] Report downloaded successfully');
    } catch (error: any) {
      console.error('[ReportsView] Error downloading report:', error);
      alert(`Failed to download report: ${error?.message || 'Unknown error'}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'followed_up':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new':
        return 'New';
      case 'followed_up':
        return 'Followed Up';
      case 'archived':
        return 'Archived';
      default:
        return status;
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
    <>
      <NotesModal
        isOpen={notesModalOpen}
        onClose={() => setNotesModalOpen(false)}
        onSave={handleSaveNotes}
        currentNotes={currentNotesReport?.admin_notes || ''}
        companyName={currentNotesReport?.company_name || ''}
      />

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Report"
        message={`Are you sure you want to delete the report for "${reportToDelete?.companyName}"? This will move it to the deleted folder.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDeleteReport}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setReportToDelete(null);
        }}
      />

      <div className="space-y-4 sm:space-y-6">
        {adminUser && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              ✓ Admin user loaded: ID {adminUser.id.substring(0, 8)}... (Check console for full details)
            </p>
          </div>
        )}

        {!adminUser && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">
              ⚠ Admin user not loaded. Action buttons will not work. Check console for errors.
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Generated Reports</h2>
            <p className="text-sm sm:text-base text-gray-600">Manage all generated ESG reports</p>
          </div>
          <div className="flex gap-4">
            <div className="text-left sm:text-right">
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">{reports.filter(r => r.status === 'new').length}</p>
              <p className="text-xs sm:text-sm text-gray-600">New</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-2xl sm:text-3xl font-bold text-green-600">{reports.filter(r => r.status === 'followed_up').length}</p>
              <p className="text-xs sm:text-sm text-gray-600">Followed Up</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-2xl sm:text-3xl font-bold text-gray-600">{reports.filter(r => r.status === 'archived').length}</p>
              <p className="text-xs sm:text-sm text-gray-600">Archived</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 sm:w-5 h-4 sm:h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by company, email, IP, industry, or notes..."
              className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Filter by Status</h3>
            <div className="flex flex-wrap gap-2">
              {(['all', 'new', 'followed_up', 'archived'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'All Reports' : getStatusLabel(status)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {currentReports.map((report) => (
            <div
              key={report.id}
              className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">{report.company_name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                      {getStatusLabel(report.status)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{report.user_email || 'No email provided'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>{new Date(report.created_at).toLocaleDateString()} {new Date(report.created_at).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{report.industries.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">IP: {report.user_ip}</span>
                    </div>
                  </div>

                  {report.admin_notes && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-yellow-900"><strong>Notes:</strong> {report.admin_notes}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {report.status === 'new' && (
                      <button
                        onClick={() => {
                          console.log('[ReportsView] Button clicked: Mark as Followed Up', report.id);
                          updateReportStatus(report.id, 'followed_up');
                        }}
                        disabled={actionLoading === report.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === report.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        Mark as Followed Up
                      </button>
                    )}
                    {report.status !== 'archived' && (
                      <button
                        onClick={() => {
                          console.log('[ReportsView] Button clicked: Archive', report.id);
                          updateReportStatus(report.id, 'archived');
                        }}
                        disabled={actionLoading === report.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === report.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Archive className="w-4 h-4" />
                        )}
                        Archive
                      </button>
                    )}
                    <button
                      onClick={() => {
                        console.log('[ReportsView] Button clicked: Notes', report.id);
                        openNotesModal(report);
                      }}
                      disabled={actionLoading === report.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium border border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <StickyNote className="w-4 h-4" />
                      {report.admin_notes ? 'Edit Notes' : 'Add Notes'}
                    </button>
                    <button
                      onClick={() => {
                        console.log('[ReportsView] Button clicked: Delete', report.id);
                        promptDeleteReport(report.id, report.company_name);
                      }}
                      disabled={actionLoading === report.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => {
                    console.log('[ReportsView] Button clicked: Download', report.id);
                    handleDownloadReport(report);
                  }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium w-full sm:w-auto"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {report.frameworks.map((framework) => (
                  <span
                    key={framework}
                    className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium"
                  >
                    {framework}
                  </span>
                ))}
                {report.jurisdictions.slice(0, 3).map((jurisdiction) => (
                  <span
                    key={jurisdiction}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                  >
                    {jurisdiction}
                  </span>
                ))}
              </div>

              {report.report_content && (
                <button
                  onClick={() => setSelectedReport(selectedReport?.id === report.id ? null : report)}
                  className="mt-4 text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  {selectedReport?.id === report.id ? 'Hide Preview' : 'Show Preview'}
                </button>
              )}

              {selectedReport?.id === report.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                    {report.report_content.substring(0, 1000)}
                    {report.report_content.length > 1000 && '...'}
                  </pre>
                </div>
              )}
            </div>
          ))}

          {currentReports.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No reports found matching your search</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredReports.length)} of {filteredReports.length} reports
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    if (totalPages <= 7) return true;
                    if (page === 1 || page === totalPages) return true;
                    if (Math.abs(page - currentPage) <= 1) return true;
                    return false;
                  })
                  .map((page, index, array) => (
                    <div key={page} className="flex items-center">
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-green-600 text-white'
                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    </div>
                  ))}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
