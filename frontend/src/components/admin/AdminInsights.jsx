import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Select,
  Textarea,
  Modal,
  RichTextEditor,
} from '../ui';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaLightbulb, FaTimes } from 'react-icons/fa';
import { useInsights } from '../../hooks/useBackendApi';
import { backendApi } from '../../services/backendApi';
import { useToast } from '../../context/ToastContext';

const AdminInsights = ({ canEdit }) => {
  const { showToast } = useToast();
  const { data: insightsData, refetch } = useInsights({});
  const insights = insightsData?.insights || [];
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const itemsPerPage = 10;

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await backendApi.categories.list();
        setCategories(response.data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Form state for create/edit
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    status: 'draft',
    author: '',
    tags: '',
    coverImage: '',
  });

  // Handle image upload and convert to base64
  const handleImageUpload = (e, fieldName = 'coverImage') => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setFormData({ ...formData, [fieldName]: base64 });
    };
    reader.readAsDataURL(file);
    e.currentTarget.value = ''; // Reset input
  };

  // Status badge helper
  const getStatusBadge = (status) => {
    const styles = {
      published: 'bg-green-100 text-green-700',
      draft: 'bg-yellow-100 text-yellow-700',
      pending: 'bg-gray-100 text-gray-700',
    };
    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${styles[status] || styles.draft}`}
      >
        {status}
      </span>
    );
  };

  // Filter insights
  const filteredInsights = insights.filter((insight) => {
    const matchesSearch =
      insight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insight.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || insight.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredInsights.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInsights = filteredInsights.slice(startIndex, startIndex + itemsPerPage);

  // CRUD Operations
  const handleCreate = async () => {
    if (!formData.title.trim()) return;

    setSubmitting(true);
    try {
      // Generate slug from title
      const slug = formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      const newInsight = {
        title: formData.title,
        slug,
        excerpt: formData.excerpt,
        content: formData.content,
        category_id: formData.category,
        status: formData.status,
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      if (formData.coverImage) {
        newInsight.cover_image_url = formData.coverImage;
      }

      console.log('Creating insight:', newInsight);
      await backendApi.insights.create(newInsight);
      await refetch();
      
      showToast({
        title: 'Insight Created',
        description: 'Insight has been created successfully.',
        variant: 'success'
      });

      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Create error:', error);
      showToast({
        title: 'Error',
        description: `Failed to create insight: ${error.message}`,
        variant: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (insight) => {
    setSelectedInsight(insight);
    setFormData({
      title: insight.title,
      excerpt: insight.excerpt || '',
      content: insight.content || '',
      category: insight.category_id || '', // Use the actual category_id
      status: insight.status,
      author: insight.author || '',
      tags: insight.tags ? insight.tags.join(', ') : '',
      coverImage: insight.cover_image_url || insight.coverImage || insight.image || '',
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!formData.title.trim() || !selectedInsight) return;

    setSubmitting(true);
    try {
      const updatedInsight = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category_id: formData.category,
        status: formData.status,
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      if (formData.coverImage) {
        updatedInsight.cover_image_url = formData.coverImage;
      }

      console.log('Updating insight:', selectedInsight.id, updatedInsight);
      await backendApi.insights.update(selectedInsight.id, updatedInsight);
      await refetch();
      
      showToast({
        title: 'Insight Updated',
        description: 'Insight has been updated successfully.',
        variant: 'success'
      });

      setShowEditModal(false);
      resetForm();
      setSelectedInsight(null);
    } catch (error) {
      console.error('Update error:', error);
      showToast({
        title: 'Error',
        description: `Failed to update insight: ${error.message}`,
        variant: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (insight) => {
    setSelectedInsight(insight);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedInsight) return;

    setSubmitting(true);
    try {
      await backendApi.insights.delete(selectedInsight.id);
      await refetch();
      
      showToast({
        title: 'Insight Deleted',
        description: 'Insight has been deleted successfully.',
        variant: 'success'
      });

      setShowDeleteModal(false);
      setSelectedInsight(null);
    } catch (error) {
      console.error('Delete error:', error);
      showToast({
        title: 'Error',
        description: `Failed to delete insight: ${error.message}`,
        variant: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      status: 'draft',
      author: '',
      tags: '',
    });
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      published: 'bg-green-100 text-green-700',
      draft: 'bg-yellow-100 text-yellow-700',
      archived: 'bg-gray-100 text-gray-700',
    };
    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${styles[status] || styles.draft}`}
      >
        {status}
      </span>
    );
  };

  const MediaPreview = ({ url, type }) => {
    if (!url) return null;

    if (type === 'image') {
      return (
        <div className="mt-2">
          <img
            src={url}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      );
    }

    return (
      <div className="mt-2 p-2 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600 truncate">{url}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Insights</h1>
        <p className="text-[var(--color-muted)]">
          Manage your insight articles and thought leadership content
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-muted)]" />
            <Input
              placeholder="Search insights..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full sm:w-48"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
        </Select>
        {canEdit && (
          <Button onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto">
            <FaPlus className="mr-2" />
            New Insight
          </Button>
        )}
      </div>

      {/* Insights Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-muted)]">
                    Title
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-muted)]">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-muted)]">
                    Author
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-muted)]">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-muted)]">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-muted)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedInsights.map((insight) => (
                  <tr
                    key={insight.id}
                    className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface)]"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-[var(--color-text)]">{insight.title}</p>
                        <p className="text-sm text-[var(--color-muted)]">{insight.excerpt}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-[var(--color-text)]">{insight.category}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-[var(--color-text)]">{insight.author}</span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={insight.status} />
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-[var(--color-muted)]">{insight.date}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedInsight(insight);
                            setShowDetailsModal(true);
                          }}
                          title="View Insight Details"
                        >
                          <FaEye className="w-3 h-3" />
                        </Button>
                        {canEdit && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => handleEdit(insight)}>
                              <FaEdit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(insight)}
                            >
                              <FaTrash className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-[var(--color-muted)]">
            Showing {startIndex + 1} to{' '}
            {Math.min(startIndex + itemsPerPage, filteredInsights.length)} of{' '}
            {filteredInsights.length} insights
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Insight"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter insight title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Author
            </label>
            <Input
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Author name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Category
            </label>
            <Select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Tags</label>
            <Input
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Enter tags separated by commas"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Cover Image
            </label>
            <div className="flex gap-2">
              <Input
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="flex-1"
              />
              <label className="px-3 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e)}
                  className="hidden"
                />
              </label>
            </div>
            <MediaPreview url={formData.coverImage} type="image" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Excerpt
            </label>
            <Textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief description of the insight"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Content
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Insight content"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Status
            </label>
            <Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </Select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={submitting}>{submitting ? "Creating..." : "Create Insight"}</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Insight">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter insight title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Author
            </label>
            <Input
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Author name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Category
            </label>
            <Select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Tags</label>
            <Input
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Enter tags separated by commas"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Cover Image
            </label>
            <div className="flex gap-2">
              <Input
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="flex-1"
              />
              <label className="px-3 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e)}
                  className="hidden"
                />
              </label>
            </div>
            <MediaPreview url={formData.coverImage} type="image" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Excerpt
            </label>
            <Textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief description of the insight"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Content
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Insight content"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Status
            </label>
            <Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </Select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={submitting}>{submitting ? "Updating..." : "Update Insight"}</Button>
          </div>
        </div>
      </Modal>

      {/* Insight Details Modal */}
      <Modal
        open={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Insight Details"
      >
        <div className="space-y-4">
          {selectedInsight && (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Title</label>
                  <p className="text-[var(--color-text)] font-medium">{selectedInsight.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Excerpt</label>
                  <p className="text-[var(--color-text)]">{selectedInsight.excerpt || 'N/A'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Category</label>
                    <p className="text-[var(--color-text)]">{selectedInsight.category || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Status</label>
                    <div>{getStatusBadge(selectedInsight.status)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Author</label>
                    <p className="text-[var(--color-text)]">{selectedInsight.author || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Date</label>
                    <p className="text-[var(--color-text)]">{selectedInsight.date || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Cover Image</label>
                  <p className="text-[var(--color-text)] text-sm">
                    {selectedInsight.coverImage ? (
                      <a href={selectedInsight.coverImage} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {selectedInsight.coverImage}
                      </a>
                    ) : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Content Preview</label>
                  <p className="text-[var(--color-text)] text-sm">
                    {selectedInsight.content ? 
                      `${selectedInsight.content.substring(0, 200)}${selectedInsight.content.length > 200 ? '...' : ''}` 
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                  Close
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Insight"
      >
        <div className="space-y-4">
          <p className="text-[var(--color-text)]">
            Are you sure you want to delete "{selectedInsight?.title}"? This action cannot be
            undone.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={submitting}>
              {submitting ? "Deleting..." : "Delete Insight"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Empty State */}
      {filteredInsights.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FaLightbulb className="w-12 h-12 text-[var(--color-muted)] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[var(--color-text)] mb-2">No insights found</h3>
            <p className="text-[var(--color-muted)] mb-4">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first insight article'}
            </p>
            {canEdit && !searchTerm && filterStatus === 'all' && (
              <Button onClick={() => setShowCreateModal(true)}>
                <FaPlus className="mr-2" />
                Create Insight
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminInsights;
