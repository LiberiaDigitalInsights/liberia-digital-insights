"use client";

import React, { useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaCheck,
  FaTimes,
  FaUser,
  FaGlobe,
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaEnvelope,
} from "react-icons/fa";
import ContentManager from "./ContentManager";
import {
  useTalents,
  createTalent,
  updateTalent,
  deleteTalent,
} from "@/hooks/useBackendApi";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import { uploadFile } from "@/lib/upload";
import { talentSubmissionSchema } from "@/lib/schemas/content";
import { cn } from "@/lib/cn";

export default function AdminTalent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    role: "",
    bio: "",
    category: "",
    skills: [],
    experience: "",
    location: "",
    availability: "",
    status: "pending",
    avatar_url: "",
    links: {
      website: "",
      linkedin: "",
      twitter: "",
      github: "",
      email: "",
    },
  });

  const {
    data: talentsData,
    loading,
    refetch,
  } = useTalents({
    search: searchTerm,
    status: filterStatus !== "all" ? filterStatus : undefined,
    page,
    limit: 10,
  });

  const talents = talentsData?.talents || [];
  const pagination = {
    current: page,
    total: talentsData?.pagination?.pages || 1,
    onPageChange: (p) => setPage(p),
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("links.")) {
      const linkKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        links: { ...prev.links, [linkKey]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (name === "name") {
        setFormData((prev) => ({
          ...prev,
          slug: value
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, ""),
        }));
      }
    }
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, skills }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadFile(file, {
        type: "images",
        path: "talents",
      });
      setFormData((prev) => ({ ...prev, avatar_url: result.url }));
    } catch (error) {
      alert("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAddClick = () => {
    setSelectedTalent(null);
    setFormData({
      name: "",
      slug: "",
      role: "",
      bio: "",
      category: "",
      skills: [],
      experience: "",
      location: "",
      availability: "",
      status: "pending",
      avatar_url: "",
      links: { website: "", linkedin: "", twitter: "", github: "", email: "" },
    });
    setShowEditorModal(true);
  };

  const handleEditClick = (talent) => {
    setSelectedTalent(talent);
    setFormData({
      ...talent,
      links: talent.links || {
        website: "",
        linkedin: "",
        twitter: "",
        github: "",
        email: "",
      },
    });
    setShowEditorModal(true);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateTalent(id, { status: newStatus });
      refetch();
    } catch (error) {
      alert("Failed to update status: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const validated = talentSubmissionSchema.parse(formData);
      if (selectedTalent) {
        await updateTalent(selectedTalent.id, validated);
      } else {
        await createTalent(validated);
      }
      setShowEditorModal(false);
      refetch();
    } catch (error) {
      alert("Submission failed: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      key: "talent",
      label: "Talent Profile",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-border">
            {item.avatar_url ? (
              <img
                src={item.avatar_url}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                <FaUser />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black italic">{item.name}</span>
            <span className="text-[10px] uppercase font-bold text-muted">
              {item.role}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (item) => (
        <Badge variant="outline" className="text-[10px] font-black uppercase">
          {item.category}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <Badge
          variant={
            item.status === "published"
              ? "success"
              : item.status === "pending"
                ? "warning"
                : "danger"
          }
        >
          {item.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (item) => (
        <div className="flex items-center justify-end gap-2">
          {item.status === "pending" && (
            <button
              onClick={() => handleStatusChange(item.id, "published")}
              className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg"
            >
              <FaCheck />
            </button>
          )}
          <button
            onClick={() => handleEditClick(item)}
            className="p-2 text-brand-500 hover:bg-brand-50 rounded-lg"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => {
              setSelectedTalent(item);
              setShowDeleteModal(true);
            }}
            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <ContentManager
        title="Talent Management"
        subtitle="Review applications and manage the talent directory."
        items={talents}
        loading={loading}
        columns={columns}
        onAdd={handleAddClick}
        onSearch={setSearchTerm}
        onFilterStatus={setFilterStatus}
        filterStatus={filterStatus}
        searchTerm={searchTerm}
        pagination={pagination}
      />

      <Modal
        open={showEditorModal}
        onClose={() => setShowEditorModal(false)}
        title={selectedTalent ? "Edit Talent" : "Add Talent"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <Input
              name="role"
              label="Professional Role"
              value={formData.role}
              onChange={handleInputChange}
              required
            />
          </div>
          <Textarea
            name="bio"
            label="Biography"
            value={formData.bio}
            onChange={handleInputChange}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              name="category"
              label="Category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Design">Design</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Marketing">Marketing</option>
            </Select>
            <Input
              name="skills"
              label="Skills (comma-separated)"
              value={
                Array.isArray(formData.skills) ? formData.skills.join(", ") : ""
              }
              onChange={handleSkillsChange}
            />
          </div>
          <div className="flex justify-end gap-2 p-4 border-t">
            <Button variant="outline" onClick={() => setShowEditorModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Talent Profile"
        size="sm"
      >
        <div className="py-4 text-center">
          <p>
            Delete profile for <strong>{selectedTalent?.name}</strong>?
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              className="bg-rose-500 text-white"
              onClick={async () => {
                await deleteTalent(selectedTalent.id);
                refetch();
                setShowDeleteModal(false);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
