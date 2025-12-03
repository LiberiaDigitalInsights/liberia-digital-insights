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
  FaSearch,
  FaTimes,
  FaCalendar,
  FaMapMarkerAlt,
  FaUsers,
} from 'react-icons/fa';
import { useEvents } from '../../hooks/useBackendApi';
import { backendApi } from '../../services/backendApi';
import { useToast } from '../../context/ToastContext';

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

const AdminEvents = ({ canEdit }) => {
  const { showToast } = useToast();
  const { data: eventsData, _loading, _error, refetch } = useEvents({});
  const events = eventsData?.events || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const itemsPerPage = 10;

  // Form state for create/edit
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    status: 'upcoming',
    maxAttendees: '',
    price: '',
    registrationUrl: '',
    coverImage: '',
  });

  // Status badge helper
  const getStatusBadge = (status) => {
    const styles = {
      published: 'bg-green-100 text-green-700',
      draft: 'bg-yellow-100 text-yellow-700',
      pending: 'bg-gray-100 text-gray-700',
      upcoming: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
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

  // Filter events
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage);

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

      const newEvent = {
        title: formData.title,
        slug,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        category: formData.category,
        status: formData.status,
        max_attendees: parseInt(formData.maxAttendees) || 0,
        price: formData.price ? parseFloat(formData.price) : 0,
        registration_url: formData.registrationUrl,
        cover_image_url: formData.coverImage,
      };

      await backendApi.events.create(newEvent);
      await refetch();

      showToast({
        title: 'Event Created',
        description: 'Event has been created successfully.',
        variant: 'success',
      });

      setShowCreateModal(false);
      resetForm();
    } catch {
      showToast({
        title: 'Error',
        description: 'Failed to create event.',
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      date: event.date,
      time: event.time || '',
      location: event.location,
      category: event.category || '',
      status: event.status,
      maxAttendees: event.max_attendees?.toString() || '',
      price: event.price?.toString() || '',
      registrationUrl: event.registration_url || '',
      coverImage: event.cover_image_url || '',
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!formData.title.trim() || !selectedEvent) return;

    setSubmitting(true);
    try {
      const updatedEvent = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time || null,
        location: formData.location,
        category: formData.category,
        status: formData.status,
        max_attendees: parseInt(formData.maxAttendees) || 0,
        price: formData.price ? parseFloat(formData.price) : 0,
        registration_url: formData.registrationUrl || null,
        cover_image_url: formData.coverImage || null,
      };

      await backendApi.events.update(selectedEvent.id, updatedEvent);
      await refetch();

      showToast({
        title: 'Event Updated',
        description: 'Event has been updated successfully.',
        variant: 'success',
      });

      setShowEditModal(false);
      resetForm();
      setSelectedEvent(null);
    } catch (error) {
      console.error('Update error:', error);
      showToast({
        title: 'Error',
        description: `Failed to update event: ${error.message}`,
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (event) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedEvent) return;

    setSubmitting(true);
    try {
      await backendApi.events.delete(selectedEvent.id);
      await refetch();

      showToast({
        title: 'Event Deleted',
        description: 'Event has been deleted successfully.',
        variant: 'success',
      });

      setShowDeleteModal(false);
      setSelectedEvent(null);
    } catch {
      showToast({
        title: 'Error',
        description: 'Failed to delete event.',
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      category: '',
      status: 'upcoming',
      maxAttendees: '',
    });
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      upcoming: 'bg-blue-100 text-blue-700',
      ongoing: 'bg-green-100 text-green-700',
      completed: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${styles[status] || styles.upcoming}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Events</h1>
        <p className="text-[var(--color-muted)]">Manage your events, workshops, and conferences</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-muted)]" />
            <Input
              placeholder="Search events..."
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
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </Select>
        {canEdit && (
          <Button onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto">
            <FaPlus className="mr-2" />
            New Event
          </Button>
        )}
      </div>

      {/* Events Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-muted)]">
                    Event
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-muted)]">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-muted)]">
                    Location
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-muted)]">
                    Attendees
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-muted)]">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-muted)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface)]"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-[var(--color-text)]">{event.title}</p>
                        <p className="text-sm text-[var(--color-muted)]">{event.category}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-[var(--color-text)]">{event.date}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <FaMapMarkerAlt className="w-3 h-3 text-[var(--color-muted)]" />
                        <span className="text-sm text-[var(--color-text)]">{event.location}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <FaUsers className="w-3 h-3 text-[var(--color-muted)]" />
                        <span className="text-sm text-[var(--color-text)]">
                          {event.attendees}/{event.maxAttendees}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={event.status} />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedEvent(event);
                            setShowDetailsModal(true);
                          }}
                          title="View Event Details"
                        >
                          <FaCalendar className="w-3 h-3" />
                        </Button>
                        {canEdit && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => handleEdit(event)}>
                              <FaEdit className="w-3 h-3" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete(event)}>
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
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredEvents.length)}{' '}
            of {filteredEvents.length} events
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
        title="Create New Event"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Event Title
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter event title"
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
              Category
            </label>
            <Select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select category</option>
              <option value="Conference">Conference</option>
              <option value="Workshop">Workshop</option>
              <option value="Seminar">Seminar</option>
              <option value="Networking">Networking</option>
              <option value="Webinar">Webinar</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Date</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Time</label>
            <Input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              placeholder="Event time"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Price
            </label>
            <Input
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="Free or price amount"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Registration URL
            </label>
            <Input
              value={formData.registrationUrl}
              onChange={(e) => setFormData({ ...formData, registrationUrl: e.target.value })}
              placeholder="https://example.com/register"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Location
            </label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Event location"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Max Attendees
            </label>
            <Input
              type="number"
              value={formData.maxAttendees}
              onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
              placeholder="Maximum number of attendees"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Description
            </label>
            <RichTextEditor
              value={formData.description}
              onChange={(content) => setFormData({ ...formData, description: content })}
              placeholder="Event description"
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
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title={`Edit Event: ${selectedEvent?.title}`}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Event Title
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter event title"
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
              Category
            </label>
            <Select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select category</option>
              <option value="Conference">Conference</option>
              <option value="Workshop">Workshop</option>
              <option value="Seminar">Seminar</option>
              <option value="Networking">Networking</option>
              <option value="Webinar">Webinar</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Date</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Time</label>
            <Input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              placeholder="Event time"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Price
            </label>
            <Input
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="Free or price amount"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Registration URL
            </label>
            <Input
              value={formData.registrationUrl}
              onChange={(e) => setFormData({ ...formData, registrationUrl: e.target.value })}
              placeholder="https://example.com/register"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Location
            </label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Event location"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Max Attendees
            </label>
            <Input
              type="number"
              value={formData.maxAttendees}
              onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
              placeholder="Maximum number of attendees"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Description
            </label>
            <RichTextEditor
              value={formData.description}
              onChange={(content) => setFormData({ ...formData, description: content })}
              placeholder="Event description"
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
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={submitting}>
              {submitting ? 'Updating...' : 'Update Event'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Event Details Modal */}
      <Modal
        open={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Event Details"
      >
        <div className="space-y-4">
          {selectedEvent && (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Title</label>
                  <p className="text-[var(--color-text)] font-medium">{selectedEvent.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Description</label>
                  <p className="text-[var(--color-text)]">{selectedEvent.description || 'N/A'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Date</label>
                    <p className="text-[var(--color-text)]">{selectedEvent.date || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Time</label>
                    <p className="text-[var(--color-text)]">{selectedEvent.time || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Location</label>
                    <p className="text-[var(--color-text)]">{selectedEvent.location || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Status</label>
                    <div>{getStatusBadge(selectedEvent.status)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Attendees</label>
                    <p className="text-[var(--color-text)]">{selectedEvent.attendees || 0} / {selectedEvent.maxAttendees || 0}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Price</label>
                    <p className="text-[var(--color-text)]">{selectedEvent.price || 'Free'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Cover Image</label>
                  <p className="text-[var(--color-text)] text-sm">
                    {selectedEvent.cover_image_url ? (
                      <a href={selectedEvent.cover_image_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {selectedEvent.cover_image_url}
                      </a>
                    ) : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Registration URL</label>
                  <p className="text-[var(--color-text)] text-sm">
                    {selectedEvent.registration_url ? (
                      <a href={selectedEvent.registration_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {selectedEvent.registration_url}
                      </a>
                    ) : 'N/A'}
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
      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Event">
        <div className="space-y-4">
          <p className="text-[var(--color-text)]">
            Are you sure you want to delete "{selectedEvent?.title}"? This action cannot be undone.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={submitting}>
              {submitting ? 'Deleting...' : 'Delete Event'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FaCalendar className="w-12 h-12 text-[var(--color-muted)] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[var(--color-text)] mb-2">No events found</h3>
            <p className="text-[var(--color-muted)] mb-4">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first event'}
            </p>
            {canEdit && !searchTerm && filterStatus === 'all' && (
              <Button onClick={() => setShowCreateModal(true)}>
                <FaPlus className="mr-2" />
                Create Event
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminEvents;
