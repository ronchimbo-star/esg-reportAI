import { useState, useEffect } from 'react';
import { Mail, Eye, Trash2, Edit2, X, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Toast from './Toast';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  admin_notes: string | null;
  ip_address: string | null;
  created_at: string;
  updated_at: string;
}

export default function ContactSubmissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [status, setStatus] = useState<'new' | 'read' | 'replied'>('new');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'read' | 'replied'>('all');

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error loading submissions:', error);
      setToast({ message: 'Failed to load contact submissions', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleView = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setAdminNotes(submission.admin_notes || '');
    setStatus(submission.status);
    setShowModal(true);

    if (submission.status === 'new') {
      updateStatus(submission.id, 'read', submission.admin_notes);
    }
  };

  const updateStatus = async (id: string, newStatus: 'new' | 'read' | 'replied', notes: string | null) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({
          status: newStatus,
          admin_notes: notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
      await loadSubmissions();
    } catch (error) {
      console.error('Error updating submission:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    if (!selectedSubmission) return;

    try {
      await updateStatus(selectedSubmission.id, status, adminNotes);
      setToast({ message: 'Submission updated successfully', type: 'success' });
      setShowModal(false);
      setSelectedSubmission(null);
    } catch (error) {
      setToast({ message: 'Failed to update submission', type: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setToast({ message: 'Submission deleted successfully', type: 'success' });
      await loadSubmissions();
      if (selectedSubmission?.id === id) {
        setShowModal(false);
        setSelectedSubmission(null);
      }
    } catch (error) {
      console.error('Error deleting submission:', error);
      setToast({ message: 'Failed to delete submission', type: 'error' });
    }
  };

  const filteredSubmissions = filterStatus === 'all'
    ? submissions
    : submissions.filter(s => s.status === filterStatus);

  const getStatusBadge = (status: string) => {
    const styles = {
      new: 'bg-blue-100 text-blue-800',
      read: 'bg-yellow-100 text-yellow-800',
      replied: 'bg-green-100 text-green-800',
    };
    return styles[status as keyof typeof styles] || styles.new;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contact Submissions</h2>
          <p className="text-gray-600 mt-1">
            {submissions.length} total submission{submissions.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Filter:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
        </div>
      </div>

      {filteredSubmissions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
          <p className="text-gray-600">
            {filterStatus === 'all'
              ? 'Contact form submissions will appear here'
              : `No ${filterStatus} submissions found`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Subject
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(submission.status)}`}>
                        {submission.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">{submission.name}</div>
                      <div className="text-sm text-gray-500 md:hidden">{submission.email}</div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div className="text-sm text-gray-900">{submission.email}</div>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <div className="text-sm text-gray-900 truncate max-w-xs">{submission.subject}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="text-sm text-gray-900">
                        {new Date(submission.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(submission.created_at).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleView(submission)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(submission.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && selectedSubmission && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setShowModal(false)}
            ></div>

            <div className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-xl font-bold text-gray-900">Contact Submission</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <p className="text-gray-900">{selectedSubmission.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <a
                      href={`mailto:${selectedSubmission.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {selectedSubmission.email}
                    </a>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <p className="text-gray-900">{selectedSubmission.subject}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Submitted</label>
                    <p className="text-gray-900 text-sm">
                      {new Date(selectedSubmission.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IP Address</label>
                    <p className="text-gray-900 text-sm">{selectedSubmission.ip_address || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedSubmission.message}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Notes
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 resize-none"
                    placeholder="Add internal notes about this submission..."
                  />
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between gap-4">
                <button
                  onClick={() => handleDelete(selectedSubmission.id)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
