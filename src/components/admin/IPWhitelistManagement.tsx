import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, XCircle, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Toast from './Toast';

interface WhitelistedIP {
  id: string;
  ip_address: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

export default function IPWhitelistManagement() {
  const [whitelistedIPs, setWhitelistedIPs] = useState<WhitelistedIP[]>([]);
  const [loading, setLoading] = useState(true);
  const [newIP, setNewIP] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  useEffect(() => {
    fetchWhitelistedIPs();
  }, []);

  const fetchWhitelistedIPs = async () => {
    try {
      const { data, error } = await supabase
        .from('whitelisted_ips')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch error:', error);
        throw error;
      }
      setWhitelistedIPs(data || []);
    } catch (error: any) {
      console.error('Error fetching whitelisted IPs:', error);
      setToast({ message: 'Failed to load whitelisted IPs', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddIP = async () => {
    if (!newIP.trim()) {
      setToast({ message: 'Please enter an IP address', type: 'warning' });
      return;
    }

    setAdding(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('whitelisted_ips')
        .insert({
          ip_address: newIP.trim(),
          description: newDescription.trim() || 'No description',
          is_active: true,
          created_by: user?.id || null,
        });

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }

      setNewIP('');
      setNewDescription('');
      await fetchWhitelistedIPs();
      setToast({ message: 'IP address whitelisted successfully!', type: 'success' });
    } catch (error: any) {
      console.error('Error adding IP:', error);
      if (error.code === '23505') {
        setToast({ message: 'This IP address is already in the whitelist', type: 'warning' });
      } else {
        setToast({ message: 'Failed to add IP address', type: 'error' });
      }
    } finally {
      setAdding(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('whitelisted_ips')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      await fetchWhitelistedIPs();
      setToast({ message: 'IP status updated successfully', type: 'success' });
    } catch (error) {
      console.error('Error toggling IP status:', error);
      setToast({ message: 'Failed to update IP status', type: 'error' });
    }
  };

  const handleDelete = async (id: string, ipAddress: string) => {
    if (!confirm(`Are you sure you want to permanently delete ${ipAddress} from the whitelist?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('whitelisted_ips')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchWhitelistedIPs();
      setToast({ message: 'IP address removed successfully', type: 'success' });
    } catch (error) {
      console.error('Error deleting IP:', error);
      setToast({ message: 'Failed to delete IP address', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900">IP Whitelist Management</h2>
        </div>
        <p className="text-gray-600 text-sm">
          Manage IP addresses that bypass rate limiting. Whitelisted IPs can generate unlimited reports.
        </p>
      </div>

      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New IP Address</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              IP Address *
            </label>
            <input
              type="text"
              value={newIP}
              onChange={(e) => setNewIP(e.target.value)}
              placeholder="e.g., 192.168.1.100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="e.g., Development machine"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAddIP}
              disabled={adding}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4" />
              {adding ? 'Adding...' : 'Add to Whitelist'}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Whitelisted IP Addresses ({whitelistedIPs.length})
        </h3>

        {whitelistedIPs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Shield className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No IP addresses whitelisted yet</p>
            <p className="text-sm mt-1">Add an IP address above to bypass rate limiting</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Added
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {whitelistedIPs.map((ip) => (
                  <tr key={ip.id} className={!ip.is_active ? 'bg-gray-50 opacity-60' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ip.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <XCircle className="w-3 h-3" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono font-semibold text-gray-900">{ip.ip_address}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{ip.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(ip.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleActive(ip.id, ip.is_active)}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            ip.is_active
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {ip.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(ip.id, ip.ip_address)}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors text-xs font-medium inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
