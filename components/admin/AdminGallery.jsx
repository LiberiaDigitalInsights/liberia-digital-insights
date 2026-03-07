"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaImage,
  FaVideo,
  FaStar,
} from "react-icons/fa";
import {
  useGallery,
  useGalleryCategories,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  useEvents,
  usePodcasts,
} from "@/hooks/useBackendApi";
import { useToast } from "@/context/ToastContext";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import Textarea from "@/components/ui/Textarea";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

export default function AdminGallery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { data: galleryData, loading, refetch } = useGallery();
  const { data: categories } = useGalleryCategories();
  const { data: eventsData } = useEvents();
  const { data: podcastsData } = usePodcasts();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "image",
    url: "",
    thumbnail_url: "",
    event_type: "",
    event_id: "",
    category: "",
    tags: "",
    featured: false,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "image",
      url: "",
      thumbnail_url: "",
      event_type: "",
      event_id: "",
      category: "",
      tags: "",
      featured: false,
    });
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || "",
      description: item.description || "",
      type: item.type || "image",
      url: item.url || "",
      thumbnail_url: item.thumbnail_url || "",
      event_type: item.event_type || "",
      event_id: item.event_id || "",
      category: item.category || "",
      tags: Array.isArray(item.tags) ? item.tags.join(", ") : "",
      featured: item.featured || false,
    });
    setShowModal(true);
  };

  const handleDelete = async (item) => {
    if (!confirm(`Are you sure you want to delete "${item.title}"?`)) return;

    try {
      await deleteGalleryItem(item.id);
      showToast({
        title: "Item Deleted",
        description: "Gallery item has been removed.",
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
        tags: formData.tags
          ? formData.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      };

      if (editingItem) {
        await updateGalleryItem(editingItem.id, payload);
        showToast({
          title: "Item Updated",
          description: "Gallery item has been updated.",
          variant: "success",
        });
      } else {
        await createGalleryItem(payload);
        showToast({
          title: "Item Created",
          description: "New item added to gallery.",
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

  const galleryItems = Array.isArray(galleryData?.data)
    ? galleryData.data
    : Array.isArray(galleryData?.items)
      ? galleryData.items
      : Array.isArray(galleryData)
        ? galleryData
        : [];

  const filteredItems = galleryItems.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const availableEvents =
    formData.event_type === "event"
      ? eventsData?.data || []
      : formData.event_type === "podcast"
        ? podcastsData?.data || []
        : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase text-text">
            Gallery <span className="text-brand-500">Management</span>
          </h2>
          <p className="text-muted font-bold text-sm tracking-tight">
            Manage your platform's visual and multi-media assets.
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="rounded-full px-8 py-6 uppercase font-black tracking-widest italic"
        >
          <FaPlus className="mr-2" /> Add Item
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-surface p-4 rounded-2xl border border-border/50">
        <div className="relative flex-1 w-full">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <Input
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 bg-background border-none shadow-inner"
          />
        </div>
        <Select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full md:w-48 bg-background border-none"
        >
          <option value="all">All Media</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
        </Select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="aspect-video bg-muted animate-pulse rounded-2xl"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="group overflow-hidden relative border-none bg-surface hover:ring-2 hover:ring-brand-500 transition-all duration-300"
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={item.thumbnail_url || item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="flex gap-2 w-full">
                    <Button
                      onClick={() => handleEdit(item)}
                      variant="secondary"
                      size="sm"
                      className="flex-1 bg-white/20 backdrop-blur-md border-none text-white hover:bg-white/40"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      onClick={() => handleDelete(item)}
                      variant="danger"
                      size="sm"
                      className="flex-1 bg-rose-500/80 backdrop-blur-md border-none text-white hover:bg-rose-600"
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </div>
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  <Badge
                    variant={item.type === "video" ? "danger" : "info"}
                    className="uppercase font-black text-[10px] tracking-widest backdrop-blur-md"
                  >
                    {item.type === "video" ? (
                      <FaVideo className="mr-1" />
                    ) : (
                      <FaImage className="mr-1" />
                    )}
                    {item.type}
                  </Badge>
                  {item.featured && (
                    <Badge
                      variant="warning"
                      className="uppercase font-black text-[10px] tracking-widest backdrop-blur-md"
                    >
                      <FaStar className="mr-1" /> Featured
                    </Badge>
                  )}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-black italic uppercase tracking-tighter text-text line-clamp-1 group-hover:text-brand-500 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-muted font-medium line-clamp-1 mt-1">
                  {item.category || "Uncategorized"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredItems.length === 0 && (
        <div className="p-20 text-center border-2 border-dashed border-border rounded-3xl">
          <p className="text-muted font-black italic uppercase tracking-widest">
            No gallery items found.
          </p>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => !submitting && setShowModal(false)}
        title={editingItem ? "Edit Asset" : "Add New Asset"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted mb-2 block">
                  Title
                </label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Asset title..."
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted mb-2 block">
                  Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Asset description..."
                  rows={4}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted mb-2 block">
                  Media Type
                </label>
                <Select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </Select>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted mb-2 block">
                  Media URL
                </label>
                <Input
                  required
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  placeholder="HTTPS link to media..."
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted mb-2 block">
                  Thumbnail URL (Optional)
                </label>
                <Input
                  value={formData.thumbnail_url}
                  onChange={(e) =>
                    setFormData({ ...formData, thumbnail_url: e.target.value })
                  }
                  placeholder="HTTPS link to thumbnail..."
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-muted mb-2 block">
                Link to Content Type
              </label>
              <Select
                value={formData.event_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    event_type: e.target.value,
                    event_id: "",
                  })
                }
              >
                <option value="">None</option>
                <option value="event">Event</option>
                <option value="podcast">Podcast</option>
              </Select>
            </div>

            {formData.event_type && (
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted mb-2 block">
                  Select {formData.event_type}
                </label>
                <Select
                  required
                  value={formData.event_id}
                  onChange={(e) =>
                    setFormData({ ...formData, event_id: e.target.value })
                  }
                >
                  <option value="">Choose one...</option>
                  {availableEvents.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title}
                    </option>
                  ))}
                </Select>
              </div>
            )}

            <div>
              <label className="text-xs font-black uppercase tracking-widest text-muted mb-2 block">
                Category
              </label>
              <Input
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="e.g. Workshop, Interview..."
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-muted mb-2 block">
              Tags (Comma separated)
            </label>
            <Input
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              placeholder="liberia, tech, digital..."
            />
          </div>

          <div className="flex items-center gap-3 bg-muted/20 p-4 rounded-2xl border border-border/50">
            <input
              type="checkbox"
              id="featured-check"
              checked={formData.featured}
              onChange={(e) =>
                setFormData({ ...formData, featured: e.target.checked })
              }
              className="w-5 h-5 accent-brand-500 rounded border-border"
            />
            <label
              htmlFor="featured-check"
              className="text-sm font-bold uppercase tracking-tight"
            >
              Feature this asset on the gallery page
            </label>
          </div>

          <div className="flex justify-end gap-4">
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
                ? "Saving..."
                : editingItem
                  ? "Update Asset"
                  : "Save Asset"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
