import { useState, useEffect } from 'react';
import { Ban, Plus, Trash2, Shield, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Toast from './Toast';

interface BannedIP {
  id: string;
  ip_address: string;
  reason: string;
  banned_at: string;
  is_active: boolean;
}

export default function IPBanManagement() {
  const [bannedIPs, setBannedIPs] = useState<BannedIP[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newIP, setNewIP] = useState('');
  const [newReason, setNewReason] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  useEffect(() => {
    loadBannedIPs();
  }, []);

  const loadBannedIPs = async () => {
    try {
      const { data, error } = await supabase
        .from('banned_ips')
        .select('*')
        .order('banned_at', { ascending: false });

      if (error) throw error;
      setBannedIPs(data || []);
    } catch (error) {
      console.error('Error loading banned IPs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBan = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newIP.trim() || !newReason.trim()) {
      setToast({ message: 'Please provide both IP address and reason', type: 'warning' });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: adminData } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      const { error } = await supabase.from('banned_ips').insert({
        ip_address: newIP.trim(),
        reason: newReason.trim(),
        banned_by: adminData?.id,
        is_active: true,
      });

      if (error) {
        if (error.code === '23505') {
          setToast({ message: 'This IP address is already banned', type: 'warning' });
        } else {
          throw error;
        }
        return;
      }

      setToast({ message: 'IP address banned successfully', type: 'success' });
      setNewIP('');
      setNewReason('');
      setShowAddForm(false);
      loadBannedIPs();
    } catch (error) {
      setToast({ message: 'Failed to ban IP address', type: 'error' });
    }
  };

  const handleToggleBan = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('banned_ips')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      setToast({ message: `Ban ${!currentStatus ? 'activated' : 'deactivated'} successfully`, type: 'success' });
      loadBannedIPs();
    } catch (error) {
      setToast({ message: 'Failed to update ban status', type: 'error' });
    }
  };

  const handleDeleteBan = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this ban?')) return;

    try {
      const { error } = await supabase.from('banned_ips').delete().eq('id', id);

      if (error) throw error;

      setToast({ message: 'Ban removed successfully', type: 'success' });
      loadBannedIPs();
    } catch (error) {
      setToast({ message: 'Failed to remove ban', type: 'error' });
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
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">IP Ban Management</h2>
            <p className="text-sm sm:text-base text-gray-600">Block IP addresses from generating reports</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm w-full sm:w-auto"
          >
            <Plus className="w-5 h-5" />
            Add Ban
          </button>
        </div>

      {showAddForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Add New IP Ban</h3>
          <form onSubmit={handleAddBan} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IP Address
              </label>
              <input
                type="text"
                value={newIP}
                onChange={(e) => setNewIP(e.target.value)}
                placeholder="192.168.1.1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason
              </label>
              <textarea
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                placeholder="Spam, abuse, or other reason..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Ban IP Address
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewIP('');
                  setNewReason('');
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {bannedIPs.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No banned IP addresses</p>
          </div>
        ) : (
          bannedIPs.map((ban) => (
            <div
              key={ban.id}
              className={`bg-white border-2 rounded-lg p-4 sm:p-6 ${ban.is_active ? 'border-red-200' : 'border-gray-200'}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <Ban className={`w-4 sm:w-5 h-4 sm:h-5 ${ban.is_active ? 'text-red-600' : 'text-gray-400'}`} />
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">{ban.ip_address}</h3>
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                        ban.is_active
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {ban.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 mb-2">{ban.reason}</p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Banned on {new Date(ban.banned_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleToggleBan(ban.id, ban.is_active)}
                    className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                      ban.is_active
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    {ban.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDeleteBan(ban.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
    </>
  );
}
