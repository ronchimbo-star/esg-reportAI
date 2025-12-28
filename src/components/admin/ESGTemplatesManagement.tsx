import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { FileText, Plus, Edit, Archive, Trash2, Eye, Download, X, Save } from 'lucide-react';

interface ESGTemplate {
  id: string;
  slug: string;
  title: string;
  description: string;
  featured_image: string | null;
  industries: string[] | null;
  frameworks: string[] | null;
  jurisdictions: string[] | null;
  content: string;
  download_count: number;
  category: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

export default function ESGTemplatesManagement() {
  const [templates, setTemplates] = useState<ESGTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<ESGTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    description: '',
    featured_image: '',
    industries: [] as string[],
    frameworks: [] as string[],
    jurisdictions: [] as string[],
    content: '',
    category: 'General',
    is_published: false
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('esg_templates')
        .select('*')
        .is('archived_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({
      slug: '',
      title: '',
      description: '',
      featured_image: '',
      industries: [],
      frameworks: [],
      jurisdictions: [],
      content: '',
      category: 'General',
      is_published: false
    });
    setSelectedTemplate(null);
    setIsEditing(true);
  };

  const handleEdit = (template: ESGTemplate) => {
    setFormData({
      slug: template.slug,
      title: template.title,
      description: template.description || '',
      featured_image: template.featured_image || '',
      industries: template.industries || [],
      frameworks: template.frameworks || [],
      jurisdictions: template.jurisdictions || [],
      content: template.content,
      category: template.category || 'General',
      is_published: template.is_published
    });
    setSelectedTemplate(template);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (selectedTemplate) {
        const { error } = await supabase
          .from('esg_templates')
          .update({
            ...formData,
            updated_by: user?.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedTemplate.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('esg_templates')
          .insert({
            ...formData,
            created_by: user?.id
          });

        if (error) throw error;
      }

      setIsEditing(false);
      setSelectedTemplate(null);
      loadTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template');
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm('Are you sure you want to archive this template?')) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('esg_templates')
        .update({
          archived_at: new Date().toISOString(),
          archived_by: user?.id
        })
        .eq('id', id);

      if (error) throw error;
      loadTemplates();
    } catch (error) {
      console.error('Error archiving template:', error);
      alert('Failed to archive template');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this template? This action cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('esg_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Failed to delete template');
    }
  };

  const togglePublish = async (template: ESGTemplate) => {
    try {
      const { error } = await supabase
        .from('esg_templates')
        .update({ is_published: !template.is_published })
        .eq('id', template.id);

      if (error) throw error;
      loadTemplates();
    } catch (error) {
      console.error('Error updating template:', error);
      alert('Failed to update template');
    }
  };

  if (loading) {
    return <div className="p-6">Loading templates...</div>;
  }

  if (isEditing) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {selectedTemplate ? 'Edit Template' : 'Create New Template'}
          </h2>
          <button
            onClick={() => setIsEditing(false)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 max-w-4xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug (URL-friendly identifier) *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="construction-template-2024"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Construction Industry ESG Report Template"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Brief description of this template..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="General">General</option>
              <option value="Construction">Construction</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Technology">Technology</option>
              <option value="Energy">Energy</option>
              <option value="Retail">Retail</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Featured Image URL
            </label>
            <input
              type="text"
              value={formData.featured_image}
              onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industries (comma-separated)
            </label>
            <input
              type="text"
              value={formData.industries.join(', ')}
              onChange={(e) => setFormData({
                ...formData,
                industries: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Construction, Infrastructure, Real Estate"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frameworks (comma-separated)
            </label>
            <input
              type="text"
              value={formData.frameworks.join(', ')}
              onChange={(e) => setFormData({
                ...formData,
                frameworks: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="GRI, Saudi ESG, TCFD, SASB"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jurisdictions (comma-separated)
            </label>
            <input
              type="text"
              value={formData.jurisdictions.join(', ')}
              onChange={(e) => setFormData({
                ...formData,
                jurisdictions: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Saudi Arabia, UAE, Global"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              HTML Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={20}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
              placeholder="<html>...</html>"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_published"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="is_published" className="ml-2 text-sm font-medium text-gray-700">
              Publish template (make visible to public)
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Save className="w-4 h-4" />
              Save Template
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">ESG Templates Management</h2>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus className="w-4 h-4" />
          Create New Template
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Template
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Downloads
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {templates.map((template) => (
              <tr key={template.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{template.title}</div>
                      <div className="text-sm text-gray-500">{template.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {template.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-gray-400" />
                    {template.download_count || 0}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => togglePublish(template)}
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      template.is_published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {template.is_published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(template.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => window.open(`/template/${template.slug}`, '_blank')}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(template)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleArchive(template.id)}
                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded"
                      title="Archive"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {templates.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No templates found. Create your first template to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
