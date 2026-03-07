"use client";

import React, { useState, useCallback } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaGraduationCap,
  FaUsers,
  FaClock,
  FaBook,
  FaCalendarAlt,
} from "react-icons/fa";
import {
  useTraining,
  createTrainingCourse,
  updateTrainingCourse,
  deleteTrainingCourse,
} from "@/hooks/useBackendApi";
import { useToast } from "@/context/ToastContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import Textarea from "@/components/ui/Textarea";
import Badge from "@/components/ui/Badge";
import dynamic from "next/dynamic";

// Dynamically import RichTextEditor to avoid SSR issues
const RichTextEditor = dynamic(() => import("./RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-40 w-full animate-pulse bg-muted rounded-lg" />
  ),
});

export default function AdminTraining() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { data: trainingData, loading, refetch } = useTraining();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "course",
    duration: "",
    instructor: "",
    max_students: "",
    start_date: "",
    end_date: "",
    status: "upcoming",
    cover_image_url: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "course",
      duration: "",
      instructor: "",
      max_students: "",
      start_date: "",
      end_date: "",
      status: "upcoming",
      cover_image_url: "",
    });
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || "",
      description: item.description || "",
      type: item.type || "course",
      duration: item.duration || "",
      instructor: item.instructor || "",
      max_students: item.max_students?.toString() || "",
      start_date: item.start_date ? item.start_date.split("T")[0] : "",
      end_date: item.end_date ? item.end_date.split("T")[0] : "",
      status: item.status || "upcoming",
      cover_image_url: item.cover_image_url || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (item) => {
    if (!confirm(`Are you sure you want to delete "${item.title}"?`)) return;

    try {
      await deleteTrainingCourse(item.id);
      showToast({
        title: "Course Deleted",
        description: "Training program has been removed.",
        variant: "success",
      });
      refetch();
    } catch (error) {
      showToast({
        title: "Delete Failed",
        description: error.message,
        variant: "danger",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        max_students: parseInt(formData.max_students) || 0,
      };

      if (editingItem) {
        await updateTrainingCourse(editingItem.id, payload);
        showToast({
          title: "Course Updated",
          description: "Training program successfully updated.",
          variant: "success",
        });
      } else {
        await createTrainingCourse(payload);
        showToast({
          title: "Course Created",
          description: "New training program has been added.",
          variant: "success",
        });
      }

      setShowModal(false);
      resetForm();
      refetch();
    } catch (error) {
      showToast({
        title: "Action Failed",
        description: error.message,
        variant: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const courses = Array.isArray(trainingData?.training)
    ? trainingData.training
    : Array.isArray(trainingData?.data)
      ? trainingData.data
      : Array.isArray(trainingData)
        ? trainingData
        : [];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || course.type === filterType;
    const matchesStatus =
      filterStatus === "all" || course.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase text-text">
            Training <span className="text-brand-500">Hub</span>
          </h2>
          <p className="text-muted font-bold text-sm tracking-tight">
            Manage educational programs, workshops, and certifications.
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="rounded-full px-8 py-6 uppercase font-black tracking-widest italic"
        >
          <FaPlus className="mr-2" /> New Course
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-surface p-4 rounded-2xl border border-border/50">
        <div className="relative md:col-span-2">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <Input
            placeholder="Search programs or instructors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 bg-background border-none shadow-inner"
          />
        </div>
        <Select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-background border-none"
        >
          <option value="all">All Types</option>
          <option value="course">Course</option>
          <option value="workshop">Workshop</option>
          <option value="seminar">Seminar</option>
          <option value="training">General Training</option>
        </Select>
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-background border-none"
        >
          <option value="all">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="draft">Draft</option>
        </Select>
      </div>

      {/* Course List */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-muted animate-pulse rounded-2xl"
              />
            ))}
          </>
        ) : filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="group hover:border-brand-500/50 transition-all duration-300 bg-surface border-border/50"
            >
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-48 h-48 md:h-auto bg-muted relative overflow-hidden">
                    {course.cover_image_url ? (
                      <img
                        src={course.cover_image_url}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted">
                        <FaGraduationCap className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <Badge
                        variant="subtle"
                        className="uppercase font-black text-[10px] tracking-widest backdrop-blur-md bg-white/20"
                      >
                        {course.type}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-black italic uppercase tracking-tighter text-text group-hover:text-brand-500 transition-colors">
                          {course.title}
                        </h3>
                        <Badge
                          variant={
                            course.status === "active"
                              ? "success"
                              : course.status === "upcoming"
                                ? "info"
                                : course.status === "completed"
                                  ? "secondary"
                                  : "warning"
                          }
                          className="uppercase font-black text-[10px] tracking-widest"
                        >
                          {course.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 mt-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase">
                          <FaUsers className="text-brand-500" />
                          <span>{course.instructor || "No Instructor"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase">
                          <FaClock className="text-brand-500" />
                          <span>{course.duration || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase">
                          <FaCalendarAlt className="text-brand-500" />
                          <span>
                            {course.start_date
                              ? new Date(course.start_date).toLocaleDateString()
                              : "TBD"}
                          </span>
                        </div>
                      </div>
                      <div
                        className="mt-4 prose prose-sm max-w-none text-muted line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: course.description }}
                      />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(course)}
                        className="hover:bg-brand-500/10 hover:text-brand-500"
                      >
                        <FaEdit className="mr-2" /> Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(course)}
                        className="hover:bg-rose-500/10 hover:text-rose-500"
                      >
                        <FaTrash className="mr-2" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="p-20 text-center border-2 border-dashed border-border rounded-3xl">
            <p className="text-muted font-black italic uppercase tracking-widest">
              No training programs found.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => !submitting && setShowModal(false)}
        title={editingItem ? "Edit Training Program" : "Create New Program"}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted mb-2 block">
                  Program Title
                </label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Advanced Digital Journalism"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-muted mb-2 block">
                    Type
                  </label>
                  <Select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  >
                    <option value="course">Course</option>
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                    <option value="training">Training</option>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-muted mb-2 block">
                    Status
                  </label>
                  <Select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="draft">Draft</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-muted mb-2 block">
                    Instructor
                  </label>
                  <Input
                    value={formData.instructor}
                    onChange={(e) =>
                      setFormData({ ...formData, instructor: e.target.value })
                    }
                    placeholder="Instructor name"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-muted mb-2 block">
                    Max Students
                  </label>
                  <Input
                    type="number"
                    value={formData.max_students}
                    onChange={(e) =>
                      setFormData({ ...formData, max_students: e.target.value })
                    }
                    placeholder="e.g. 50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-muted mb-2 block">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-muted mb-2 block">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted mb-2 block">
                  Duration
                </label>
                <Input
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  placeholder="e.g. 6 Weeks, 3 Days"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted mb-2 block">
                  Cover Image URL
                </label>
                <Input
                  value={formData.cover_image_url}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cover_image_url: e.target.value,
                    })
                  }
                  placeholder="HTTPS link to image..."
                />
              </div>

              <div className="h-full flex flex-col">
                <label className="text-xs font-black uppercase tracking-widest text-muted mb-2 block">
                  Full Description
                </label>
                <div className="flex-1 min-h-[300px] border border-border rounded-lg overflow-hidden flex flex-col">
                  <RichTextEditor
                    value={formData.description}
                    onChange={(content) =>
                      setFormData({ ...formData, description: content })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowModal(false)}
              disabled={submitting}
              className="rounded-full px-8"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="rounded-full px-12 italic font-black uppercase tracking-widest shadow-lg shadow-brand-500/20"
            >
              {submitting
                ? "Processing..."
                : editingItem
                  ? "Update Program"
                  : "Launch Program"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
