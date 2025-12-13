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
  Textarea,
  RichTextEditor,
} from '../ui';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaPlay,
  FaPause,
  FaSearch,
  FaTimes,
  FaMicrophone,
} from 'react-icons/fa';
import PodcastUpload from './PodcastUpload';
import { usePodcasts } from '../../hooks/useBackendApi';
import { backendApi } from '../../services/backendApi';
import { useToast } from '../../context/ToastContext';
import { useCategories } from '../../hooks/useBackendApi';

const AdminPodcasts = ({ canEdit }) => {
  const { showToast } = useToast();
  const { data: podcastsData, refetch } = usePodcasts({});
  const { data: categoriesData } = useCategories({});
  const podcasts = podcastsData?.podcasts || [];
  const categories = categoriesData?.data || [];

  // Fallback categories if API fails
  const fallbackCategories = [
    { id: 'technology-fallback', name: 'Technology' },
    { id: 'business-fallback', name: 'Business' },
    { id: 'innovation-fallback', name: 'Innovation' },
    { id: 'leadership-fallback', name: 'Leadership' },
    { id: 'interview-fallback', name: 'Interview' },
  ];

  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // File upload states
  const [audioFile, setAudioFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  // File upload handlers
  const handleAudioUpload = async (file) => {
    if (!file) return;

    // Check file type
    const validAudioTypes = ['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/m4a', 'audio/mp4', 'audio/x-m4a', 'audio/ogg'];
    if (!validAudioTypes.includes(file.type)) {
      alert('Please upload a valid audio file (MP3, WAV, M4A, OGG)');
      return;
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('Audio file must be less than 50MB');
      return;
    }

    setAudioFile(file);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'audio');

      const response = await fetch('http://localhost:5000/v1/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData((prev) => ({ ...prev, audio_url: data.url }));
        showToast({
          title: 'Audio Uploaded',
          description: 'Audio file uploaded successfully',
          variant: 'success',
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Audio upload error:', error);
      showToast({
        title: 'Upload Failed',
        description: 'Failed to upload audio file',
        variant: 'error',
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleVideoUpload = async (file) => {
    if (!file) return;

    // Check file type
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!validVideoTypes.includes(file.type)) {
      alert('Please upload a valid video file (MP4, WebM, OGG)');
      return;
    }

    // Check file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      alert('Video file must be less than 100MB');
      return;
    }

    setVideoFile(file);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'video');

      const response = await fetch('http://localhost:5000/v1/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData((prev) => ({ ...prev, video_url: data.url }));
        showToast({
          title: 'Video Uploaded',
          description: 'Video file uploaded successfully',
          variant: 'success',
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Video upload error:', error);
      showToast({
        title: 'Upload Failed',
        description: 'Failed to upload video file',
        variant: 'error',
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };
  const itemsPerPage = 10;

  // Form state for create/edit
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    guest: '',
    category_id: '',
    episode_number: '',
    season_number: '',
    language: 'en',
    audio_url: '',
    video_url: '',
    tags: '',
    is_featured: false,
    status: 'draft',
    transcript: '',
    youtube_url: '',
    facebook_url: '',
    spotify_url: '',
    apple_podcasts_url: '',
    cover_image_url: '',
  });

  // Handle image upload and convert to base64
  const handleImageUpload = (e, fieldName = 'cover_image_url') => {
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

  // Filter podcasts
  const filteredPodcasts = podcasts.filter((podcast) => {
    const matchesSearch =
      podcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      podcast.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || podcast.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPodcasts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPodcasts = filteredPodcasts.slice(startIndex, startIndex + itemsPerPage);

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

      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add all text fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('slug', slug);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('duration', formData.duration);
      formDataToSend.append('guest', formData.guest);
      formDataToSend.append('category_id', formData.category_id || '');
      formDataToSend.append('episode_number', formData.episode_number || '');
      formDataToSend.append('season_number', formData.season_number || '');
      formDataToSend.append('language', formData.language);
      formDataToSend.append('tags', JSON.stringify(formData.tags ? formData.tags.split(',').map((tag) => tag.trim()) : []));
      formDataToSend.append('is_featured', formData.is_featured);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('transcript', formData.transcript);
      formDataToSend.append('video_url', formData.video_url);
      formDataToSend.append('youtube_url', formData.youtube_url);
      formDataToSend.append('facebook_url', formData.facebook_url);
      formDataToSend.append('spotify_url', formData.spotify_url);
      formDataToSend.append('apple_podcasts_url', formData.apple_podcasts_url);
      
      // Add existing URLs if provided
      if (formData.audio_url) formDataToSend.append('audio_url', formData.audio_url);
      if (formData.cover_image_url) formDataToSend.append('cover_image_url', formData.cover_image_url);
      
      // Add files if they exist in state
      if (audioFile) {
        formDataToSend.append('audio_file', audioFile);
      }
      if (videoFile) {
        formDataToSend.append('cover_image', videoFile);
      }

      // Send FormData directly
      const response = await fetch('http://localhost:5000/v1/podcasts', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create podcast');
      }

      await response.json();
      await refetch();

      showToast({
        title: 'Podcast Created',
        description: 'Podcast has been created successfully.',
        variant: 'success',
      });

      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Create error:', error);
      showToast({
        title: 'Error',
        description: error.message || 'Failed to create podcast.',
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (podcast) => {
    setSelectedPodcast(podcast);
    setFormData({
      title: podcast.title,
      description: podcast.description || '',
      duration: podcast.duration || '',
      guest: podcast.guest || '',
      category_id: podcast.category_id || '',
      episode_number: podcast.episode_number || '',
      season_number: podcast.season_number || '',
      language: podcast.language || 'en',
      tags: podcast.tags ? podcast.tags.join(', ') : '',
      is_featured: podcast.is_featured || false,
      status: podcast.status,
      audio_url: '',
      transcript: podcast.transcript || '',
      video_url: '',
      youtube_url: podcast.youtube_url || '',
      facebook_url: podcast.facebook_url || '',
      spotify_url: podcast.spotify_url || '',
      apple_podcasts_url: podcast.apple_podcasts_url || '',
      cover_image_url: podcast.cover_image_url || '',
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!formData.title.trim() || !selectedPodcast) return;

    setSubmitting(true);
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add all text fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('duration', formData.duration);
      formDataToSend.append('guest', formData.guest);
      formDataToSend.append('category_id', formData.category_id || '');
      formDataToSend.append('episode_number', formData.episode_number || '');
      formDataToSend.append('season_number', formData.season_number || '');
      formDataToSend.append('language', formData.language);
      formDataToSend.append('tags', JSON.stringify(formData.tags ? formData.tags.split(',').map((tag) => tag.trim()) : []));
      formDataToSend.append('is_featured', formData.is_featured);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('transcript', formData.transcript);
      formDataToSend.append('video_url', formData.video_url);
      formDataToSend.append('youtube_url', formData.youtube_url);
      formDataToSend.append('facebook_url', formData.facebook_url);
      formDataToSend.append('spotify_url', formData.spotify_url);
      formDataToSend.append('apple_podcasts_url', formData.apple_podcasts_url);
      
      // Add existing URLs if provided
      if (formData.audio_url) formDataToSend.append('audio_url', formData.audio_url);
      if (formData.cover_image_url) formDataToSend.append('cover_image_url', formData.cover_image_url);
      
      // Add files if they exist in state
      if (audioFile) {
        formDataToSend.append('audio_file', audioFile);
      }
      if (videoFile) {
        formDataToSend.append('cover_image', videoFile);
      }

      console.log('Updating podcast:', selectedPodcast.id);
      
      // Send FormData directly
      const response = await fetch(`http://localhost:5000/v1/podcasts/${selectedPodcast.id}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update podcast');
      }

      await response.json();
      await refetch();

      showToast({
        title: 'Podcast Updated',
        description: 'Podcast has been updated successfully.',
        variant: 'success',
      });

      setShowEditModal(false);
      resetForm();
      setSelectedPodcast(null);
    } catch (error) {
      console.error('Update error:', error);
      showToast({
        title: 'Error',
        description: error.message || 'Failed to update podcast.',
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (podcast) => {
    setSelectedPodcast(podcast);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedPodcast) return;

    setSubmitting(true);
    try {
      await backendApi.podcasts.delete(selectedPodcast.id);
      await refetch();

      showToast({
        title: 'Podcast Deleted',
        description: 'Podcast has been deleted successfully.',
        variant: 'success',
      });

      setShowDeleteModal(false);
      setSelectedPodcast(null);
    } catch {
      showToast({
        title: 'Error',
        description: 'Failed to delete podcast.',
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
      duration: '',
      guest: '',
      category_id: '',
      episode_number: '',
      season_number: '',
      language: 'en',
      tags: '',
      is_featured: false,
      status: 'draft',
      audio_url: '',
      transcript: '',
      video_url: '',
      youtube_url: '',
      facebook_url: '',
      spotify_url: '',
      apple_podcasts_url: '',
      cover_image_url: '',
    });
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      published: 'bg-green-100 text-green-700',
      draft: 'bg-yellow-100 text-yellow-700',
      scheduled: 'bg-blue-100 text-blue-700',
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

    const getEmbedUrl = (url, type) => {
      if (type === 'youtube') {
        const videoId = url.match(
          /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        );
        return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : null;
      }
      if (type === 'facebook') {
        // eslint-disable-next-line no-useless-escape
        const videoId = url.match(/facebook\.com\/.*\/videos\/([^\/?]+)/);
        return videoId
          ? `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}`
          : null;
      }
      return url;
    };

    const embedUrl = getEmbedUrl(url, type);

    if (type === 'youtube' && embedUrl) {
      return (
        <div className="mt-2">
          <iframe
            src={embedUrl}
            className="w-full h-48 rounded-lg"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    if (type === 'facebook' && embedUrl) {
      return (
        <div className="mt-2">
          <iframe
            src={embedUrl}
            className="w-full h-48 rounded-lg"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
          />
        </div>
      );
    }

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
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Podcasts</h1>
        <p className="text-[var(--color-muted)]">Manage your podcast episodes and audio content</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-muted)]" />
            <Input
              placeholder="Search podcasts..."
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
          <option value="scheduled">Scheduled</option>
          <option value="archived">Archived</option>
        </Select>
        {canEdit && (
          <Button onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto">
            <FaPlus className="mr-2" />
            New Episode
          </Button>
        )}
      </div>

      {/* Podcasts Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-muted)]">
                    Episode
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-muted)]">
                    Guest
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-muted)]">
                    Duration
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-muted)]">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-muted)]">
                    Plays
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-muted)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedPodcasts.map((podcast) => (
                  <tr
                    key={podcast.id}
                    className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface)]"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-[var(--color-text)]">{podcast.title}</p>
                        <p className="text-sm text-[var(--color-muted)]">{podcast.description}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-[var(--color-text)]">
                        {podcast.guest || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-[var(--color-text)]">
                        {podcast.duration || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={podcast.status} />
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-[var(--color-text)]">{podcast.plays || 0}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedPodcast(podcast);
                            setShowDetailsModal(true);
                          }}
                          title="View Podcast Details"
                        >
                          <FaPlay className="w-3 h-3" />
                        </Button>
                        {canEdit && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => handleEdit(podcast)}>
                              <FaEdit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(podcast)}
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
            {Math.min(startIndex + itemsPerPage, filteredPodcasts.length)} of{' '}
            {filteredPodcasts.length} podcasts
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
        title="Create New Podcast Episode"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Episode Title
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter episode title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Guest</label>
            <Input
              value={formData.guest}
              onChange={(e) => setFormData({ ...formData, guest: e.target.value })}
              placeholder="Guest name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Category
            </label>
            <Select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            >
              <option value="">Select category</option>
              {displayCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                Episode Number
              </label>
              <Input
                type="number"
                value={formData.episode_number}
                onChange={(e) => setFormData({ ...formData, episode_number: e.target.value })}
                placeholder="e.g., 1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                Season Number
              </label>
              <Input
                type="number"
                value={formData.season_number}
                onChange={(e) => setFormData({ ...formData, season_number: e.target.value })}
                placeholder="e.g., 1"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Duration
            </label>
            <Input
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="e.g., 45:30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Episode description"
              rows={3}
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Cover Image
            </label>
            <div className="flex gap-2">
              <Input
                value={formData.cover_image_url}
                onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                placeholder="https://example.com/cover.jpg"
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
            <MediaPreview url={formData.cover_image_url} type="image" />

            <PodcastUpload
              formData={formData}
              setFormData={setFormData}
              uploading={uploading}
              setUploading={setUploading}
              audioFile={audioFile}
              setAudioFile={setAudioFile}
              videoFile={videoFile}
              setVideoFile={setVideoFile}
              uploadProgress={uploadProgress}
              setUploadProgress={setUploadProgress}
              handleAudioUpload={handleAudioUpload}
              handleVideoUpload={handleVideoUpload}
            />
          </div>

          {/* Media Links Section */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-[var(--color-text)] mb-3">Media Links</h3>

            {/* YouTube */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  YouTube URL
                </label>
                <Input
                  value={formData.youtube_url}
                  onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                />
                <MediaPreview url={formData.youtube_url} type="youtube" />
              </div>

              {/* Facebook */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Facebook URL
                </label>
                <Input
                  value={formData.facebook_url}
                  onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                  placeholder="https://facebook.com/..."
                />
                <MediaPreview url={formData.facebook_url} type="facebook" />
              </div>

              {/* Spotify */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Spotify URL
                </label>
                <Input
                  value={formData.spotify_url}
                  onChange={(e) => setFormData({ ...formData, spotify_url: e.target.value })}
                  placeholder="https://spotify.com/..."
                />
                <MediaPreview url={formData.spotify_url} type="spotify" />
              </div>

              {/* Apple Podcasts */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Apple Podcasts URL
                </label>
                <Input
                  value={formData.apple_podcasts_url}
                  onChange={(e) => setFormData({ ...formData, apple_podcasts_url: e.target.value })}
                  placeholder="https://podcasts.apple.com/..."
                />
                <MediaPreview url={formData.apple_podcasts_url} type="apple" />
              </div>
            </div>
          </div>

          {/* Additional Fields */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-[var(--color-text)] mb-3">Additional Settings</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Tags (comma-separated)
                </label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="technology, innovation, africa"
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

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                />
                <label htmlFor="featured" className="text-sm text-[var(--color-text)]">
                  Featured Episode
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Transcript
                </label>
                <Textarea
                  value={formData.transcript}
                  onChange={(e) => setFormData({ ...formData, transcript: e.target.value })}
                  placeholder="Episode transcript..."
                  rows={5}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Episode'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Podcast Episode"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Episode Title
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter episode title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Guest</label>
            <Input
              value={formData.guest}
              onChange={(e) => setFormData({ ...formData, guest: e.target.value })}
              placeholder="Guest name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Category
            </label>
            <Select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            >
              <option value="">Select category</option>
              {displayCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                Episode Number
              </label>
              <Input
                type="number"
                value={formData.episode_number}
                onChange={(e) => setFormData({ ...formData, episode_number: e.target.value })}
                placeholder="e.g., 1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                Season Number
              </label>
              <Input
                type="number"
                value={formData.season_number}
                onChange={(e) => setFormData({ ...formData, season_number: e.target.value })}
                placeholder="e.g., 1"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Duration
            </label>
            <Input
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="e.g., 45:30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Episode description"
              rows={3}
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Cover Image
            </label>
            <div className="flex gap-2">
              <Input
                value={formData.cover_image_url}
                onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                placeholder="https://example.com/cover.jpg"
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
            <MediaPreview url={formData.cover_image_url} type="image" />
          </div>

          <PodcastUpload
            formData={formData}
            setFormData={setFormData}
            uploading={uploading}
            setUploading={setUploading}
            audioFile={audioFile}
            setAudioFile={setAudioFile}
            videoFile={videoFile}
            setVideoFile={setVideoFile}
            uploadProgress={uploadProgress}
            setUploadProgress={setUploadProgress}
            handleAudioUpload={handleAudioUpload}
            handleVideoUpload={handleVideoUpload}
          />

          {/* Media Links Section */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-[var(--color-text)] mb-3">Media Links</h3>

            {/* YouTube */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  YouTube URL
                </label>
                <Input
                  value={formData.youtube_url}
                  onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                />
                <MediaPreview url={formData.youtube_url} type="youtube" />
              </div>

              {/* Facebook */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Facebook URL
                </label>
                <Input
                  value={formData.facebook_url}
                  onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                  placeholder="https://facebook.com/..."
                />
                <MediaPreview url={formData.facebook_url} type="facebook" />
              </div>

              {/* Spotify */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Spotify URL
                </label>
                <Input
                  value={formData.spotify_url}
                  onChange={(e) => setFormData({ ...formData, spotify_url: e.target.value })}
                  placeholder="https://spotify.com/..."
                />
                <MediaPreview url={formData.spotify_url} type="spotify" />
              </div>

              {/* Apple Podcasts */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Apple Podcasts URL
                </label>
                <Input
                  value={formData.apple_podcasts_url}
                  onChange={(e) => setFormData({ ...formData, apple_podcasts_url: e.target.value })}
                  placeholder="https://podcasts.apple.com/..."
                />
                <MediaPreview url={formData.apple_podcasts_url} type="apple" />
              </div>
            </div>
          </div>

          {/* Additional Fields */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-[var(--color-text)] mb-3">Additional Settings</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Tags (comma-separated)
                </label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="technology, innovation, africa"
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

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                />
                <label htmlFor="featured" className="text-sm text-[var(--color-text)]">
                  Featured Episode
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Transcript
                </label>
                <Textarea
                  value={formData.transcript}
                  onChange={(e) => setFormData({ ...formData, transcript: e.target.value })}
                  placeholder="Episode transcript..."
                  rows={5}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowEditModal(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={submitting}>
              {submitting ? 'Updating...' : 'Update Episode'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Details Modal */}
      <Modal
        open={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Podcast Details"
      >
        <div className="space-y-4">
          {selectedPodcast && (
            <>
              <div>
                <h3 className="font-medium text-[var(--color-text)]">{selectedPodcast.title}</h3>
                <p className="text-sm text-[var(--color-muted)] mt-1">
                  {selectedPodcast.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">Guest</p>
                  <p className="text-sm text-[var(--color-muted)]">
                    {selectedPodcast.guest || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">Duration</p>
                  <p className="text-sm text-[var(--color-muted)]">
                    {selectedPodcast.duration || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">Status</p>
                  <StatusBadge status={selectedPodcast.status} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">Plays</p>
                  <p className="text-sm text-[var(--color-muted)]">{selectedPodcast.plays || 0}</p>
                </div>
              </div>
              {selectedPodcast.audio_url && (
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)] mb-2">Audio</p>
                  <audio controls className="w-full">
                    <source src={selectedPodcast.audio_url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </>
          )}
          <div className="flex justify-end pt-4">
            <Button onClick={() => setShowDetailsModal(false)}>Close</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Podcast"
      >
        <div className="space-y-4">
          <div>
            <p className="text-[var(--color-text)]">
              Are you sure you want to delete "{selectedPodcast?.title}"? This action cannot be
              undone.
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {submitting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminPodcasts;
