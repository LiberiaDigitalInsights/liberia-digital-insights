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

const AdminPodcasts = ({ podcasts, canEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [podcastsList, setPodcastsList] = useState(podcasts);
  const itemsPerPage = 10;

  // Form state for create/edit
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    guest: '',
    category: '',
    status: 'draft',
    audioUrl: '',
    transcript: '',
    videoUrl: '',
    youtubeUrl: '',
    facebookUrl: '',
    spotifyUrl: '',
    applePodcastsUrl: '',
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

  // Filter podcasts
  const filteredPodcasts = podcastsList.filter((podcast) => {
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
  const handleCreate = () => {
    if (!formData.title.trim()) return;

    const newPodcast = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      duration: formData.duration,
      guest: formData.guest,
      category: formData.category,
      status: formData.status,
      audioUrl: formData.audioUrl,
      transcript: formData.transcript,
      videoUrl: formData.videoUrl,
      youtubeUrl: formData.youtubeUrl,
      facebookUrl: formData.facebookUrl,
      spotifyUrl: formData.spotifyUrl,
      applePodcastsUrl: formData.applePodcastsUrl,
      coverImage: formData.coverImage,
      date: new Date().toISOString().split('T')[0],
      plays: 0,
    };

    setPodcastsList([newPodcast, ...podcastsList]);
    setShowCreateModal(false);
    resetForm();
  };

  const handleEdit = (podcast) => {
    setSelectedPodcast(podcast);
    setFormData({
      title: podcast.title,
      description: podcast.description || '',
      duration: podcast.duration || '',
      guest: podcast.guest || '',
      category: podcast.category || '',
      status: podcast.status,
      audioUrl: podcast.audioUrl || '',
      transcript: podcast.transcript || '',
      videoUrl: podcast.videoUrl || '',
      youtubeUrl: podcast.youtubeUrl || '',
      facebookUrl: podcast.facebookUrl || '',
      spotifyUrl: podcast.spotifyUrl || '',
      applePodcastsUrl: podcast.applePodcastsUrl || '',
      coverImage: podcast.coverImage || '',
    });
    setShowEditModal(true);
  };

  const handleUpdate = () => {
    if (!formData.title.trim() || !selectedPodcast) return;

    const updatedPodcasts = podcastsList.map((podcast) =>
      podcast.id === selectedPodcast.id
        ? {
            ...podcast,
            title: formData.title,
            description: formData.description,
            duration: formData.duration,
            guest: formData.guest,
            category: formData.category,
            status: formData.status,
            audioUrl: formData.audioUrl,
            transcript: formData.transcript,
            videoUrl: formData.videoUrl,
            youtubeUrl: formData.youtubeUrl,
            facebookUrl: formData.facebookUrl,
            spotifyUrl: formData.spotifyUrl,
            applePodcastsUrl: formData.applePodcastsUrl,
            coverImage: formData.coverImage,
          }
        : podcast,
    );

    setPodcastsList(updatedPodcasts);
    setShowEditModal(false);
    resetForm();
    setSelectedPodcast(null);
  };

  const handleDelete = (podcast) => {
    setSelectedPodcast(podcast);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!selectedPodcast) return;

    setPodcastsList(podcastsList.filter((podcast) => podcast.id !== selectedPodcast.id));
    setShowDeleteModal(false);
    setSelectedPodcast(null);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration: '',
      guest: '',
      category: '',
      status: 'draft',
      audioUrl: '',
      transcript: '',
      videoUrl: '',
      youtubeUrl: '',
      facebookUrl: '',
      spotifyUrl: '',
      applePodcastsUrl: '',
      coverImage: '',
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
                        <Button variant="outline" size="sm">
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
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select category</option>
              <option value="Technology">Technology</option>
              <option value="Business">Business</option>
              <option value="Innovation">Innovation</option>
              <option value="Leadership">Leadership</option>
              <option value="Interview">Interview</option>
            </Select>
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
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
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
            <MediaPreview url={formData.coverImage} type="image" />
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
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                />
                <MediaPreview url={formData.youtubeUrl} type="youtube" />
              </div>

              {/* Facebook */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Facebook URL
                </label>
                <Input
                  value={formData.facebookUrl}
                  onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                  placeholder="https://facebook.com/..."
                />
                <MediaPreview url={formData.facebookUrl} type="facebook" />
              </div>

              {/* Spotify */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Spotify URL
                </label>
                <Input
                  value={formData.spotifyUrl}
                  onChange={(e) => setFormData({ ...formData, spotifyUrl: e.target.value })}
                  placeholder="https://open.spotify.com/episode/..."
                />
              </div>

              {/* Apple Podcasts */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Apple Podcasts URL
                </label>
                <Input
                  value={formData.applePodcastsUrl}
                  onChange={(e) => setFormData({ ...formData, applePodcastsUrl: e.target.value })}
                  placeholder="https://podcasts.apple.com/..."
                />
              </div>

              {/* Audio File */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Audio File URL
                </label>
                <Input
                  value={formData.audioUrl}
                  onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                  placeholder="https://example.com/audio.mp3"
                />
              </div>

              {/* Video File */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Video File URL
                </label>
                <Input
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://example.com/video.mp4"
                />
              </div>
            </div>
          </div>

          {/* Transcript */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Transcript
            </label>
            <RichTextEditor
              value={formData.transcript}
              onChange={(e) => setFormData({ ...formData, transcript: e.target.value })}
              placeholder="Episode transcript"
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
              <option value="scheduled">Scheduled</option>
              <option value="archived">Archived</option>
            </Select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Episode</Button>
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
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select category</option>
              <option value="Technology">Technology</option>
              <option value="Business">Business</option>
              <option value="Innovation">Innovation</option>
              <option value="Leadership">Leadership</option>
              <option value="Interview">Interview</option>
            </Select>
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
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
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
            <MediaPreview url={formData.coverImage} type="image" />
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
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                />
                <MediaPreview url={formData.youtubeUrl} type="youtube" />
              </div>

              {/* Facebook */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Facebook URL
                </label>
                <Input
                  value={formData.facebookUrl}
                  onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                  placeholder="https://facebook.com/..."
                />
                <MediaPreview url={formData.facebookUrl} type="facebook" />
              </div>

              {/* Spotify */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Spotify URL
                </label>
                <Input
                  value={formData.spotifyUrl}
                  onChange={(e) => setFormData({ ...formData, spotifyUrl: e.target.value })}
                  placeholder="https://open.spotify.com/episode/..."
                />
              </div>

              {/* Apple Podcasts */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Apple Podcasts URL
                </label>
                <Input
                  value={formData.applePodcastsUrl}
                  onChange={(e) => setFormData({ ...formData, applePodcastsUrl: e.target.value })}
                  placeholder="https://podcasts.apple.com/..."
                />
              </div>

              {/* Audio File */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Audio File URL
                </label>
                <Input
                  value={formData.audioUrl}
                  onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                  placeholder="https://example.com/audio.mp3"
                />
              </div>

              {/* Video File */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Video File URL
                </label>
                <Input
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://example.com/video.mp4"
                />
              </div>
            </div>
          </div>

          {/* Transcript */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Transcript
            </label>
            <RichTextEditor
              value={formData.transcript}
              onChange={(e) => setFormData({ ...formData, transcript: e.target.value })}
              placeholder="Episode transcript"
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
              <option value="scheduled">Scheduled</option>
              <option value="archived">Archived</option>
            </Select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update Episode</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Podcast Episode"
      >
        <div className="space-y-4">
          <p className="text-[var(--color-text)]">
            Are you sure you want to delete "{selectedPodcast?.title}"? This action cannot be
            undone.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Episode
            </Button>
          </div>
        </div>
      </Modal>

      {/* Empty State */}
      {filteredPodcasts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FaMicrophone className="w-12 h-12 text-[var(--color-muted)] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[var(--color-text)] mb-2">
              No podcast episodes found
            </h3>
            <p className="text-[var(--color-muted)] mb-4">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first podcast episode'}
            </p>
            {canEdit && !searchTerm && filterStatus === 'all' && (
              <Button onClick={() => setShowCreateModal(true)}>
                <FaPlus className="mr-2" />
                Create Episode
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminPodcasts;
