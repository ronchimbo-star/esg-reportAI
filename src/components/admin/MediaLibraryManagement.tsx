import { useState, useEffect } from 'react';
import { Search, Upload, Edit2, Trash2, X, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Toast from './Toast';

interface MediaFile {
  id: string;
  file_name: string;
  file_path: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  alt_text: string | null;
  caption: string | null;
  title: string | null;
  description: string | null;
  width: number | null;
  height: number | null;
  uploaded_at: string;
}

interface AdminUser {
  id: string;
  user_id: string;
}

export default function MediaLibraryManagement() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingFile, setEditingFile] = useState<MediaFile | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    alt_text: '',
    caption: '',
    title: '',
    description: '',
  });

  useEffect(() => {
    loadAdminUser();
    loadMediaFiles();
  }, []);

  const loadAdminUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('admin_users')
          .select('id, user_id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (data) {
          setAdminUser(data);
        }
      }
    } catch (error) {
      console.error('Error loading admin user:', error);
    }
  };

  const loadMediaFiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('media_library')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setMediaFiles(data || []);
    } catch (error) {
      console.error('Error loading media files:', error);
      showToast('Failed to load media files', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `site-assets/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('site-assets')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          showToast(`Failed to upload ${file.name}`, 'error');
          continue;
        }

        const { data: urlData } = supabase.storage
          .from('site-assets')
          .getPublicUrl(filePath);

        let width = null;
        let height = null;

        if (file.type.startsWith('image/')) {
          const img = new Image();
          const imgLoadPromise = new Promise<void>((resolve) => {
            img.onload = () => {
              width = img.width;
              height = img.height;
              resolve();
            };
          });
          img.src = URL.createObjectURL(file);
          await imgLoadPromise;
          URL.revokeObjectURL(img.src);
        }

        const { error: dbError } = await supabase
          .from('media_library')
          .insert([{
            file_name: file.name,
            file_path: filePath,
            file_url: urlData.publicUrl,
            file_size: file.size,
            mime_type: file.type,
            width,
            height,
            uploaded_by: adminUser?.id,
          }]);

        if (dbError) {
          console.error('Database error:', dbError);
          showToast(`Failed to save ${file.name} metadata`, 'error');
        }
      }

      showToast('Files uploaded successfully', 'success');
      loadMediaFiles();
    } catch (error: any) {
      console.error('Error uploading files:', error);
      showToast(error.message || 'Failed to upload files', 'error');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleEdit = (file: MediaFile) => {
    setEditingFile(file);
    setFormData({
      alt_text: file.alt_text || '',
      caption: file.caption || '',
      title: file.title || '',
      description: file.description || '',
    });
    setShowEditor(true);
  };

  const handleSave = async () => {
    if (!editingFile) return;

    try {
      const { error } = await supabase
        .from('media_library')
        .update(formData)
        .eq('id', editingFile.id);

      if (error) throw error;
      showToast('Media metadata updated successfully', 'success');
      setShowEditor(false);
      loadMediaFiles();
    } catch (error: any) {
      console.error('Error updating media:', error);
      showToast(error.message || 'Failed to update media', 'error');
    }
  };

  const handleDelete = async (file: MediaFile) => {
    if (!confirm(`Are you sure you want to delete "${file.file_name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error: storageError } = await supabase.storage
        .from('site-assets')
        .remove([file.file_path]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
      }

      const { error: dbError } = await supabase
        .from('media_library')
        .delete()
        .eq('id', file.id);

      if (dbError) throw dbError;
      showToast('Media deleted successfully', 'success');
      loadMediaFiles();
    } catch (error) {
      console.error('Error deleting media:', error);
      showToast('Failed to delete media', 'error');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('URL copied to clipboard', 'success');
  };

  const filteredFiles = mediaFiles.filter((file) => {
    const search = searchTerm.toLowerCase();
    return (
      file.file_name.toLowerCase().includes(search) ||
      file.alt_text?.toLowerCase().includes(search) ||
      file.title?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Media Library</h2>
            <p className="text-gray-600">Upload and manage media files</p>
          </div>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Upload Files'}
            <input
              type="file"
              multiple
              accept="image/*,video/*,application/pdf"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search media..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {filteredFiles.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-500">No media files found</p>
            <p className="text-sm text-gray-400">Upload files to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFiles.map((file) => (
              <div key={file.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                  {file.mime_type.startsWith('image/') ? (
                    <img
                      src={file.file_url}
                      alt={file.alt_text || file.file_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                      <span className="text-xs text-gray-500">{file.mime_type}</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 text-sm truncate" title={file.file_name}>
                    {file.file_name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatFileSize(file.file_size)}
                    {file.width && file.height && ` • ${file.width}x${file.height}`}
                  </p>
                  {file.alt_text && (
                    <p className="text-xs text-gray-600 mt-1 truncate" title={file.alt_text}>
                      Alt: {file.alt_text}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => copyToClipboard(file.file_url)}
                      className="flex-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      Copy URL
                    </button>
                    <button
                      onClick={() => handleEdit(file)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit metadata"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(file)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showEditor && editingFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-2xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Edit Media Metadata</h3>
              <button
                onClick={() => setShowEditor(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                {editingFile.mime_type.startsWith('image/') ? (
                  <img
                    src={editingFile.file_url}
                    alt={editingFile.file_name}
                    className="max-h-48 rounded"
                  />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">{editingFile.file_name}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alt Text (for images)
                </label>
                <input
                  type="text"
                  value={formData.alt_text}
                  onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Describe the image for accessibility"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caption
                </label>
                <input
                  type="text"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowEditor(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
