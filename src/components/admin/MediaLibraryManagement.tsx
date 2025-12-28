import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Upload, Loader2, Trash2, Copy, Image as ImageIcon, Search, X } from 'lucide-react';
import Toast from './Toast';

interface MediaItem {
  id: string;
  file_name: string;
  file_path: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  alt_text: string | null;
  caption: string | null;
  title: string | null;
  width: number | null;
  height: number | null;
  uploaded_at: string;
}

export default function MediaLibraryManagement() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('media_library')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setMedia(data || []);
    } catch (error) {
      console.error('Error loading media:', error);
      showToast('Failed to load media', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: adminData } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          showToast(`Skipped ${file.name}: Not an image file`, 'error');
          continue;
        }

        if (file.size > 10 * 1024 * 1024) {
          showToast(`Skipped ${file.name}: File too large (max 10MB)`, 'error');
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `media/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('site-assets')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('site-assets')
          .getPublicUrl(filePath);

        const img = new Image();
        img.onload = async () => {
          const { error: dbError } = await supabase
            .from('media_library')
            .insert({
              file_name: file.name,
              file_path: filePath,
              file_url: publicUrl,
              file_size: file.size,
              mime_type: file.type,
              width: img.width,
              height: img.height,
              uploaded_by: adminData?.id,
            });

          if (dbError) {
            console.error('Error saving to database:', dbError);
            await supabase.storage.from('site-assets').remove([filePath]);
            throw dbError;
          }

          await loadMedia();
        };

        img.onerror = async () => {
          await supabase.storage.from('site-assets').remove([filePath]);
          showToast(`Failed to process ${file.name}`, 'error');
        };

        img.src = URL.createObjectURL(file);
      }

      showToast('Files uploaded successfully', 'success');
      e.target.value = '';
    } catch (error: any) {
      console.error('Error uploading files:', error);
      showToast(error.message || 'Failed to upload files', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Are you sure you want to delete "${item.file_name}"?`)) return;

    try {
      const { error: storageError } = await supabase.storage
        .from('site-assets')
        .remove([item.file_path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('media_library')
        .delete()
        .eq('id', item.id);

      if (dbError) throw dbError;

      showToast('Media deleted successfully', 'success');
      loadMedia();
      if (selectedMedia?.id === item.id) {
        setSelectedMedia(null);
      }
    } catch (error) {
      console.error('Error deleting media:', error);
      showToast('Failed to delete media', 'error');
    }
  };

  const handleUpdateMetadata = async (id: string, updates: Partial<MediaItem>) => {
    try {
      const { error } = await supabase
        .from('media_library')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      showToast('Metadata updated successfully', 'success');
      loadMedia();
    } catch (error) {
      console.error('Error updating metadata:', error);
      showToast('Failed to update metadata', 'error');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('URL copied to clipboard', 'success');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filteredMedia = media.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item.file_name.toLowerCase().includes(search) ||
      item.title?.toLowerCase().includes(search) ||
      item.alt_text?.toLowerCase().includes(search) ||
      item.caption?.toLowerCase().includes(search)
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Media Library</h2>
        <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
          <Upload className="w-5 h-5" />
          {uploading ? 'Uploading...' : 'Upload Images'}
          <input
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </label>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <ImageIcon className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-1">How to Use Images</h3>
            <p className="text-sm text-blue-800 mb-2">
              Click on any image to view details and copy its URL. Use the URL in your content:
            </p>
            <div className="bg-white rounded p-2 font-mono text-xs text-gray-800 border border-blue-200">
              &lt;img src="YOUR_IMAGE_URL" alt="Description" /&gt;
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by filename, title, alt text, or caption..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {filteredMedia.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No images uploaded yet</p>
          <p className="text-sm text-gray-500">Upload your first image to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedMedia(item)}
              className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-green-500 transition-all"
            >
              <img
                src={item.file_url}
                alt={item.alt_text || item.file_name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center p-2">
                  <p className="text-xs font-medium truncate">{item.file_name}</p>
                  <p className="text-xs">{formatFileSize(item.file_size)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">Image Details</h3>
              <button
                onClick={() => setSelectedMedia(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <img
                  src={selectedMedia.file_url}
                  alt={selectedMedia.alt_text || selectedMedia.file_name}
                  className="w-full max-h-96 object-contain bg-gray-100 rounded-lg"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={selectedMedia.file_url}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(selectedMedia.file_url)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Filename:</span>
                    <p className="font-medium">{selectedMedia.file_name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">File Size:</span>
                    <p className="font-medium">{formatFileSize(selectedMedia.file_size)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Dimensions:</span>
                    <p className="font-medium">
                      {selectedMedia.width} × {selectedMedia.height}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Uploaded:</span>
                    <p className="font-medium">
                      {new Date(selectedMedia.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={selectedMedia.title || ''}
                    onChange={(e) => {
                      const updated = { ...selectedMedia, title: e.target.value };
                      setSelectedMedia(updated);
                    }}
                    onBlur={(e) => handleUpdateMetadata(selectedMedia.id, { title: e.target.value })}
                    placeholder="Add a title for this image"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Text (for accessibility)
                  </label>
                  <input
                    type="text"
                    value={selectedMedia.alt_text || ''}
                    onChange={(e) => {
                      const updated = { ...selectedMedia, alt_text: e.target.value };
                      setSelectedMedia(updated);
                    }}
                    onBlur={(e) => handleUpdateMetadata(selectedMedia.id, { alt_text: e.target.value })}
                    placeholder="Describe the image for screen readers"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Caption
                  </label>
                  <textarea
                    value={selectedMedia.caption || ''}
                    onChange={(e) => {
                      const updated = { ...selectedMedia, caption: e.target.value };
                      setSelectedMedia(updated);
                    }}
                    onBlur={(e) => handleUpdateMetadata(selectedMedia.id, { caption: e.target.value })}
                    placeholder="Add a caption for this image"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <button
                    onClick={() => handleDelete(selectedMedia)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Image
                  </button>
                  <button
                    onClick={() => setSelectedMedia(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
