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
  FaUser,
  FaTwitter,
  FaLinkedin,
  FaEnvelope,
  FaMapMarkerAlt,
  FaSpotify,
  FaPodcast,
  FaClock,
  FaHashtag,
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
import { useToast } from "@/context/ToastContext";

const SECTION_LABEL =
  "text-[10px] font-black uppercase tracking-widest text-muted flex items-center gap-2 mb-4";

export default function PodcastEditor({ initialData, mode = "create" }) {
  const router = useRouter();
  const { showToast } = useToast();
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
    guest: initialData?.guest || "",
    video_url: initialData?.video_url || "",
    // Episode metadata
    season_number: initialData?.season_number || "",
    episode_number: initialData?.episode_number || "",
    duration: initialData?.duration || "",
    spotify_url: initialData?.spotify_url || "",
    apple_url: initialData?.apple_url || "",
    // Rich guest profile
    guest_profile: {
      title: initialData?.guest_profile?.title || "",
      photo_url: initialData?.guest_profile?.photo_url || "",
      bio: initialData?.guest_profile?.bio || "",
      twitter: initialData?.guest_profile?.twitter || "",
      linkedin: initialData?.guest_profile?.linkedin || "",
      website: initialData?.guest_profile?.website || "",
      email: initialData?.guest_profile?.email || "",
      location: initialData?.guest_profile?.location || "",
      skills: initialData?.guest_profile?.skills || [],
    },
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [uploadingGuestPhoto, setUploadingGuestPhoto] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [skillInput, setSkillInput] = useState("");

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

  const handleGuestProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      guest_profile: { ...prev.guest_profile, [name]: value },
    }));
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
      showToast({
        title: "Cover Art Uploaded",
        description: "Saved to cloud.",
        variant: "success",
      });
    } catch (error) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, cover_image_url: reader.result }));
        showToast({
          title: "Storage Offline",
          description: "Used local fallback.",
          variant: "warning",
        });
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
      return;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleGuestPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingGuestPhoto(true);
    try {
      const result = await uploadFile(file, { type: "images", path: "guests" });
      setFormData((prev) => ({
        ...prev,
        guest_profile: { ...prev.guest_profile, photo_url: result.url },
      }));
      showToast({
        title: "Guest Photo Uploaded",
        description: "Profile picture saved.",
        variant: "success",
      });
    } catch (error) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          guest_profile: { ...prev.guest_profile, photo_url: reader.result },
        }));
        showToast({
          title: "Storage Offline",
          description: "Used local fallback.",
          variant: "warning",
        });
        setUploadingGuestPhoto(false);
      };
      reader.readAsDataURL(file);
      return;
    } finally {
      setUploadingGuestPhoto(false);
    }
  };

  const handleAudioUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
      showToast({
        title: "File Too Large",
        description: "Audio must be under 100MB.",
        variant: "warning",
      });
      return;
    }
    setUploadingAudio(true);
    try {
      const result = await uploadFile(file, {
        type: "audio",
        path: "episodes",
      });
      setFormData((prev) => ({ ...prev, audio_url: result.url }));
    } catch (error) {
      showToast({
        title: "Upload Failed",
        description: error.message,
        variant: "danger",
      });
    } finally {
      setUploadingAudio(false);
    }
  };

  const handleTagAdd = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase().replace(/^#/, "");
      if (!formData.tags.includes(newTag)) {
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const handleSkillAdd = (e) => {
    if ((e.key === "Enter" || e.key === ",") && skillInput.trim()) {
      e.preventDefault();
      const newSkill = skillInput.trim();
      const skills = formData.guest_profile.skills || [];
      if (!skills.includes(newSkill)) {
        setFormData((prev) => ({
          ...prev,
          guest_profile: {
            ...prev.guest_profile,
            skills: [...skills, newSkill],
          },
        }));
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      guest_profile: {
        ...prev.guest_profile,
        skills: prev.guest_profile.skills.filter((s) => s !== skill),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const payload = {
        ...formData,
        season_number: formData.season_number
          ? parseInt(formData.season_number)
          : null,
        episode_number: formData.episode_number
          ? parseInt(formData.episode_number)
          : null,
      };
      const validatedData = podcastSubmissionSchema.parse(payload);
      if (mode === "create") {
        await createPodcast(validatedData);
      } else {
        await updatePodcast(initialData.id, validatedData);
      }
      showToast({
        title: mode === "create" ? "Episode Created" : "Episode Updated",
        description: `Successfully ${mode === "create" ? "created" : "updated"} the podcast episode.`,
        variant: "success",
      });
      router.push("/admin/podcasts");
    } catch (error) {
      if (error.name === "ZodError") {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          fieldErrors[err.path.join(".")] = err.message;
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

  const guestInitial = formData.guest?.charAt(0)?.toUpperCase();

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
        {/* === LEFT MAIN COLUMN === */}
        <div className="xl:col-span-2 space-y-8">
          {/* Episode Core */}
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

              {/* Episode numbers + duration */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted flex items-center gap-1.5">
                    <FaHashtag className="w-2 h-2" /> Season
                  </label>
                  <Input
                    name="season_number"
                    type="number"
                    min="1"
                    value={formData.season_number}
                    onChange={handleInputChange}
                    placeholder="e.g. 1"
                    className="text-sm font-bold border-0 border-b-2 px-0 rounded-none focus:border-brand-500 bg-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted flex items-center gap-1.5">
                    <FaHashtag className="w-2 h-2" /> Episode
                  </label>
                  <Input
                    name="episode_number"
                    type="number"
                    min="1"
                    value={formData.episode_number}
                    onChange={handleInputChange}
                    placeholder="e.g. 5"
                    className="text-sm font-bold border-0 border-b-2 px-0 rounded-none focus:border-brand-500 bg-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted flex items-center gap-1.5">
                    <FaClock className="w-2 h-2" /> Duration
                  </label>
                  <Input
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g. 47:09"
                    className="text-sm font-bold border-0 border-b-2 px-0 rounded-none focus:border-brand-500 bg-transparent"
                  />
                </div>
              </div>

              {/* Video URL */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted flex items-center gap-1.5">
                  <FaPlay className="w-2 h-2" /> Video Resource URL
                </label>
                <Input
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleInputChange}
                  placeholder="YouTube, Facebook, or direct link..."
                  className="text-sm font-bold border-0 border-b-2 px-0 rounded-none focus:border-brand-500 bg-transparent"
                />
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

              {/* Audio Upload */}
              <div className="space-y-4 pt-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted flex items-center gap-2">
                  <FaMicrophone className="w-2 h-2" /> Audio Resource
                </label>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center gap-4 transition-all",
                    formData.audio_url
                      ? "border-brand-500/50 bg-brand-500/5"
                      : "border-border/50 bg-muted/10",
                  )}
                >
                  {formData.audio_url && (
                    <div className="w-full space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-widest text-brand-500">
                          Audio Preview
                        </span>
                        <button
                          type="button"
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
                  )}
                  <div className="text-center space-y-3">
                    {!formData.audio_url && (
                      <FaMicrophone className="w-8 h-8 mx-auto text-muted/50" />
                    )}
                    <p className="text-xs font-bold text-muted">
                      {formData.audio_url
                        ? "Replace existing audio:"
                        : "Drag & drop MP3/WAV or click to upload"}
                    </p>
                    <label className="inline-block px-6 py-2 bg-text text-surface rounded-full text-[10px] font-black uppercase tracking-widest cursor-pointer hover:scale-105 transition-transform">
                      {uploadingAudio
                        ? "Uploading..."
                        : formData.audio_url
                          ? "Upload New Audio"
                          : "Select Audio File"}
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioUpload}
                        className="hidden"
                        disabled={uploadingAudio}
                      />
                    </label>
                  </div>
                </div>
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

          {/* === GUEST SPEAKER SECTION === */}
          <Card elevation="sm" className="border-brand-500/20">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-brand-500/10 flex items-center justify-center">
                  <FaUser className="text-brand-500 text-sm" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-500">
                    Guest Speaker
                  </p>
                  <p className="text-[9px] text-muted font-medium">
                    Profile information displayed to audience
                  </p>
                </div>
              </div>

              {/* Name + Title row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted">
                    Guest Name
                  </label>
                  <Input
                    name="guest"
                    value={formData.guest}
                    onChange={handleInputChange}
                    placeholder="e.g. Mark Zuckerberg"
                    className="text-sm font-bold border-0 border-b-2 px-0 rounded-none focus:border-brand-500 bg-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted">
                    Title / Role
                  </label>
                  <Input
                    name="title"
                    value={formData.guest_profile.title}
                    onChange={handleGuestProfileChange}
                    placeholder="e.g. CEO, Meta"
                    className="text-sm font-bold border-0 border-b-2 px-0 rounded-none focus:border-brand-500 bg-transparent"
                  />
                </div>
              </div>

              {/* Photo upload + preview */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted">
                  Profile Photo
                </label>
                <div className="flex items-start gap-6">
                  <div className="relative w-24 h-24 rounded-3xl overflow-hidden border-2 border-dashed border-border/50 bg-muted/10 shrink-0 group cursor-pointer">
                    {formData.guest_profile.photo_url ? (
                      <img
                        src={formData.guest_profile.photo_url}
                        alt="Guest"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl font-black italic text-brand-500">
                        {guestInitial || <FaUser className="text-muted/30" />}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <FaImage className="text-white text-lg" />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleGuestPhotoUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={uploadingGuestPhoto}
                    />
                  </div>
                  <div className="flex-1 space-y-3 pt-1">
                    <p className="text-[10px] text-muted font-medium leading-relaxed">
                      Upload a professional headshot or portrait. Supported:
                      JPG, PNG, WebP.
                    </p>
                    {uploadingGuestPhoto && (
                      <p className="text-[10px] text-brand-500 font-black uppercase animate-pulse">
                        Uploading...
                      </p>
                    )}
                    <Input
                      name="photo_url"
                      value={formData.guest_profile.photo_url}
                      onChange={handleGuestProfileChange}
                      placeholder="Or paste image URL..."
                      className="text-[10px] font-bold h-8 border-0 italic bg-muted/5"
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted">
                  Short Bio
                </label>
                <Textarea
                  name="bio"
                  value={formData.guest_profile.bio}
                  onChange={handleGuestProfileChange}
                  placeholder="Brief background about the guest speaker..."
                  rows={3}
                  className="text-sm font-medium resize-none bg-muted/5 border-border/30 rounded-2xl"
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted flex items-center gap-1.5">
                  <FaMapMarkerAlt className="w-2 h-2" /> Location
                </label>
                <Input
                  name="location"
                  value={formData.guest_profile.location}
                  onChange={handleGuestProfileChange}
                  placeholder="e.g. Monrovia, Liberia"
                  className="text-sm font-bold border-0 border-b-2 px-0 rounded-none focus:border-brand-500 bg-transparent"
                />
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted">
                  Social & Contact Links
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      name: "twitter",
                      icon: <FaTwitter />,
                      placeholder: "https://x.com/username",
                    },
                    {
                      name: "linkedin",
                      icon: <FaLinkedin />,
                      placeholder: "https://linkedin.com/in/...",
                    },
                    {
                      name: "website",
                      icon: <FaGlobe />,
                      placeholder: "https://example.com",
                    },
                    {
                      name: "email",
                      icon: <FaEnvelope />,
                      placeholder: "guest@example.com",
                    },
                  ].map(({ name, icon, placeholder }) => (
                    <div
                      key={name}
                      className="flex items-center gap-3 border-b border-border/30 pb-2"
                    >
                      <span className="text-muted text-sm shrink-0">
                        {icon}
                      </span>
                      <input
                        type={name === "email" ? "email" : "url"}
                        name={name}
                        value={formData.guest_profile[name]}
                        onChange={handleGuestProfileChange}
                        placeholder={placeholder}
                        className="flex-1 bg-transparent text-xs font-medium text-text placeholder:text-muted/40 focus:outline-none focus:text-brand-500 transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Expertise / Skills */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted">
                  Areas of Expertise
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(formData.guest_profile.skills || []).map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-brand-500/10 text-brand-500 text-[10px] font-black uppercase tracking-tighter rounded-lg flex items-center gap-1.5 group/skill"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="opacity-0 group-hover/skill:opacity-100 hover:text-rose-500 transition-opacity"
                      >
                        <FaTimes className="w-2 h-2" />
                      </button>
                    </span>
                  ))}
                  {(!formData.guest_profile.skills ||
                    formData.guest_profile.skills.length === 0) && (
                    <span className="text-[10px] text-muted italic">
                      No skills added
                    </span>
                  )}
                </div>
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillAdd}
                  placeholder="Add expertise (press Enter)... e.g. AI, Tech Policy"
                  className="text-[10px] font-bold rounded-xl"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* === RIGHT SIDEBAR === */}
        <aside className="space-y-6">
          {/* Visibility / Category / Tags */}
          <Card elevation="sm" className="bg-surface/50">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <label className={SECTION_LABEL}>
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
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-brand-500/10 text-brand-500 text-[10px] font-black uppercase tracking-tighter rounded-lg flex items-center gap-1 group/tag"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="opacity-0 group-hover/tag:opacity-100 transition-opacity hover:text-rose-500"
                      >
                        <FaTimes className="w-2 h-2" />
                      </button>
                    </span>
                  ))}
                  {formData.tags?.length === 0 && (
                    <span className="text-[10px] text-muted italic font-medium">
                      No tags added
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagAdd}
                    placeholder="Add tags (press Enter)..."
                    className="text-[10px] font-bold rounded-xl pr-10"
                  />
                  {tagInput.trim() && (
                    <button
                      type="button"
                      onClick={() =>
                        handleTagAdd({ key: "Enter", preventDefault: () => {} })
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-500 text-[10px] font-black uppercase"
                    >
                      Add
                    </button>
                  )}
                </div>
                <p className="text-[9px] text-muted font-medium italic mt-1 leading-tight">
                  Use{" "}
                  <span className="text-brand-500 font-bold">
                    #insighttechthursday
                  </span>{" "}
                  for featured column.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Distribution Links */}
          <Card elevation="sm" className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <label className={SECTION_LABEL}>
                <FaPodcast className="w-2.5 h-2.5" /> Distribution Links
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-3 border-b border-border/30 pb-2">
                  <FaSpotify className="text-[#1DB954] text-sm shrink-0" />
                  <input
                    type="url"
                    name="spotify_url"
                    value={formData.spotify_url}
                    onChange={handleInputChange}
                    placeholder="Spotify episode URL..."
                    className="flex-1 bg-transparent text-xs font-medium text-text placeholder:text-muted/40 focus:outline-none focus:text-brand-500 transition-colors"
                  />
                </div>
                <div className="flex items-center gap-3 border-b border-border/30 pb-2">
                  <FaPodcast className="text-[#9B5DE5] text-sm shrink-0" />
                  <input
                    type="url"
                    name="apple_url"
                    value={formData.apple_url}
                    onChange={handleInputChange}
                    placeholder="Apple Podcasts episode URL..."
                    className="flex-1 bg-transparent text-xs font-medium text-text placeholder:text-muted/40 focus:outline-none focus:text-brand-500 transition-colors"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cover Art */}
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
                    alt="Cover"
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
              <div className="mt-4 pt-4 border-t border-border/10">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted mb-2 block">
                  Or External Image URL
                </label>
                <Input
                  name="cover_image_url"
                  value={formData.cover_image_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="text-[10px] font-bold h-8 border-0 bg-muted/10 rounded-lg px-3 focus:bg-muted/20"
                />
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </form>
  );
}
