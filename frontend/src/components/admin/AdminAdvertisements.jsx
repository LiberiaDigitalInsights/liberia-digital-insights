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
  FaChartLine,
  FaTimes,
} from 'react-icons/fa';

const AdminAdvertisements = ({ advertisements, canEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [adsList, setAdsList] = useState(advertisements);
  const itemsPerPage = 10;

  // Form state for create/edit
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    type: 'banner',
    status: 'draft',
    content: '',
    targetUrl: '',
    impressions: 0,
    clicks: 0,
  });

  // Filter advertisements
  const filteredAds = adsList.filter((ad) => {
    const matchesSearch =
      ad.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ad.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAds.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAds = filteredAds.slice(startIndex, startIndex + itemsPerPage);

  // CRUD Operations
  const handleCreate = () => {
    if (!formData.name.trim()) return;

    const newAd = {
      id: Date.now(),
      name: formData.name,
      client: formData.client,
      type: formData.type,
      status: formData.status,
      content: formData.content,
      targetUrl: formData.targetUrl,
      impressions: 0,
      clicks: 0,
      date: new Date().toISOString().split('T')[0],
    };

    setAdsList([newAd, ...adsList]);
    setShowCreateModal(false);
    resetForm();
  };

  const handleEdit = (ad) => {
    setSelectedAd(ad);
    setFormData({
      name: ad.name,
      client: ad.client,
      type: ad.type,
      status: ad.status,
      content: ad.content || '',
      targetUrl: ad.targetUrl || '',
      impressions: ad.impressions || 0,
      clicks: ad.clicks || 0,
    });
    setShowEditModal(true);
  };

  const handleUpdate = () => {
    if (!formData.name.trim() || !selectedAd) return;

    const updatedAds = adsList.map((ad) =>
      ad.id === selectedAd.id
        ? {
            ...ad,
            name: formData.name,
            client: formData.client,
            type: formData.type,
            status: formData.status,
            content: formData.content,
            targetUrl: formData.targetUrl,
          }
        : ad,
    );

    setAdsList(updatedAds);
    setShowEditModal(false);
    resetForm();
    setSelectedAd(null);
  };

  const handleDelete = (ad) => {
    setSelectedAd(ad);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!selectedAd) return;

    setAdsList(adsList.filter((ad) => ad.id !== selectedAd.id));
    setShowDeleteModal(false);
    setSelectedAd(null);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      client: '',
      type: 'banner',
      status: 'draft',
      content: '',
      targetUrl: '',
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
                        <Button variant="outline" size="sm">
                          <FaEye className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <FaChartLine className="w-3 h-3" />
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
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter advertisement name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Client
            </label>
            <Input
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
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
              Content
            </label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Advertisement content or description"
              rows={4}
            />
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
            <Button onClick={handleCreate}>Create Advertisement</Button>
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
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter advertisement name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Client
            </label>
            <Input
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
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
              Content
            </label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Advertisement content or description"
              rows={4}
            />
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
            <Button onClick={handleUpdate}>Update Advertisement</Button>
          </div>
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
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Advertisement
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
