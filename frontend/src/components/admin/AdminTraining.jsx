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
  FaGraduationCap,
  FaUsers,
  FaClock,
  FaBook,
} from 'react-icons/fa';
import { useTraining } from '../../hooks/useBackendApi';
import { backendApi } from '../../services/backendApi';
import { useToast } from '../../context/ToastContext';

const MediaPreview = ({ url, type }) => {
  if (!url) return null;

  if (type === 'image') {
    return (
      <div className="mt-2">
        <img src={url} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
      </div>
    );
  }

  if (type === 'video') {
    return (
      <div className="mt-2">
        <video src={url} controls className="w-full h-40 object-cover rounded-lg" />
      </div>
    );
  }

  return null;
};

const AdminTraining = ({ canEdit }) => {
  const { showToast } = useToast();
  const { data: trainingData, refetch } = useTraining({});
  const courses = trainingData?.training || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const itemsPerPage = 10;

  // Form state for create/edit
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'course',
    duration: '',
    instructor: '',
    maxStudents: '',
    startDate: '',
    endDate: '',
    status: 'upcoming',
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

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
    const matchesType = filterType === 'all' || course.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + itemsPerPage);

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

      const newCourse = {
        title: formData.title,
        slug,
        description: formData.description,
        type: formData.type,
        duration: formData.duration,
        instructor: formData.instructor,
        max_students: parseInt(formData.maxStudents) || 0,
        start_date: formData.startDate,
        end_date: formData.endDate,
        status: formData.status,
        cover_image_url: formData.coverImage || null,
      };

      console.log('Creating course:', newCourse);
      await backendApi.training.create(newCourse);
      await refetch();

      showToast({
        title: 'Course Created',
        description: 'Training course has been created successfully.',
        variant: 'success',
      });

      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Create error:', error);
      showToast({
        title: 'Error',
        description: `Failed to create training course: ${error.message}`,
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      description: course.description || '',
      type: course.type,
      duration: course.duration || '',
      instructor: course.instructor || '',
      maxStudents: course.maxStudents?.toString() || '',
      startDate: course.startDate || '',
      endDate: course.endDate || '',
      status: course.status,
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!formData.title.trim() || !selectedCourse) return;

    setSubmitting(true);
    try {
      // Generate slug from title for consistency
      const slug = formData.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      const updatedCourse = {
        title: formData.title,
        slug,
        description: formData.description,
        type: formData.type,
        duration: formData.duration,
        instructor: formData.instructor,
        max_students: parseInt(formData.maxStudents) || 0,
        start_date: formData.startDate,
        end_date: formData.endDate,
        status: formData.status,
        cover_image_url: formData.coverImage || null,
      };

      console.log('Updating course:', selectedCourse.id, updatedCourse);
      await backendApi.training.update(selectedCourse.id, updatedCourse);
      await refetch();

      showToast({
        title: 'Course Updated',
        description: 'Training course has been updated successfully.',
        variant: 'success',
      });

      setShowEditModal(false);
      resetForm();
      setSelectedCourse(null);
    } catch (error) {
      console.error('Update error:', error);
      showToast({
        title: 'Error',
        description: `Failed to update training course: ${error.message}`,
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (course) => {
    setSelectedCourse(course);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedCourse) return;

    setSubmitting(true);
    try {
      await backendApi.training.delete(selectedCourse.id);
      await refetch();

      showToast({
        title: 'Course Deleted',
        description: 'Training course has been deleted successfully.',
        variant: 'success',
      });

      setShowDeleteModal(false);
      setSelectedCourse(null);
    } catch {
      showToast({
        title: 'Error',
        description: 'Failed to delete training course.',
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
      type: 'course',
      duration: '',
      instructor: '',
      maxStudents: '',
      startDate: '',
      endDate: '',
      status: 'upcoming',
    });
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      active: 'bg-green-100 text-green-700',
      upcoming: 'bg-blue-100 text-blue-700',
      completed: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700',
      draft: 'bg-yellow-100 text-yellow-700',
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
      Training: 'bg-purple-100 text-purple-700',
      Course: 'bg-blue-100 text-blue-700',
      Workshop: 'bg-green-100 text-green-700',
      Seminar: 'bg-orange-100 text-orange-700',
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
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Training & Courses</h1>
        <p className="text-[var(--color-muted)]">Manage educational programs and courses</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-muted)]" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full lg:w-48"
        >
          <option value="all">All Types</option>
          <option value="Training">Training</option>
          <option value="Course">Course</option>
          <option value="Workshop">Workshop</option>
          <option value="Seminar">Seminar</option>
        </Select>
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full lg:w-48"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="draft">Draft</option>
        </Select>
        {canEdit && (
          <Button onClick={() => setShowCreateModal(true)} className="w-full lg:w-auto">
            <FaPlus className="mr-2" />
            New Course
          </Button>
        )}
      </div>

      {/* Courses Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-muted)]">
                    Course
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-muted)]">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-muted)]">
                    Instructor
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-muted)]">
                    Duration
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-muted)]">
                    Students
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
                {paginatedCourses.map((course) => (
                  <tr
                    key={course.id}
                    className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface)]"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-[var(--color-text)]">{course.title}</p>
                        <p className="text-sm text-[var(--color-muted)]">{course.description}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <TypeBadge type={course.type} />
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-[var(--color-text)]">
                        {course.instructor || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <FaClock className="w-3 h-3 text-[var(--color-muted)]" />
                        <span className="text-sm text-[var(--color-text)]">
                          {course.duration || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <FaUsers className="w-3 h-3 text-[var(--color-muted)]" />
                        <span className="text-sm text-[var(--color-text)]">
                          {course.students}/{course.maxStudents}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={course.status} />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCourse(course);
                            setShowDetailsModal(true);
                          }}
                          title="View Course Details"
                        >
                          <FaBook className="w-3 h-3" />
                        </Button>
                        {canEdit && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => handleEdit(course)}>
                              <FaEdit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(course)}
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
            {Math.min(startIndex + itemsPerPage, filteredCourses.length)} of{' '}
            {filteredCourses.length} courses
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
        title="Create New Course"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Course Title
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter course title"
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
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Type</label>
            <Select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="course">Course</option>
              <option value="training">Training</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Instructor
            </label>
            <Input
              value={formData.instructor}
              onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
              placeholder="Instructor name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Duration
            </label>
            <Input
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="e.g., 8 weeks, 2 days"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Max Students
            </label>
            <Input
              type="number"
              value={formData.maxStudents}
              onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
              placeholder="Maximum number of students"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                Start Date
              </label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                End Date
              </label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Description
            </label>
            <RichTextEditor
              value={formData.description}
              onChange={(content) => setFormData({ ...formData, description: content })}
              placeholder="Course description"
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
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Course'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Course">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Course Title
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter course title"
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
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Type</label>
            <Select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="course">Course</option>
              <option value="training">Training</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Instructor
            </label>
            <Input
              value={formData.instructor}
              onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
              placeholder="Instructor name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Duration
            </label>
            <Input
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="e.g., 8 weeks, 2 days"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Max Students
            </label>
            <Input
              type="number"
              value={formData.maxStudents}
              onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
              placeholder="Maximum number of students"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                Start Date
              </label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                End Date
              </label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Description
            </label>
            <RichTextEditor
              value={formData.description}
              onChange={(content) => setFormData({ ...formData, description: content })}
              placeholder="Course description"
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
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={submitting}>
              {submitting ? 'Updating...' : 'Update Course'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Course Details Modal */}
      <Modal
        open={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Course Details"
      >
        <div className="space-y-4">
          {selectedCourse && (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
                    Title
                  </label>
                  <p className="text-[var(--color-text)] font-medium">{selectedCourse.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
                    Description
                  </label>
                  <p className="text-[var(--color-text)]">{selectedCourse.description || 'N/A'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
                      Type
                    </label>
                    <p className="text-[var(--color-text)]">{selectedCourse.type || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
                      Status
                    </label>
                    <div>{getStatusBadge(selectedCourse.status)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
                      Instructor
                    </label>
                    <p className="text-[var(--color-text)]">{selectedCourse.instructor || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
                      Duration
                    </label>
                    <p className="text-[var(--color-text)]">{selectedCourse.duration || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
                      Students
                    </label>
                    <p className="text-[var(--color-text)]">
                      {selectedCourse.students || 0} / {selectedCourse.maxStudents || 0}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
                      Start Date
                    </label>
                    <p className="text-[var(--color-text)]">{selectedCourse.startDate || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
                    Cover Image
                  </label>
                  <p className="text-[var(--color-text)] text-sm">
                    {selectedCourse.coverImage ? (
                      <a
                        href={selectedCourse.coverImage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {selectedCourse.coverImage}
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
                    {selectedCourse.content
                      ? `${selectedCourse.content.substring(0, 200)}${selectedCourse.content.length > 200 ? '...' : ''}`
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
      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Course">
        <div className="space-y-4">
          <p className="text-[var(--color-text)]">
            Are you sure you want to delete "{selectedCourse?.title}"? This action cannot be undone.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={submitting}>
              {submitting ? 'Deleting...' : 'Delete Course'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FaGraduationCap className="w-12 h-12 text-[var(--color-muted)] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[var(--color-text)] mb-2">No courses found</h3>
            <p className="text-[var(--color-muted)] mb-4">
              {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first course'}
            </p>
            {canEdit && !searchTerm && filterStatus === 'all' && filterType === 'all' && (
              <Button onClick={() => setShowCreateModal(true)}>
                <FaPlus className="mr-2" />
                Create Course
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminTraining;
