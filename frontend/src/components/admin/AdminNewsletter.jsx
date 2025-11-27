import React, { useState } from 'react';
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
} from '../ui';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaEnvelope,
  FaUsers,
  FaChartLine,
  FaPaperPlane,
  FaTimes,
} from 'react-icons/fa';

const MediaPreview = ({ url, type }) => {
  if (!url) return null;

  if (type === 'image') {
    return (
      <div className="mt-2">
        <img
          src={url}
          alt="Preview"
          className="h-32 w-32 object-cover rounded-lg border border-gray-200"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
    );
  }

  return null;
};

const AdminNewsletter = ({ newsletters, canEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);
  const [newslettersList, setNewslettersList] = useState(newsletters);
  const itemsPerPage = 10;

  // Form state for create/edit
  const [formData, setFormData] = useState({
    subject: '',
    preview: '',
    content: '',
    scheduledDate: '',
    sentDate: '',
    status: 'draft',
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

  // Filter newsletters
  const filteredNewsletters = newslettersList.filter((newsletter) => {
    const matchesSearch =
      newsletter.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      newsletter.preview.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || newsletter.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredNewsletters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNewsletters = filteredNewsletters.slice(startIndex, startIndex + itemsPerPage);

  // CRUD Operations
  const handleCreate = () => {
    if (!formData.subject.trim()) return;

    const newNewsletter = {
      id: Date.now(),
      subject: formData.subject,
      preview: formData.preview,
      content: formData.content,
      status: formData.status,
      scheduledDate: formData.scheduledDate,
      sentDate: formData.status === 'sent' ? new Date().toISOString().split('T')[0] : null,
      opens: 0,
      clicks: 0,
      date: new Date().toISOString().split('T')[0],
    };

    setNewslettersList([newNewsletter, ...newslettersList]);
    setShowCreateModal(false);
    resetForm();
  };

  const handleEdit = (newsletter) => {
    setSelectedNewsletter(newsletter);
    setFormData({
      subject: newsletter.subject,
      preview: newsletter.preview || '',
      content: newsletter.content || '',
      status: newsletter.status,
      scheduledDate: newsletter.scheduledDate || '',
    });
    setShowEditModal(true);
  };

  const handleUpdate = () => {
    if (!formData.subject.trim() || !selectedNewsletter) return;

    const updatedNewsletters = newslettersList.map((newsletter) =>
      newsletter.id === selectedNewsletter.id
        ? {
            ...newsletter,
            subject: formData.subject,
            preview: formData.preview,
            content: formData.content,
            status: formData.status,
            scheduledDate: formData.scheduledDate,
            sentDate:
              formData.status === 'sent' && !newsletter.sentDate
                ? new Date().toISOString().split('T')[0]
                : newsletter.sentDate,
          }
        : newsletter,
    );

    setNewslettersList(updatedNewsletters);
    setShowEditModal(false);
    resetForm();
    setSelectedNewsletter(null);
  };

  const handleDelete = (newsletter) => {
    setSelectedNewsletter(newsletter);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!selectedNewsletter) return;

    setNewslettersList(
      newslettersList.filter((newsletter) => newsletter.id !== selectedNewsletter.id),
    );
    setShowDeleteModal(false);
    setSelectedNewsletter(null);
  };

  const handleSend = (newsletter) => {
    const updatedNewsletters = newslettersList.map((n) =>
      n.id === newsletter.id
        ? { ...n, status: 'sent', sentDate: new Date().toISOString().split('T')[0] }
        : n,
    );
    setNewslettersList(updatedNewsletters);
  };

  const resetForm = () => {
    setFormData({
      subject: '',
      preview: '',
      content: '',
      status: 'draft',
      scheduledDate: '',
    });
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      sent: 'bg-green-100 text-green-700',
      scheduled: 'bg-blue-100 text-blue-700',
      draft: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${styles[status] || styles.draft}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Newsletter</h1>
        <p className="text-[var(--color-muted)]">
          Manage your email newsletters and subscriber communications
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-muted)]" />
            <Input
              placeholder="Search newsletters..."
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
          <option value="sent">Sent</option>
          <option value="scheduled">Scheduled</option>
          <option value="draft">Draft</option>
          <option value="cancelled">Cancelled</option>
        </Select>
        {canEdit && (
          <Button onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto">
            <FaPlus className="mr-2" />
            New Newsletter
          </Button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-muted)]">Total Subscribers</p>
                <p className="text-2xl font-bold text-[var(--color-text)]">12,547</p>
                <p className="text-sm text-green-600">+234 this month</p>
              </div>
              <FaUsers className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-muted)]">Open Rate</p>
                <p className="text-2xl font-bold text-[var(--color-text)]">68.4%</p>
                <p className="text-sm text-green-600">+2.3% from last month</p>
              </div>
              <FaEnvelope className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-muted)]">Click Rate</p>
                <p className="text-2xl font-bold text-[var(--color-text)]">12.8%</p>
                <p className="text-sm text-red-600">-0.5% from last month</p>
              </div>
              <FaChartLine className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Newsletters Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-muted)]">
                    Subject
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-muted)]">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-muted)]">
                    Sent Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-muted)]">
                    Performance
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-muted)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedNewsletters.map((newsletter) => (
                  <tr
                    key={newsletter.id}
                    className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface)]"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-[var(--color-text)]">{newsletter.subject}</p>
                        <p className="text-sm text-[var(--color-muted)]">{newsletter.preview}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={newsletter.status} />
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-[var(--color-muted)]">
                        {newsletter.sentDate || 'Not sent'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <p className="text-[var(--color-text)]">{newsletter.opens || 0} opens</p>
                        <p className="text-[var(--color-muted)]">{newsletter.clicks || 0} clicks</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <FaEye className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <FaChartLine className="w-3 h-3" />
                        </Button>
                        {canEdit && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(newsletter)}
                            >
                              <FaEdit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(newsletter)}
                            >
                              <FaTrash className="w-3 h-3" />
                            </Button>
                            {newsletter.status === 'draft' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSend(newsletter)}
                              >
                                <FaPaperPlane className="w-3 h-3" />
                              </Button>
                            )}
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
            {Math.min(startIndex + itemsPerPage, filteredNewsletters.length)} of{' '}
            {filteredNewsletters.length} newsletters
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
        title="Create New Newsletter"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Subject
            </label>
            <Input
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Newsletter subject line"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Preview Text
            </label>
            <Input
              value={formData.preview}
              onChange={(e) => setFormData({ ...formData, preview: e.target.value })}
              placeholder="Brief preview for email clients"
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
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Newsletter content (HTML or plain text)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Scheduled Date
            </label>
            <Input
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
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
              <option value="scheduled">Scheduled</option>
              <option value="sent">Sent</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Newsletter</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Newsletter">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Subject
            </label>
            <Input
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Newsletter subject line"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Preview Text
            </label>
            <Input
              value={formData.preview}
              onChange={(e) => setFormData({ ...formData, preview: e.target.value })}
              placeholder="Brief preview for email clients"
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
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Newsletter content (HTML or plain text)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Scheduled Date
            </label>
            <Input
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
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
              <option value="scheduled">Scheduled</option>
              <option value="sent">Sent</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update Newsletter</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Newsletter"
      >
        <div className="space-y-4">
          <p className="text-[var(--color-text)]">
            Are you sure you want to delete "{selectedNewsletter?.subject}"? This action cannot be
            undone.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Newsletter
            </Button>
          </div>
        </div>
      </Modal>

      {/* Empty State */}
      {filteredNewsletters.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FaEnvelope className="w-12 h-12 text-[var(--color-muted)] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[var(--color-text)] mb-2">
              No newsletters found
            </h3>
            <p className="text-[var(--color-muted)] mb-4">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first newsletter campaign'}
            </p>
            {canEdit && !searchTerm && filterStatus === 'all' && (
              <Button onClick={() => setShowCreateModal(true)}>
                <FaPlus className="mr-2" />
                Create Newsletter
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminNewsletter;
