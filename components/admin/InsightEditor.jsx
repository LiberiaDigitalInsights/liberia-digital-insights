"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaSave,
  FaTimes,
  FaImage,
  FaTrash,
  FaLightbulb,
  FaGlobe,
} from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import RichTextEditor from "@/components/ui/RichTextEditor";
import {
  useCategories,
  createInsight,
  updateInsight,
} from "@/hooks/useBackendApi";
import { uploadFile } from "@/lib/upload";
import { insightSubmissionSchema } from "@/lib/schemas/content";
import { cn } from "@/lib/cn";
import { useToast } from "@/context/ToastContext";

export default function InsightEditor({ initialData, mode = "create" }) {
  const router = useRouter();
  const { showToast } = useToast();
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data || [];

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    category_id: initialData?.category_id || "",
    status: initialData?.status || "draft",
    cover_image_url: initialData?.cover_image_url || "",
    tags: initialData?.tags || [],
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if ((mode === "create" || !formData.slug) && formData.title) {
      const generatedSlug = formData.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title, mode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadFile(file, {
        type: "images",
        path: "insights",
      });
      setFormData((prev) => ({ ...prev, cover_image_url: result.url }));
      showToast({
        title: "Image Uploaded",
        description: "File saved to cloud storage.",
        variant: "success",
      });
    } catch (error) {
      console.warn("Cloud upload failed, falling back to Base64:", error);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, cover_image_url: reader.result }));
        showToast({
          title: "Storage Offline",
          description: "Used local fallback (Base64).",
          variant: "warning",
        });
        setUploading(false);
      };
      reader.readAsDataURL(file);
      return;
    } finally {
      if (!uploading) setUploading(false);
    }
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const validatedData = insightSubmissionSchema.parse(formData);
      if (mode === "create") {
        await createInsight(validatedData);
      } else {
        await updateInsight(initialData.id, validatedData);
      }
      showToast({
        title: mode === "create" ? "Insight Created" : "Insight Updated",
        description: `Successfully ${mode === "create" ? "created" : "updated"} the insight.`,
        variant: "success",
      });
      router.push("/admin/insights");
    } catch (error) {
      if (error.name === "ZodError") {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        showToast({
          title: mode === "create" ? "Creation Failed" : "Update Failed",
          description: error.message,
          variant: "danger",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 pb-20 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-brand-500/10 text-brand-500">
            {mode === "create" ? "Ideating" : "Refining"}
          </span>
          <h2 className="text-4xl font-black italic tracking-tighter uppercase text-text">
            {mode === "create" ? "New" : "Edit"}{" "}
            <span className="text-brand-500">Insight</span>
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="rounded-full px-8 font-black uppercase tracking-widest text-xs"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting || uploading}
            className="bg-brand-500 text-white font-black uppercase tracking-widest px-10 rounded-full shadow-xl"
          >
            {submitting ? "Syncing..." : "Save Insight"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <Card elevation="sm" className="border-border/50">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted">
                  Insight Title
                </label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="text-2xl font-black italic tracking-tighter border-0 border-b-2 px-0 rounded-none focus:border-brand-500 bg-transparent"
                />
                {errors.title && (
                  <p className="text-[10px] text-rose-500 font-black uppercase">
                    {errors.title}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted">
                  Excerpt
                </label>
                <Textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  className="rounded-2xl border-border/50 text-sm font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted">
                  Analysis Content
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(val) =>
                    setFormData((p) => ({ ...p, content: val }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card elevation="sm" className="bg-surface/50">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted flex items-center gap-2">
                  <FaGlobe className="w-2.5 h-2.5" /> Visibility
                </label>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="text-[10px] font-black uppercase tracking-widest rounded-xl"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted">
                  Category
                </label>
                <Select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className="text-xs font-bold rounded-xl"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card elevation="sm" className="overflow-hidden">
            <CardContent className="p-6">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted mb-4 block">
                <FaImage className="w-2.5 h-2.5 inline mr-2" /> Insight Header
              </label>
              <div className="aspect-video rounded-2xl border-2 border-dashed border-border/50 bg-muted/10 relative group overflow-hidden">
                {formData.cover_image_url ? (
                  <img
                    src={formData.cover_image_url}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FaLightbulb className="w-8 h-8 text-muted/30" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>

          <Card elevation="sm" className="bg-surface/50">
            <CardContent className="p-6 space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted block">
                Tags
              </label>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tag..."
                className="rounded-xl"
              />
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full bg-brand-500 text-white text-[10px] font-black uppercase flex items-center gap-2"
                  >
                    {t}{" "}
                    <button type="button" onClick={() => removeTag(t)}>
                      <FaTimes className="w-2 h-2" />
                    </button>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </form>
  );
}
