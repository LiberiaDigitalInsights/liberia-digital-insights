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
  Textarea,
  Badge,
} from '../ui';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaImage,
  FaVideo,
  FaCalendar,
  FaTag,
} from 'react-icons/fa';
import { useGallery } from '../../hooks/useGallery';
import { useToast } from '../../context/ToastContext';

// Backend API service for Liberia Digital Insights
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const errorMessage = error.error || error.message || `HTTP error! status: ${response.status}`;
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const token = localStorage.getItem('ldi_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};

// Extract the specific functions we need
const useEventsApi = () => {
  return {
    getEvents: async () => {
      const response = await apiRequest('/v1/events');
      return response?.data?.events || response?.events || response || [];
    },
  };
};

const usePodcastsApi = () => {
  return {
    getPodcasts: async () => {
      const response = await apiRequest('/v1/podcasts');
      return response?.data?.podcasts || response?.podcasts || response || [];
    },
  };
};

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'image',
    url: '',
    thumbnail_url: '',
    event_type: '',
    event_id: '',
    category: '',
    tags: '',
    featured: false,
  });

  const gallery = useGallery();
  const eventsApi = useEventsApi();
  const podcastsApi = usePodcastsApi();
  const { showToast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [itemsData, eventsData, podcastsData, categoriesData] = await Promise.all([
        gallery.getItems(),
        eventsApi.getEvents(),
        podcastsApi.getPodcasts(),
        gallery.getCategories(),
      ]);

      // Handle different response structures
      setItems(
        Array.isArray(itemsData?.items)
          ? itemsData.items
          : Array.isArray(itemsData)
            ? itemsData
            : [],
      );
      setEvents(
        Array.isArray(eventsData?.events)
          ? eventsData.events
          : Array.isArray(eventsData)
            ? eventsData
            : [],
      );
      setPodcasts(
        Array.isArray(podcastsData?.podcasts)
          ? podcastsData.podcasts
          : Array.isArray(podcastsData)
            ? podcastsData
            : [],
      );
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error('Error fetching gallery data:', error);
      showToast({ title: 'Error', description: 'Failed to load gallery data', variant: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const submitData = {
        ...formData,
        tags: formData.tags
          ? formData.tags
              .split(',')
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],
      };

      if (editingItem) {
        await gallery.updateItem(editingItem.id, submitData);
        showToast({
          title: 'Success',
          description: 'Gallery item updated successfully',
          variant: 'success',
        });
      } else {
        await gallery.createItem(submitData);
        showToast({
          title: 'Success',
          description: 'Gallery item created successfully',
          variant: 'success',
        });
      }

      setShowCreateModal(false);
      setEditingItem(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving gallery item:', error);
      showToast({ title: 'Error', description: 'Failed to save gallery item', variant: 'danger' });
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      type: item.type || 'image',
      url: item.url || '',
      thumbnail_url: item.thumbnail_url || '',
      event_type: item.event_type || '',
      event_id: item.event_id || '',
      category: item.category || '',
      tags: item.tags ? item.tags.join(', ') : '',
      featured: item.featured || false,
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      try {
        await gallery.deleteItem(item.id);
        showToast({
          title: 'Success',
          description: 'Gallery item deleted successfully',
          variant: 'success',
        });
        fetchData();
      } catch (error) {
        console.error('Error deleting gallery item:', error);
        showToast({
          title: 'Error',
          description: 'Failed to delete gallery item',
          variant: 'danger',
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'image',
      url: '',
      thumbnail_url: '',
      event_type: '',
      event_id: '',
      category: '',
      tags: '',
      featured: false,
    });
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const availableEvents =
    formData.event_type === 'event' ? events : formData.event_type === 'podcast' ? podcasts : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Gallery Management</h1>
          <p className="text-[var(--color-muted)]">
            Manage photos and videos from events and podcasts
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <FaPlus className="mr-2" />
          Add Gallery Item
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-muted)]" />
          <Input
            placeholder="Search gallery items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
        </Select>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative aspect-video bg-gray-100">
              <img
                src={item.thumbnail_url || item.url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge variant={item.type === 'video' ? 'danger' : 'secondary'}>
                  {item.type === 'video' ? (
                    <FaVideo className="mr-1" />
                  ) : (
                    <FaImage className="mr-1" />
                  )}
                  {item.type}
                </Badge>
              </div>
              {item.featured && (
                <div className="absolute top-2 left-2">
                  <Badge variant="warning">Featured</Badge>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-[var(--color-text)] mb-1 line-clamp-1">
                {item.title}
              </h3>
              {item.category && (
                <Badge variant="subtle" className="mb-2">
                  {item.category}
                </Badge>
              )}
              <div className="flex justify-between items-center">
                <div className="text-sm text-[var(--color-muted)]">
                  {item.event_type === 'event' && item.events?.title && (
                    <span>{item.events.title}</span>
                  )}
                  {item.event_type === 'podcast' && item.podcasts?.title && (
                    <span>{item.podcasts.title}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => handleEdit(item)}>
                    <FaEdit />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(item)}>
                    <FaTrash />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-[var(--color-muted)]">
          {items.length === 0 ? 'No gallery items yet.' : 'No items found matching your filters.'}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingItem(null);
          resetForm();
        }}
        title={editingItem ? 'Edit Gallery Item' : 'Add Gallery Item'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                Type *
              </label>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                URL *
              </label>
              <Input
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com/image.jpg or video URL"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Thumbnail URL
            </label>
            <Input
              value={formData.thumbnail_url}
              onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
              placeholder="https://example.com/thumbnail.jpg (optional)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                Event Type
              </label>
              <Select
                value={formData.event_type}
                onChange={(e) =>
                  setFormData({ ...formData, event_type: e.target.value, event_id: '' })
                }
              >
                <option value="">None</option>
                <option value="event">Event</option>
                <option value="podcast">Podcast</option>
              </Select>
            </div>

            {formData.event_type && (
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  {formData.event_type === 'event' ? 'Event' : 'Podcast'}
                </label>
                <Select
                  value={formData.event_id}
                  onChange={(e) => setFormData({ ...formData, event_id: e.target.value })}
                >
                  <option value="">
                    Select {formData.event_type === 'event' ? 'event' : 'podcast'}
                  </option>
                  {availableEvents.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title}
                    </option>
                  ))}
                </Select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                Category
              </label>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
                <option value="custom">Custom Category</option>
              </Select>
              {formData.category === 'custom' && (
                <Input
                  className="mt-2"
                  placeholder="Enter custom category"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                Tags
              </label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="featured" className="text-sm text-[var(--color-text)]">
              Featured item
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowCreateModal(false);
                setEditingItem(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">{editingItem ? 'Update' : 'Create'} Gallery Item</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
