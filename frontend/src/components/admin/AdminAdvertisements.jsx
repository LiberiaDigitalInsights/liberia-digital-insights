import React, { useState } from 'react';
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
} from '../ui';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaBullhorn,
  FaChartBar,
  FaTimes,
} from 'react-icons/fa';
import { useAdvertisements } from '../../hooks/useBackendApi';
import { backendApi } from '../../services/backendApi';
import { useToast } from '../../context/ToastContext';

const AdminAdvertisements = ({ canEdit }) => {
  const { showToast } = useToast();
  const { data: advertisementsData, refetch } = useAdvertisements({});
  const advertisements = advertisementsData?.advertisements || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const itemsPerPage = 10;

  // Form state for create/edit
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'banner',
    status: 'active',
    imageUrl: '',
    targetUrl: '',
      startDate: '',
      endDate: '',
    impressions: 0,
    clicks: 0,
  });

  // Handle file upload and convert to base64
  const handleFileUpload = (e, fieldName = 'imageUrl') => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Check file type (only allow images)
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
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

  // Filter advertisements
  const filteredAds = advertisements.filter((ad) => {
    const matchesSearch =
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ad.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAds.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAds = filteredAds.slice(startIndex, startIndex + itemsPerPage);

  // CRUD Operations
  const handleCreate = async () => {
    if (!formData.title.trim()) return;

    setSubmitting(true);
    try {
      // Generate slug from title
      const slug = formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      const newAd = {
        title: formData.title,
        slug,
        description: formData.description,
        type: formData.type,
        status: formData.status,
        image_url: formData.imageUrl || null,
        target_url: formData.targetUrl,
        start_date: formData.startDate || null,
        end_date: formData.endDate || null,
      };

      console.log('Creating advertisement:', newAd);
      await backendApi.advertisements.create(newAd);
      await refetch();
      
      showToast({
        title: 'Advertisement Created',
        description: 'Advertisement has been created successfully.',
        variant: 'success'
      });

      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Create error:', error);
      showToast({
        title: 'Error',
        description: `Failed to create advertisement: ${error.message}`,
        variant: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (ad) => {
    setSelectedAd(ad);
    setFormData({
      title: ad.title,
      description: ad.description || '',
      type: ad.type,
      status: ad.status,
      imageUrl: ad.image_url || '',
      targetUrl: ad.target_url || '',
      startDate: ad.start_date || '',
      endDate: ad.end_date || '',
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!formData.title.trim() || !selectedAd) return;

    setSubmitting(true);
    try {
      const updatedAd = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        status: formData.status,
        image_url: formData.imageUrl || null,
        target_url: formData.targetUrl,
        start_date: formData.startDate || null,
        end_date: formData.endDate || null,
      };

      console.log('Updating advertisement:', selectedAd.id, updatedAd);
      await backendApi.advertisements.update(selectedAd.id, updatedAd);
      await refetch();
      
      showToast({
        title: 'Advertisement Updated',
        description: 'Advertisement has been updated successfully.',
        variant: 'success'
      });

      setShowEditModal(false);
      resetForm();
      setSelectedAd(null);
    } catch (error) {
      console.error('Update error:', error);
      showToast({
        title: 'Error',
        description: `Failed to update advertisement: ${error.message}`,
        variant: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (ad) => {
    setSelectedAd(ad);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedAd) return;

    setSubmitting(true);
    try {
      await backendApi.advertisements.delete(selectedAd.id);
      await refetch();
      
      showToast({
        title: 'Advertisement Deleted',
        description: 'Advertisement has been deleted successfully.',
        variant: 'success'
      });

      setShowDeleteModal(false);
      setSelectedAd(null);
    } catch (error) {
      console.error('Delete error:', error);
      showToast({
        title: 'Error',
        description: `Failed to delete advertisement: ${error.message}`,
        variant: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'banner',
      status: 'active',
      imageUrl: '',
      targetUrl: '',
      startDate: '',
      endDate: '',
      impressions: 0,
      clicks: 0,
    });
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      active: 'bg-green-100 text-green-700',
      paused: 'bg-yellow-100 text-yellow-700',
      expired: 'bg-red-100 text-red-700',
      draft: 'bg-gray-100 text-gray-700',
    };
    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${styles[status] || styles.draft}`}
      >
        {status}
      </span>
    );
  };

  const TypeBadge = ({ type }) => {
    const styles = {
      banner: 'bg-blue-100 text-blue-700',
      sidebar: 'bg-purple-100 text-purple-700',
      popup: 'bg-orange-100 text-orange-700',
      native: 'bg-green-100 text-green-700',
    };
    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${styles[type] || 'bg-gray-100 text-gray-700'}`}
      >
        {type}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Advertisements</h1>
        <p className="text-[var(--color-muted)]">
          Manage your advertisement campaigns and placements
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-muted)]" />
            <Input
              placeholder="Search advertisements..."
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
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="expired">Expired</option>
          <option value="draft">Draft</option>
        </Select>
        {canEdit && (
          <Button onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto">
            <FaPlus className="mr-2" />
            New Advertisement
          </Button>
        )}
      </div>

      {/* Advertisements Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-muted)]">
                    Advertisement
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-muted)]">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-muted)]">
                    Status
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
                {paginatedAds.map((ad) => (
                  <tr
                    key={ad.id}
                    className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface)]"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-[var(--color-text)]">{ad.name}</p>
                        <p className="text-sm text-[var(--color-muted)]">{ad.client}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <TypeBadge type={ad.type} />
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={ad.status} />
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <p className="text-[var(--color-text)]">
                          {ad.impressions || 0} impressions
                        </p>
                        <p className="text-[var(--color-muted)]">{ad.clicks || 0} clicks</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedAd(ad);
                            setShowDetailsModal(true);
                          }}
                          title="View Advertisement Details"
                        >
                          <FaEye className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedAd(ad);
                            setShowPerformanceModal(true);
                          }}
                          title="View Performance Analytics"
                        >
                          <FaChartBar className="w-3 h-3" />
                        </Button>
                        {canEdit && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => handleEdit(ad)}>
                              <FaEdit className="w-3 h-3" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete(ad)}>
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
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAds.length)} of{' '}
            {filteredAds.length} advertisements
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
        title="Create New Advertisement"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Advertisement Name
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter advertisement name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Client
            </label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Client name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Type</label>
            <Select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="banner">Banner</option>
              <option value="sidebar">Sidebar</option>
              <option value="popup">Popup</option>
              <option value="native">Native</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Advertisement content or description"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Image URL
            </label>
            <div className="flex gap-2">
              <Input
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="flex-1"
              />
              <label className="px-3 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'imageUrl')}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Target URL
            </label>
            <Input
              value={formData.targetUrl}
              onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Start Date
            </label>
            <Input
              type="datetime-local"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              End Date
            </label>
            <Input
              type="datetime-local"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
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
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="expired">Expired</option>
            </Select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={submitting}>{submitting ? "Creating..." : "Create Advertisement"}</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Advertisement"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Advertisement Name
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter advertisement name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Client
            </label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Client name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Type</label>
            <Select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="banner">Banner</option>
              <option value="sidebar">Sidebar</option>
              <option value="popup">Popup</option>
              <option value="native">Native</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Advertisement content or description"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Image URL
            </label>
            <div className="flex gap-2">
              <Input
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="flex-1"
              />
              <label className="px-3 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'imageUrl')}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Target URL
            </label>
            <Input
              value={formData.targetUrl}
              onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Start Date
            </label>
            <Input
              type="datetime-local"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              End Date
            </label>
            <Input
              type="datetime-local"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
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
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="expired">Expired</option>
            </Select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={submitting}>{submitting ? "Updating..." : "Update Advertisement"}</Button>
          </div>
        </div>
      </Modal>

      {/* Advertisement Details Modal */}
      <Modal
        open={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Advertisement Details"
      >
        <div className="space-y-4">
          {selectedAd && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Name</label>
                  <p className="text-[var(--color-text)]">{selectedAd.title || selectedAd.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Type</label>
                  <TypeBadge type={selectedAd.type} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Status</label>
                  <StatusBadge status={selectedAd.status} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Target URL</label>
                  <p className="text-[var(--color-text)] text-sm">
                    {selectedAd.target_url ? (
                      <a href={selectedAd.target_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {selectedAd.target_url}
                      </a>
                    ) : 'N/A'}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Description</label>
                  <p className="text-[var(--color-text)]">{selectedAd.description || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Image URL</label>
                  <p className="text-[var(--color-text)] text-sm">
                    {selectedAd.image_url ? (
                      <a href={selectedAd.image_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {selectedAd.image_url}
                      </a>
                    ) : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Start Date</label>
                  <p className="text-[var(--color-text)]">{selectedAd.start_date || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">End Date</label>
                  <p className="text-[var(--color-text)]">{selectedAd.end_date || 'N/A'}</p>
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

      {/* Performance Analytics Modal */}
      <Modal
        open={showPerformanceModal}
        onClose={() => setShowPerformanceModal(false)}
        title="Performance Analytics"
      >
        <div className="space-y-4">
          {selectedAd && (
            <>
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-2">{selectedAd.title || selectedAd.name}</h3>
                <div className="flex items-center justify-center gap-4">
                  <TypeBadge type={selectedAd.type} />
                  <StatusBadge status={selectedAd.status} />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-[var(--color-surface)] rounded-lg">
                  <div className="text-2xl font-bold text-[var(--color-text)]">{selectedAd.impressions || 0}</div>
                  <div className="text-sm text-[var(--color-muted)]">Impressions</div>
                </div>
                <div className="text-center p-4 bg-[var(--color-surface)] rounded-lg">
                  <div className="text-2xl font-bold text-[var(--color-text)]">{selectedAd.clicks || 0}</div>
                  <div className="text-sm text-[var(--color-muted)]">Clicks</div>
                </div>
                <div className="text-center p-4 bg-[var(--color-surface)] rounded-lg">
                  <div className="text-2xl font-bold text-[var(--color-text)]">
                    {selectedAd.impressions > 0 ? ((selectedAd.clicks || 0) / selectedAd.impressions * 100).toFixed(2) : 0}%
                  </div>
                  <div className="text-sm text-[var(--color-muted)]">CTR</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-[var(--color-text)]">Performance Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-muted)]">Engagement Rate:</span>
                    <span className="text-[var(--color-text)] font-medium">
                      {selectedAd.impressions > 0 ? ((selectedAd.clicks || 0) / selectedAd.impressions * 100).toFixed(2) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-muted)]">Cost per Click:</span>
                    <span className="text-[var(--color-text)] font-medium">N/A</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-muted)]">Conversion Rate:</span>
                    <span className="text-[var(--color-text)] font-medium">N/A</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setShowPerformanceModal(false)}>
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
        title="Delete Advertisement"
      >
        <div className="space-y-4">
          <p className="text-[var(--color-text)]">
            Are you sure you want to delete "{selectedAd?.name}"? This action cannot be undone.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={submitting}>
              {submitting ? 'Deleting...' : 'Delete Advertisement'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Empty State */}
      {filteredAds.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FaBullhorn className="w-12 h-12 text-[var(--color-muted)] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[var(--color-text)] mb-2">
              No advertisements found
            </h3>
            <p className="text-[var(--color-muted)] mb-4">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first advertisement campaign'}
            </p>
            {canEdit && !searchTerm && filterStatus === 'all' && (
              <Button onClick={() => setShowCreateModal(true)}>
                <FaPlus className="mr-2" />
                Create Advertisement
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminAdvertisements;
