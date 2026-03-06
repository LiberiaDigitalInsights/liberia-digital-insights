"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaSave,
  FaTimes,
  FaImage,
  FaTrash,
  FaCheckCircle,
  FaGlobe,
  FaEdit,
} from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import RichTextEditor from "@/components/ui/RichTextEditor";
import {
  useCategories,
  createArticle,
  updateArticle,
} from "@/hooks/useBackendApi";
import { uploadFile } from "@/lib/upload";
import { articleSubmissionSchema } from "@/lib/schemas/content";
import { cn } from "@/lib/cn";

export default function ArticleEditor({ initialData, mode = "create" }) {
  const router = useRouter();
  const { data: categoriesData, loading: categoriesLoading } = useCategories();
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

  // Auto-generate slug from title if in create mode or slug is empty
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
    // Clear error for this field
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
        path: "articles",
      });
      setFormData((prev) => ({ ...prev, cover_image_url: result.url }));
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Header image upload failed: " + error.message);
    } finally {
      setUploading(false);
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

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      // Validate with Zod
      const validatedData = articleSubmissionSchema.parse(formData);

      if (mode === "create") {
        await createArticle(validatedData);
      } else {
        await updateArticle(initialData.id, validatedData);
      }

      router.push("/admin/articles");
      router.refresh();
    } catch (error) {
      if (error.name === "ZodError") {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        console.error("Submission failed:", error);
        alert("Action failed: " + error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-brand-500/10 text-brand-500">
              {mode === "create" ? "Drafting" : "Editing"}
            </span>
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter uppercase text-text">
            {mode === "create" ? "New" : "Edit"}{" "}
            <span className="text-brand-500">Article</span>
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="rounded-full px-8 font-black uppercase tracking-widest text-xs"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting || uploading}
            className="bg-brand-500 hover:bg-brand-600 text-white font-black uppercase tracking-widest px-10 rounded-full shadow-xl shadow-brand-500/20"
          >
            {submitting ? (
              "Processing..."
            ) : (
              <span className="flex items-center gap-2">
                <FaSave className="w-3 h-3" />
                {mode === "create" ? "Publish Article" : "Save Changes"}
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-8">
          <Card elevation="sm" className="border-border/50 overflow-hidden">
            <CardContent className="p-0">
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted pl-1">
                    Article Title
                  </label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter a compelling headline..."
                    className={cn(
                      "text-2xl font-black italic tracking-tighter border-0 border-b-2 rounded-none px-1 focus:border-brand-500 bg-transparent transition-all",
                      errors.title && "border-rose-500",
                    )}
                  />
                  {errors.title && (
                    <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest mt-1">
                      {errors.title}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted pl-1">
                    Slug URL
                  </label>
                  <div className="flex items-center gap-2 group">
                    <span className="text-xs font-bold text-muted select-none">
                      /news/
                    </span>
                    <Input
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      className="text-xs font-bold bg-muted/20 border-0 rounded-lg group-focus-within:bg-muted/30 transition-all font-mono"
                    />
                  </div>
                  {errors.slug && (
                    <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest mt-1">
                      {errors.slug}
                    </p>
                  )}
                </div>

                <div className="space-y-2 pt-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted pl-1">
                    Short Excerpt
                  </label>
                  <Textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    placeholder="Summarize the article in a few sentences..."
                    className="bg-muted/10 border-border/50 rounded-2xl p-4 text-sm font-medium focus:border-brand-500 transition-all resize-none min-h-[100px]"
                  />
                  {errors.excerpt && (
                    <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest mt-1">
                      {errors.excerpt}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-8 bg-muted/5 border-t border-border/50">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted block mb-4">
                  Body Content
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) =>
                    setFormData((prev) => ({ ...prev, content }))
                  }
                />
                {errors.content && (
                  <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest mt-1">
                    {errors.content}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <aside className="space-y-6">
          {/* Status & Category */}
          <Card elevation="sm" className="border-border/50 bg-surface/50">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted">
                  <FaGlobe className="w-3 h-3" /> Publishing Status
                </label>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="rounded-xl border-border/50 font-black uppercase tracking-widest text-[10px] h-11 bg-surface"
                >
                  <option value="draft">Draft - Private</option>
                  <option value="published">Published - Live</option>
                  <option value="archived">Archived - Hidden</option>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted">
                  <span className="w-3 h-3 rounded-full border-2 border-muted" />{" "}
                  Category
                </label>
                <Select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className="rounded-xl border-border/50 font-bold text-xs h-11 bg-surface"
                >
                  <option value="">Select a Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
                {errors.category_id && (
                  <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest">
                    {errors.category_id}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cover Image */}
          <Card
            elevation="sm"
            className="border-border/50 bg-surface/50 overflow-hidden"
          >
            <CardContent className="p-0">
              <div className="p-6 border-b border-border/50">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted mb-4">
                  <FaImage className="w-3 h-3" /> Featured Image
                </label>

                <div
                  className={cn(
                    "relative aspect-video rounded-2xl border-2 border-dashed border-border/50 bg-muted/10 flex flex-col items-center justify-center transition-all group overflow-hidden",
                    formData.cover_image_url &&
                      "border-solid border-brand-500/50",
                  )}
                >
                  {formData.cover_image_url ? (
                    <>
                      <img
                        src={formData.cover_image_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <label className="p-3 bg-white text-brand-500 rounded-full cursor-pointer hover:scale-110 transition-transform">
                          <FaEdit className="w-4 h-4" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                        <button
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              cover_image_url: "",
                            }))
                          }
                          className="p-3 bg-white text-rose-500 rounded-full hover:scale-110 transition-transform"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className={cn(
                          "text-center space-y-2 p-4",
                          uploading && "animate-pulse",
                        )}
                      >
                        <div className="mx-auto w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <FaImage className="w-5 h-5 text-muted/50" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted">
                          {uploading ? "Uploading..." : "Click to Upload"}
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={uploading}
                      />
                    </>
                  )}
                </div>
              </div>
              <div className="p-4 bg-muted/5">
                <Input
                  name="cover_image_url"
                  value={formData.cover_image_url}
                  onChange={handleInputChange}
                  placeholder="Or paste image URL..."
                  className="text-[10px] font-bold h-8 bg-transparent border-0 italic"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card elevation="sm" className="border-border/50 bg-surface/50">
            <CardContent className="p-6 space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted block">
                Tags & Metadata
              </label>
              <div className="space-y-3">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Add tag and press Enter..."
                  className="rounded-xl border-border/50 text-xs font-bold bg-surface"
                />
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest shadow-md shadow-brand-500/20"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-rose-200 transition-colors"
                      >
                        <FaTimes className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                  {formData.tags.length === 0 && (
                    <p className="text-[10px] italic text-muted font-medium">
                      No tags added yet.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Persistence Feedback */}
      {submitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
          <div className="bg-surface p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in duration-300">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
            <p className="font-black uppercase tracking-widest text-xs italic text-brand-500">
              Syncing with Cloud...
            </p>
          </div>
        </div>
      )}
    </form>
  );
}
