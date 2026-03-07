"use client";

import React, { useState, useCallback } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaBullhorn,
  FaEye,
  FaChartBar,
  FaLink,
  FaCalendarAlt,
} from "react-icons/fa";
import {
  useAdvertisements,
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
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

export default function AdminAdvertisements() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { data: adsData, loading, refetch } = useAdvertisements();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "banner",
    status: "active",
    image_url: "",
    target_url: "",
    start_date: "",
    end_date: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "banner",
      status: "active",
      image_url: "",
      target_url: "",
      start_date: "",
      end_date: "",
    });
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || item.name || "",
      description: item.description || "",
      type: item.type || "banner",
      status: item.status || "active",
      image_url: item.image_url || "",
      target_url: item.target_url || "",
      start_date: item.start_date ? item.start_date.split("T")[0] : "",
      end_date: item.end_date ? item.end_date.split("T")[0] : "",
    });
    setShowModal(true);
  };

  const handleDelete = async (item) => {
    if (
      !confirm(`Are you sure you want to delete "${item.title || item.name}"?`)
    )
      return;

    try {
      await deleteAdvertisement(item.id);
      showToast({
        title: "Ad Deleted",
        description: "Advertisement has been removed.",
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
      if (editingItem) {
        await updateAdvertisement(editingItem.id, formData);
        showToast({
          title: "Ad Updated",
          description: "Advertisement successfully updated.",
          variant: "success",
        });
      } else {
        await createAdvertisement(formData);
        showToast({
          title: "Ad Created",
          description: "New advertisement has been launched.",
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

  const ads = Array.isArray(adsData?.advertisements)
    ? adsData.advertisements
    : Array.isArray(adsData?.data)
      ? adsData.data
      : Array.isArray(adsData)
        ? adsData
        : [];

  const filteredAds = ads.filter((ad) => {
    const title = ad.title || ad.name || "";
    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || ad.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase text-text">
            Ad <span className="text-brand-500">Manager</span>
          </h2>
          <p className="text-muted font-bold text-sm tracking-tight">
            Manage your ad placements, banners, and performance tracking.
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="rounded-full px-8 py-6 uppercase font-black tracking-widest italic"
        >
          <FaPlus className="mr-2" /> Create Ad
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-surface p-4 rounded-2xl border border-border/50">
        <div className="relative md:col-span-2">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <Input
            placeholder="Search campaigns or clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 bg-background border-none shadow-inner"
          />
        </div>
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-background border-none"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="expired">Expired</option>
          <option value="draft">Draft</option>
        </Select>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Ads",
            value: ads.length,
            icon: FaBullhorn,
            color: "brand",
          },
          {
            label: "Active",
            value: ads.filter((a) => a.status === "active").length,
            icon: FaEye,
            color: "info",
          },
          {
            label: "Total Clicks",
            value: ads.reduce((acc, curr) => acc + (curr.clicks || 0), 0),
            icon: FaChartBar,
            color: "success",
          },
          {
            label: "Total CPC",
            value:
              "$" +
              (
                ads.reduce((acc, curr) => acc + (curr.clicks || 0), 0) * 0.45
              ).toFixed(2),
            icon: FaLink,
            color: "warning",
          },
        ].map((stat, i) => (
          <Card key={i} className="bg-surface border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center bg-muted/20",
                  `text-${stat.color}-500`,
                )}
              >
                <stat.icon />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted">
                  {stat.label}
                </p>
                <p className="text-xl font-black italic tracking-tighter text-text">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ad Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="aspect-video bg-muted animate-pulse rounded-2xl"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAds.map((ad) => (
            <Card
              key={ad.id}
              className={cn(
                "group relative border-none bg-surface transition-all duration-300",
                ad.status === "active"
                  ? "ring-1 ring-brand-500/20 shadow-lg shadow-brand-500/5"
                  : "opacity-75",
              )}
            >
              <div className="aspect-21/9 relative overflow-hidden bg-muted">
                {ad.image_url ? (
                  <img
                    src={ad.image_url}
                    alt={ad.title || ad.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted">
                    <FaBullhorn className="w-8 h-8 opacity-20" />
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge
                    variant="subtle"
                    className="uppercase font-black text-[10px] tracking-widest backdrop-blur-md bg-black/40 text-white border-none"
                  >
                    {ad.type}
                  </Badge>
                  <Badge
                    variant={
                      ad.status === "active"
                        ? "success"
                        : ad.status === "paused"
                          ? "warning"
                          : "danger"
                    }
                    className="uppercase font-black text-[10px] tracking-widest"
                  >
                    {ad.status}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-5">
                <h3 className="font-black italic uppercase tracking-tighter text-lg text-text line-clamp-1 group-hover:text-brand-500 transition-colors">
                  {ad.title || ad.name}
                </h3>
                <p className="text-xs text-muted font-medium line-clamp-2 mt-2 h-8">
                  {ad.description || "No description provided."}
                </p>

                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border/50">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted">
                      Clicks
                    </p>
                    <p className="font-black italic text-brand-500">
                      {ad.clicks || 0}
                    </p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted">
                      CTR
                    </p>
                    <p className="font-black italic text-text">
                      {ad.impressions > 0
                        ? ((ad.clicks / ad.impressions) * 100).toFixed(1) + "%"
                        : "0%"}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(ad)}
                    className="h-8 w-8 p-0 rounded-full hover:bg-brand-500/10"
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(ad)}
                    className="h-8 w-8 p-0 rounded-full hover:bg-rose-500/10"
                  >
                    <FaTrash />
                  </Button>
                  <a
                    href={ad.target_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 w-8 flex items-center justify-center rounded-full bg-muted/20 hover:bg-muted text-muted"
                  >
                    <FaLink className="w-3 h-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredAds.length === 0 && !loading && (
        <div className="p-20 text-center border-2 border-dashed border-border rounded-3xl">
          <p className="text-muted font-black italic uppercase tracking-widest">
            No active campaigns found.
          </p>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => !submitting && setShowModal(false)}
        title={editingItem ? "Edit Campaign" : "New Advertisement"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted mb-2 block">
                  Campaign Title
                </label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Summer Digital Summit"
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
                  placeholder="Campaign details..."
                  rows={4}
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
                    <option value="banner">Banner</option>
                    <option value="sidebar">Sidebar</option>
                    <option value="popup">Popup</option>
                    <option value="native">Native</option>
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
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="expired">Expired</option>
                    <option value="draft">Draft</option>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted mb-2 block">
                  Banner Image URL
                </label>
                <Input
                  required
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                  placeholder="HTTPS link to banner image..."
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted mb-2 block">
                  Target Link
                </label>
                <Input
                  required
                  value={formData.target_url}
                  onChange={(e) =>
                    setFormData({ ...formData, target_url: e.target.value })
                  }
                  placeholder="HTTPS destination link..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-muted mb-2 block">
                    Start Date (Optional)
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
                    End Date (Optional)
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
            </div>
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
                ? "Launching..."
                : editingItem
                  ? "Update Campaign"
                  : "Launch Campaign"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
