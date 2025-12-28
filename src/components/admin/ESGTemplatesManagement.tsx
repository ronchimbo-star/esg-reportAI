import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Archive, Trash2, Eye, Download, Loader2, X, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import Toast from './Toast';

interface ESGTemplate {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  featured_image: string | null;
  industries: string[];
  frameworks: string[];
  jurisdictions: string[];
  content: string;
  download_count: number;
  meta_description: string | null;
  meta_keywords: string[];
  category: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

export default function ESGTemplatesManagement() {
  const [templates, setTemplates] = useState<ESGTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ESGTemplate | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [adminUser] = useLocalStorage('adminUser', null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category: 'General',
    featured_image: '',
    industries: [] as string[],
    frameworks: [] as string[],
    jurisdictions: [] as string[],
    content: '',
    meta_description: '',
    meta_keywords: [] as string[],
    is_published: false,
  });

  useEffect(() => {
    loadTemplates();
  }, [showArchived]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('esg_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (!showArchived) {
        query = query.is('archived_at', null);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
      showToast('Failed to load templates', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleEdit = (template: ESGTemplate) => {
    setEditingTemplate(template);
    setFormData({
      title: template.title,
      slug: template.slug,
      description: template.description || '',
      category: template.category,
      featured_image: template.featured_image || '',
      industries: template.industries || [],
      frameworks: template.frameworks || [],
      jurisdictions: template.jurisdictions || [],
      content: template.content,
      meta_description: template.meta_description || '',
      meta_keywords: template.meta_keywords || [],
      is_published: template.is_published,
    });
    setShowEditor(true);
  };

  const handleNew = () => {
    setEditingTemplate(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      category: 'General',
      featured_image: '',
      industries: [],
      frameworks: [],
      jurisdictions: [],
      content: '',
      meta_description: '',
      meta_keywords: [],
      is_published: false,
    });
    setShowEditor(true);
  };

  const handleSave = async () => {
    try {
      if (!formData.title || !formData.slug || !formData.content) {
        showToast('Please fill in all required fields', 'error');
        return;
      }

      const templateData = {
        ...formData,
        updated_at: new Date().toISOString(),
        updated_by: adminUser?.id,
      };

      if (editingTemplate) {
        const { error } = await supabase
          .from('esg_templates')
          .update(templateData)
          .eq('id', editingTemplate.id);

        if (error) throw error;
        showToast('Template updated successfully', 'success');
      } else {
        const { error } = await supabase
          .from('esg_templates')
          .insert([{
            ...templateData,
            created_by: adminUser?.id,
          }]);

        if (error) throw error;
        showToast('Template created successfully', 'success');
      }

      setShowEditor(false);
      loadTemplates();
    } catch (error: any) {
      console.error('Error saving template:', error);
      showToast(error.message || 'Failed to save template', 'error');
    }
  };

  const handleArchive = async (id: string) => {
    try {
      const { error } = await supabase
        .from('esg_templates')
        .update({
          archived_at: new Date().toISOString(),
          archived_by: adminUser?.id,
        })
        .eq('id', id);

      if (error) throw error;
      showToast('Template archived successfully', 'success');
      loadTemplates();
    } catch (error) {
      console.error('Error archiving template:', error);
      showToast('Failed to archive template', 'error');
    }
  };

  const handleUnarchive = async (id: string) => {
    try {
      const { error } = await supabase
        .from('esg_templates')
        .update({
          archived_at: null,
          archived_by: null,
        })
        .eq('id', id);

      if (error) throw error;
      showToast('Template unarchived successfully', 'success');
      loadTemplates();
    } catch (error) {
      console.error('Error unarchiving template:', error);
      showToast('Failed to unarchive template', 'error');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('esg_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showToast('Template deleted successfully', 'success');
      loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      showToast('Failed to delete template', 'error');
    }
  };

  const handleArrayInput = (field: 'industries' | 'frameworks' | 'jurisdictions' | 'meta_keywords', value: string) => {
    setFormData({
      ...formData,
      [field]: value.split(',').map(item => item.trim()).filter(item => item),
    });
  };

  const filteredTemplates = templates.filter((template) => {
    const search = searchTerm.toLowerCase();
    return (
      template.title.toLowerCase().includes(search) ||
      template.description?.toLowerCase().includes(search) ||
      template.slug.toLowerCase().includes(search) ||
      template.category.toLowerCase().includes(search)
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
            <h2 className="text-2xl font-bold text-gray-900">ESG Templates</h2>
            <p className="text-gray-600">Manage ESG report templates</p>
          </div>
          <button
            onClick={handleNew}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Template
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              showArchived
                ? 'bg-gray-600 text-white border-gray-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {showArchived ? 'Hide Archived' : 'Show Archived'}
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frameworks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Industries
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Downloads
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTemplates.map((template) => (
                <tr key={template.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{template.title}</div>
                    <div className="text-sm text-gray-500">{template.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {template.category}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {template.frameworks.slice(0, 2).join(', ')}
                      {template.frameworks.length > 2 && '...'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {template.industries.slice(0, 2).join(', ')}
                      {template.industries.length > 2 && '...'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {template.archived_at ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Archived
                      </span>
                    ) : template.is_published ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {template.download_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(template)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {template.archived_at ? (
                        <button
                          onClick={() => handleUnarchive(template.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Unarchive"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleArchive(template.id)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Archive"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(template.id, template.title)}
                        className="text-red-600 hover:text-red-900"
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

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No templates found</p>
            </div>
          )}
        </div>
      </div>

      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-4xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {editingTemplate ? 'Edit Template' : 'New Template'}
              </h3>
              <button
                onClick={() => setShowEditor(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
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
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.featured_image}
                    onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frameworks (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.frameworks.join(', ')}
                  onChange={(e) => handleArrayInput('frameworks', e.target.value)}
                  placeholder="GRI, TCFD, EU CSRD"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industries (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.industries.join(', ')}
                  onChange={(e) => handleArrayInput('industries', e.target.value)}
                  placeholder="Technology, Finance, Manufacturing"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jurisdictions (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.jurisdictions.join(', ')}
                  onChange={(e) => handleArrayInput('jurisdictions', e.target.value)}
                  placeholder="EU, USA, UK"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content (HTML) *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                  placeholder="<h1>Template Title</h1><p>Content...</p>"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.meta_keywords.join(', ')}
                  onChange={(e) => handleArrayInput('meta_keywords', e.target.value)}
                  placeholder="ESG, sustainability, reporting"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="is_published" className="text-sm font-medium text-gray-700">
                  Publish template
                </label>
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
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
