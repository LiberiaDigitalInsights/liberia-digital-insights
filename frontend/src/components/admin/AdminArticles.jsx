import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Select,
  Modal,
  RichTextEditor,
  Textarea,
} from '../ui';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaTimes } from 'react-icons/fa';
import { useArticles } from '../../hooks/useBackendApi';
import { backendApi } from '../../services/backendApi';
import { useToast } from '../../context/ToastContext';
import { uploadFile } from '../../utils/uploadClient';

const AdminArticles = ({ canEdit }) => {
  const { showToast } = useToast();
  const { data: articlesData, loading, refetch } = useArticles({});
  const articles = articlesData?.articles || [];
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
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

  // Handle image upload using shared upload client
  const handleImageUpload = async (e, fieldName = 'coverImage') => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast({ title: 'Invalid file', description: 'Please select an image file.', variant: 'error' });
      e.currentTarget.value = '';
      return;
    }

    try {
      const { url } = await uploadFile(file, { type: 'images', path: 'articles' });
      setFormData((prev) => ({ ...prev, [fieldName]: url }));
      showToast({ title: 'Uploaded', description: 'Image uploaded successfully.', variant: 'success' });
    } catch (err) {
      showToast({ title: 'Upload failed', description: err.message || 'Could not upload image.', variant: 'error' });
    } finally {
      e.currentTarget.value = '';
    }
  };

  // Filter articles
  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || article.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + itemsPerPage);

  // CRUD Operations
  const handleCreate = async () => {
    if (!formData.title.trim()) return;

    setSubmitting(true);
    try {
      // Generate slug from title
      const slug = formData.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      const newArticle = {
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
        newArticle.cover_image_url = formData.coverImage;
      }

      console.log('Creating article data:', JSON.stringify(newArticle, null, 2));
      await backendApi.articles.create(newArticle);
      await refetch();

      showToast({
        title: 'Article Created',
        description: 'Article has been created successfully.',
        variant: 'success',
      });

      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Create error:', error);
      showToast({
        title: 'Error',
        description: `Failed to create article: ${error.message}`,
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (article) => {
    setSelectedArticle(article);
    setFormData({
      title: article.title,
      excerpt: article.excerpt || '',
      content: article.content || '',
      category: article.category_id || '', // Use the actual category_id
      status: article.status,
      tags: article.tags ? article.tags.join(', ') : '',
      coverImage: article.cover_image_url || article.coverImage || article.image || '',
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!formData.title.trim() || !selectedArticle) return;

    setSubmitting(true);
    try {
      const updatedArticle = {
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
        updatedArticle.cover_image_url = formData.coverImage;
      }

      console.log('Updating article:', selectedArticle.id, updatedArticle);
      await backendApi.articles.update(selectedArticle.id, updatedArticle);
      await refetch();

      showToast({
        title: 'Article Updated',
        description: 'Article has been updated successfully.',
        variant: 'success',
      });

      setShowEditModal(false);
      resetForm();
      setSelectedArticle(null);
    } catch (error) {
      console.error('Update error:', error);
      showToast({
        title: 'Error',
        description: `Failed to update article: ${error.message}`,
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (article) => {
    setSelectedArticle(article);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedArticle) return;

    setSubmitting(true);
    try {
      await backendApi.articles.delete(selectedArticle.id);
      await refetch();

      showToast({
        title: 'Article Deleted',
        description: 'Article has been deleted successfully.',
        variant: 'success',
      });

      setShowDeleteModal(false);
      setSelectedArticle(null);
    } catch {
      showToast({
        title: 'Error',
        description: 'Failed to delete article.',
        variant: 'error',
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
      tags: '',
      coverImage: '',
    });
  };

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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Articles</h1>
          <p className="text-[var(--color-muted)]">Manage your articles and content</p>
        </div>
        {canEdit && (
          <Button onClick={() => setShowCreateModal(true)}>
            <FaPlus className="mr-2 h-4 w-4" />
            New Article
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-muted)]" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Articles Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-pulse">Loading articles...</div>
            </div>
          ) : (
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
                  {paginatedArticles.map((article) => (
                    <tr
                      key={article.id}
                      className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface)]"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-[var(--color-text)]">{article.title}</p>
                          <p className="text-sm text-[var(--color-muted)]">{article.excerpt}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-[var(--color-text)]">
                          {typeof article.category === 'string'
                            ? article.category
                            : article.category?.name || 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(article.status)}</td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-[var(--color-muted)]">{article.date}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedArticle(article);
                              setShowDetailsModal(true);
                            }}
                            title="View Article Details"
                          >
                            <FaEye className="w-3 h-3" />
                          </Button>
                          {canEdit && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(article)}
                              >
                                <FaEdit className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(article)}
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
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-[var(--color-muted)]">
            Showing {startIndex + 1} to{' '}
            {Math.min(startIndex + itemsPerPage, filteredArticles.length)} of{' '}
            {filteredArticles.length} articles
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
        title="Create New Article"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter article title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Excerpt
            </label>
            <Textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief description of the article"
              rows={2}
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
              Content
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content: content })}
              placeholder="Article content"
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
            <Button onClick={handleCreate} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Article'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Article">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter article title"
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
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Excerpt
            </label>
            <Textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief description of the article"
              rows={3}
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
              Content
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content: content })}
              placeholder="Full article content"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Tags (comma-separated)
            </label>
            <Input
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="tech, innovation, business"
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
              <option value="pending">Pending</option>
            </Select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={submitting}>
              {submitting ? 'Updating...' : 'Update Article'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Article Details Modal */}
      <Modal
        open={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Article Details"
      >
        <div className="space-y-4">
          {selectedArticle && (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
                    Title
                  </label>
                  <p className="text-[var(--color-text)] font-medium">{selectedArticle.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
                    Excerpt
                  </label>
                  <p className="text-[var(--color-text)]">{selectedArticle.excerpt || 'N/A'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
                      Category
                    </label>
                    <p className="text-[var(--color-text)]">
                      {typeof selectedArticle.category === 'string'
                        ? selectedArticle.category
                        : selectedArticle.category?.name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
                      Status
                    </label>
                    <div>{getStatusBadge(selectedArticle.status)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
                      Author
                    </label>
                    <p className="text-[var(--color-text)]">{selectedArticle.author || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
                      Date
                    </label>
                    <p className="text-[var(--color-text)]">{selectedArticle.date || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
                    Cover Image
                  </label>
                  <p className="text-[var(--color-text)] text-sm">
                    {selectedArticle.coverImage ? (
                      <a
                        href={selectedArticle.coverImage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {selectedArticle.coverImage}
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
                    Content Preview
                  </label>
                  <p className="text-[var(--color-text)] text-sm">
                    {selectedArticle.content
                      ? `${selectedArticle.content.substring(0, 200)}${selectedArticle.content.length > 200 ? '...' : ''}`
                      : 'N/A'}
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
        title="Delete Article"
      >
        <div className="space-y-4">
          <p className="text-[var(--color-text)]">
            Are you sure you want to delete "{selectedArticle?.title}"? This action cannot be
            undone.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={submitting}>
              {submitting ? 'Deleting...' : 'Delete Article'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminArticles;
