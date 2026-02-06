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
  Badge,
} from '../ui';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaLinkedin,
  FaTwitter,
  FaGlobe,
  FaGithub,
} from 'react-icons/fa';
import { useTalents } from '../../hooks/useBackendApi';
import { backendApi } from '../../services/backendApi';
import { useToast } from '../../context/ToastContext';
import { uploadFile } from '../../utils/uploadClient';

const AdminTalent = () => {
  const { showToast } = useToast();
  const { data: talentsData, loading, refetch } = useTalents({});
  const talents = talentsData?.talents || [];

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    role: '',
    bio: '',
    category: '',
    skills: '',
    experience: '',
    location: '',
    availability: '',
    status: 'pending',
    avatar_url: '',
    links: {
      website: '',
      linkedin: '',
      twitter: '',
      github: '',
      email: '',
    },
  });

  // Categories
  const categories = [
    'Design',
    'Engineering',
    'Product',
    'Marketing',
    'Sales',
    'Operations',
    'Data',
    'Research',
    'Other',
  ];

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      role: '',
      bio: '',
      category: '',
      skills: '',
      experience: '',
      location: '',
      availability: '',
      status: 'pending',
      avatar_url: '',
      links: {
        website: '',
        linkedin: '',
        twitter: '',
        github: '',
        email: '',
      },
    });
  };

  // Generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .trim('-');
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('links.')) {
      const linkField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        links: {
          ...prev.links,
          [linkField]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }

    // Auto-generate slug when name changes
    if (name === 'name') {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value),
      }));
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({
        ...prev,
        avatar_url: reader.result,
      }));
    };
    reader.readAsDataURL(file);
    e.currentTarget.value = '';
  };

  // Filter talents
  const filteredTalents = talents.filter((talent) => {
    const matchesSearch = talent.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         talent.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         talent.bio?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || talent.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || talent.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // CRUD Operations
  const handleCreate = async () => {
    if (!formData.name.trim()) return;

    setSubmitting(true);
    try {
      const talentData = {
        ...formData,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(s => s) : [],
      };

      await backendApi.talents.create(talentData);
      await refetch();

      showToast({
        title: 'Talent Created',
        description: 'New talent profile has been created.',
        variant: 'success',
      });

      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      showToast({
        title: 'Error',
        description: error.message || 'Failed to create talent.',
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (talent) => {
    setSelectedTalent(talent);
    setFormData({
      name: talent.name || '',
      slug: talent.slug || '',
      role: talent.role || '',
      bio: talent.bio || '',
      category: talent.category || '',
      skills: Array.isArray(talent.skills) ? talent.skills.join(', ') : (talent.skills || ''),
      experience: talent.experience || '',
      location: talent.location || '',
      availability: talent.availability || '',
      status: talent.status || 'pending',
      avatar_url: talent.avatar_url || '',
      links: {
        website: talent.links?.website || '',
        linkedin: talent.links?.linkedin || '',
        twitter: talent.links?.twitter || '',
        github: talent.links?.github || '',
        email: talent.links?.email || '',
      },
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!formData.name.trim() || !selectedTalent) return;

    setSubmitting(true);
    try {
      const talentData = {
        ...formData,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(s => s) : [],
      };

      await backendApi.talents.update(selectedTalent.id, talentData);
      await refetch();

      showToast({
        title: 'Talent Updated',
        description: 'Talent profile has been updated.',
        variant: 'success',
      });

      setShowEditModal(false);
      setSelectedTalent(null);
      resetForm();
    } catch (error) {
      showToast({
        title: 'Error',
        description: error.message || 'Failed to update talent.',
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (talentId, newStatus) => {
    try {
      await backendApi.talents.update(talentId, { status: newStatus });
      await refetch();

      showToast({
        title: 'Status Updated',
        description: `Talent status changed to ${newStatus}.`,
        variant: 'success',
      });
    } catch {
      showToast({
        title: 'Error',
        description: 'Failed to update talent status.',
        variant: 'error',
      });
    }
  };

  const handleDelete = async (talentId) => {
    if (window.confirm('Are you sure you want to delete this talent profile?')) {
      try {
        await backendApi.talents.delete(talentId);
        await refetch();

        showToast({
          title: 'Talent Deleted',
          description: 'Talent profile has been removed.',
          variant: 'success',
        });
      } catch {
        showToast({
          title: 'Error',
          description: 'Failed to delete talent profile.',
          variant: 'error',
        });
      }
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-700',
      published: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };

    return (
      <Badge className={variants[status] || 'bg-gray-100 text-gray-700'}>
        {status || 'unknown'}
      </Badge>
    );
  };

  const pendingTalents = filteredTalents.filter((t) => t.status === 'pending');
  const publishedTalents = filteredTalents.filter((t) => t.status === 'published');
  const rejectedTalents = filteredTalents.filter((t) => t.status === 'rejected');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Talent Hub Management</h1>
          <p className="text-[var(--color-muted)]">Review and manage talent profile submissions</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700">
          <FaPlus className="mr-2" />
          Add Talent
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Input
            placeholder="Search talents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="published">Published</option>
          <option value="rejected">Rejected</option>
        </Select>
        <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </Select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[var(--color-text)]">{filteredTalents.length}</div>
            <div className="text-sm text-[var(--color-muted)]">Total Talents</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{pendingTalents.length}</div>
            <div className="text-sm text-[var(--color-muted)]">Pending Approval</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{publishedTalents.length}</div>
            <div className="text-sm text-[var(--color-muted)]">Published</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{rejectedTalents.length}</div>
            <div className="text-sm text-[var(--color-muted)]">Rejected</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      {pendingTalents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals ({pendingTalents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTalents.map((talent) => (
                <div key={talent.id} className="p-4 border border-[var(--color-border)] rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-[var(--color-text)]">{talent.name}</h3>
                      <p className="text-sm text-[var(--color-muted)] mt-1">{talent.role}</p>
                      <p className="text-sm text-[var(--color-muted)]">{talent.category}</p>
                      <p className="text-sm text-[var(--color-muted)] mt-2">{talent.bio}</p>
                      {talent.links?.website && (
                        <p className="text-sm text-blue-600 mt-1">
                          <a href={talent.links.website} target="_blank" rel="noopener noreferrer">
                            Portfolio
                          </a>
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      {getStatusBadge(talent.status)}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(talent.id, 'published')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="subtle"
                          onClick={() => handleStatusChange(talent.id, 'rejected')}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="subtle"
                          onClick={() => handleEdit(talent)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          size="sm"
                          variant="subtle"
                          onClick={() => handleDelete(talent.id)}
                          className="bg-gray-600 hover:bg-gray-700 text-white"
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Published Talents */}
      <Card>
        <CardHeader>
          <CardTitle>Published Talents ({publishedTalents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-pulse">Loading talents...</div>
            </div>
          ) : publishedTalents.length > 0 ? (
            <div className="space-y-4">
              {publishedTalents.map((talent) => (
                <div key={talent.id} className="p-4 border border-[var(--color-border)] rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-[var(--color-text)]">{talent.name}</h3>
                      <p className="text-sm text-[var(--color-muted)] mt-1">{talent.role}</p>
                      <p className="text-sm text-[var(--color-muted)]">{talent.category}</p>
                      {talent.skills && (
                        <p className="text-sm text-[var(--color-muted)] mt-1">
                          Skills:{' '}
                          {Array.isArray(talent.skills) ? talent.skills.join(', ') : talent.skills}
                        </p>
                      )}
                      {talent.links?.website && (
                        <p className="text-sm text-blue-600 mt-1">
                          <a href={talent.links.website} target="_blank" rel="noopener noreferrer">
                            Portfolio
                          </a>
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      {getStatusBadge(talent.status)}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="subtle"
                          onClick={() => handleStatusChange(talent.id, 'pending')}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white"
                        >
                          Unpublish
                        </Button>
                        <Button
                          size="sm"
                          variant="subtle"
                          onClick={() => handleEdit(talent)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          size="sm"
                          variant="subtle"
                          onClick={() => handleDelete(talent.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[var(--color-muted)]">
              No published talents found.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rejected Talents */}
      {rejectedTalents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Rejected Talents ({rejectedTalents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rejectedTalents.map((talent) => (
                <div
                  key={talent.id}
                  className="p-4 border border-[var(--color-border)] rounded-lg opacity-75"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-[var(--color-text)]">{talent.name}</h3>
                      <p className="text-sm text-[var(--color-muted)] mt-1">{talent.role}</p>
                      <p className="text-sm text-[var(--color-muted)]">{talent.category}</p>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      {getStatusBadge(talent.status)}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(talent.id, 'published')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="subtle"
                          onClick={() => handleEdit(talent)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          size="sm"
                          variant="subtle"
                          onClick={() => handleDelete(talent.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Add New Talent">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="name"
              label="Name *"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter talent name"
            />
            <Input
              name="slug"
              label="Slug"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="Auto-generated from name"
              readOnly
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="role"
              label="Role/Title *"
              value={formData.role}
              onChange={handleInputChange}
              placeholder="e.g., Product Designer"
            />
            <Select
              name="category"
              label="Category *"
              value={formData.category}
              onChange={handleInputChange}
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Select>
          </div>

          <Textarea
            name="bio"
            label="Bio *"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Brief description of the talent"
            rows={3}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              name="skills"
              label="Skills"
              value={formData.skills}
              onChange={handleInputChange}
              placeholder="e.g., UI/UX Design, Figma, React (comma-separated)"
            />
            <Input
              name="experience"
              label="Experience"
              value={formData.experience}
              onChange={handleInputChange}
              placeholder="e.g., 5+ years"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              name="location"
              label="Location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Monrovia, Liberia"
            />
            <Input
              name="availability"
              label="Availability"
              value={formData.availability}
              onChange={handleInputChange}
              placeholder="e.g., Available for freelance"
            />
          </div>

          <Select
            name="status"
            label="Status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="pending">Pending</option>
            <option value="published">Published</option>
            <option value="rejected">Rejected</option>
          </Select>

          <Input
            name="avatar_url"
            label="Avatar URL"
            value={formData.avatar_url}
            onChange={handleInputChange}
            placeholder="Or upload image below"
          />

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Upload Avatar Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 border border-[var(--color-border)] rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Links
            </label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="links.website"
                label="Website"
                value={formData.links.website}
                onChange={handleInputChange}
                placeholder="https://example.com"
                icon={<FaGlobe />}
              />
              <Input
                name="links.linkedin"
                label="LinkedIn"
                value={formData.links.linkedin}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/username"
                icon={<FaLinkedin />}
              />
              <Input
                name="links.twitter"
                label="Twitter"
                value={formData.links.twitter}
                onChange={handleInputChange}
                placeholder="https://twitter.com/username"
                icon={<FaTwitter />}
              />
              <Input
                name="links.github"
                label="GitHub"
                value={formData.links.github}
                onChange={handleInputChange}
                placeholder="https://github.com/username"
                icon={<FaGithub />}
              />
              <Input
                name="links.email"
                label="Email"
                value={formData.links.email}
                onChange={handleInputChange}
                placeholder="email@example.com"
                icon={<FaEnvelope />}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleCreate}
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {submitting ? 'Creating...' : 'Create Talent'}
            </Button>
            <Button
              variant="subtle"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Talent">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="name"
              label="Name *"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter talent name"
            />
            <Input
              name="slug"
              label="Slug"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="Auto-generated from name"
              readOnly
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="role"
              label="Role/Title *"
              value={formData.role}
              onChange={handleInputChange}
              placeholder="e.g., Product Designer"
            />
            <Select
              name="category"
              label="Category *"
              value={formData.category}
              onChange={handleInputChange}
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Select>
          </div>

          <Textarea
            name="bio"
            label="Bio *"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Brief description of the talent"
            rows={3}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              name="skills"
              label="Skills"
              value={formData.skills}
              onChange={handleInputChange}
              placeholder="e.g., UI/UX Design, Figma, React (comma-separated)"
            />
            <Input
              name="experience"
              label="Experience"
              value={formData.experience}
              onChange={handleInputChange}
              placeholder="e.g., 5+ years"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              name="location"
              label="Location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Monrovia, Liberia"
            />
            <Input
              name="availability"
              label="Availability"
              value={formData.availability}
              onChange={handleInputChange}
              placeholder="e.g., Available for freelance"
            />
          </div>

          <Select
            name="status"
            label="Status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="pending">Pending</option>
            <option value="published">Published</option>
            <option value="rejected">Rejected</option>
          </Select>

          <Input
            name="avatar_url"
            label="Avatar URL"
            value={formData.avatar_url}
            onChange={handleInputChange}
            placeholder="Or upload image below"
          />

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Upload Avatar Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 border border-[var(--color-border)] rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Links
            </label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="links.website"
                label="Website"
                value={formData.links.website}
                onChange={handleInputChange}
                placeholder="https://example.com"
                icon={<FaGlobe />}
              />
              <Input
                name="links.linkedin"
                label="LinkedIn"
                value={formData.links.linkedin}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/username"
                icon={<FaLinkedin />}
              />
              <Input
                name="links.twitter"
                label="Twitter"
                value={formData.links.twitter}
                onChange={handleInputChange}
                placeholder="https://twitter.com/username"
                icon={<FaTwitter />}
              />
              <Input
                name="links.github"
                label="GitHub"
                value={formData.links.github}
                onChange={handleInputChange}
                placeholder="https://github.com/username"
                icon={<FaGithub />}
              />
              <Input
                name="links.email"
                label="Email"
                value={formData.links.email}
                onChange={handleInputChange}
                placeholder="email@example.com"
                icon={<FaEnvelope />}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleUpdate}
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {submitting ? 'Updating...' : 'Update Talent'}
            </Button>
            <Button
              variant="subtle"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminTalent;
