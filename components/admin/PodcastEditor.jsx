"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaSave,
  FaTimes,
  FaImage,
  FaTrash,
  FaMicrophone,
  FaPlay,
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
  createPodcast,
  updatePodcast,
} from "@/hooks/useBackendApi";
import { uploadFile } from "@/lib/upload";
import { podcastSubmissionSchema } from "@/lib/schemas/content";
import { cn } from "@/lib/cn";

export default function PodcastEditor({ initialData, mode = "create" }) {
  const router = useRouter();
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data || [];

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    audio_url: initialData?.audio_url || "",
    cover_image_url: initialData?.cover_image_url || "",
    category_id: initialData?.category_id || "",
    status: initialData?.status || "draft",
    tags: initialData?.tags || [],
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
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
    setUploadingImage(true);
    try {
      const result = await uploadFile(file, {
        type: "images",
        path: "podcasts",
      });
      setFormData((prev) => ({ ...prev, cover_image_url: result.url }));
    } catch (error) {
      alert("Image upload failed: " + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAudioUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAudio(true);
    try {
      const result = await uploadFile(file, {
        type: "audio",
        path: "episodes",
      });
      setFormData((prev) => ({ ...prev, audio_url: result.url }));
    } catch (error) {
      alert("Audio upload failed: " + error.message);
    } finally {
      setUploadingAudio(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const validatedData = podcastSubmissionSchema.parse(formData);
      if (mode === "create") {
        await createPodcast(validatedData);
      } else {
        await updatePodcast(initialData.id, validatedData);
      }
      router.push("/admin/podcasts");
    } catch (error) {
      if (error.name === "ZodError") {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        alert("Action failed: " + error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 pb-20 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-brand-500/10 text-brand-500">
            {mode === "create" ? "Recording" : "Retuning"}
          </span>
          <h2 className="text-4xl font-black italic tracking-tighter uppercase text-text">
            {mode === "create" ? "New" : "Edit"}{" "}
            <span className="text-brand-500">Podcast</span>
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
            disabled={submitting || uploadingAudio || uploadingImage}
            className="bg-brand-500 text-white font-black uppercase tracking-widest px-10 rounded-full shadow-xl"
          >
            {submitting ? "Syncing..." : "Save Episode"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <Card elevation="sm" className="border-border/50">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted">
                  Episode Title
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
                  Podcast Description
                </label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(val) =>
                    setFormData((p) => ({ ...p, description: val }))
                  }
                />
              </div>

              {/* Audio Upload Area */}
              <div className="space-y-4 pt-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted flex items-center gap-2">
                  <FaPlay className="w-2 h-2" /> Audio Resource
                </label>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center gap-4 transition-all",
                    formData.audio_url
                      ? "border-brand-500/50 bg-brand-500/5"
                      : "border-border/50 bg-muted/10",
                  )}
                >
                  {formData.audio_url ? (
                    <div className="w-full space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-widest text-brand-500">
                          Audio Ready
                        </span>
                        <button
                          onClick={() =>
                            setFormData((p) => ({ ...p, audio_url: "" }))
                          }
                          className="text-rose-500 hover:text-rose-600"
                        >
                          <FaTrash />
                        </button>
                      </div>
                      <audio
                        controls
                        src={formData.audio_url}
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="text-center space-y-3">
                      <FaMicrophone className="w-8 h-8 mx-auto text-muted/50" />
                      <p className="text-xs font-bold text-muted">
                        Drag & drop MP3/WAV or click to upload
                      </p>
                      <label className="inline-block px-6 py-2 bg-text text-surface rounded-full text-[10px] font-black uppercase tracking-widest cursor-pointer hover:scale-105 transition-transform">
                        {uploadingAudio ? "Uploading..." : "Select Audio File"}
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={handleAudioUpload}
                          className="hidden"
                          disabled={uploadingAudio}
                        />
                      </label>
                    </div>
                  )}
                </div>
                {errors.audio_url && (
                  <p className="text-[10px] text-rose-500 font-black uppercase">
                    {errors.audio_url}
                  </p>
                )}
                <Input
                  name="audio_url"
                  value={formData.audio_url}
                  onChange={handleInputChange}
                  placeholder="Or paste audio URL directly..."
                  className="text-[10px] font-bold h-8 border-0 italic bg-muted/5"
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
                  className="text-[10px] font-black uppercase rounded-xl"
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
                  <option value="">Choose Category</option>
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
                <FaImage className="w-2.5 h-2.5 inline mr-2" /> Cover Art
              </label>
              <div className="aspect-square rounded-2xl border-2 border-dashed border-border/50 bg-muted/10 relative group overflow-hidden">
                {formData.cover_image_url ? (
                  <img
                    src={formData.cover_image_url}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FaImage className="w-8 h-8 text-muted/30" />
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
        </aside>
      </div>
    </form>
  );
}
