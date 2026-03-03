"use client";

import React from "react";
import { H1, Muted } from "@/components/ui/Typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { Field, Label, HelperText, ErrorText } from "@/components/ui/Form";
import EmptyState from "@/components/ui/EmptyState";
import TalentCard from "@/components/talent/TalentCard";
import { useTalents } from "@/hooks/useBackendApi";
import { useToast } from "@/context/ToastContext";
import { FaUserPlus, FaFilter, FaSync, FaRocket } from "react-icons/fa";
import { MotionGrid, MotionItem } from "@/components/ui/MotionWrapper";

export default function TalentPage() {
  const [filter, setFilter] = React.useState("All");
  const [page, setPage] = React.useState(1);
  const { showToast } = useToast();

  const {
    data: talentsData,
    loading,
    error,
    refetch,
  } = useTalents({
    status: "published",
    category: filter === "All" ? undefined : filter,
    page: Number(page),
  });

  const talents = talentsData?.talents || [];
  const pagination = talentsData?.pagination || { pages: 1 };

  const [form, setForm] = React.useState({
    name: "",
    role: "",
    category: "",
    bio: "",
    link: "",
  });
  const [errors, setErrors] = React.useState({});
  const [submitting, setSubmitting] = React.useState(false);

  const categories = [
    "All",
    "Design",
    "Engineering",
    "Product",
    "Marketing",
    "Management",
  ];

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Required";
    if (!form.role.trim()) newErrors.role = "Required";
    if (!form.category) newErrors.category = "Required";
    if (form.bio.length < 10) newErrors.bio = "Min 10 chars";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitting(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise((r) => setTimeout(r, 1000));
      showToast({
        title: "Success!",
        description: "Profile submitted for review.",
        variant: "success",
      });
      setForm({ name: "", role: "", category: "", bio: "", link: "" });
    } catch {
      showToast({
        title: "Error",
        description: "Failed to submit profile.",
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_350px]">
        {/* Main Content */}
        <div className="space-y-10">
          <header>
            <H1 className="mb-4 text-4xl md:text-5xl font-black tracking-tight">
              Talent Hub
            </H1>
            <Muted className="text-lg max-w-2xl">
              The premier destination to discover and connect with Liberia's
              most talented technology professionals.
            </Muted>
          </header>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-surface p-4 rounded-xl border border-border/50 shadow-sm">
            <div className="flex items-center gap-3">
              <FaFilter className="text-brand-500 text-sm" />
              <span className="text-sm font-bold uppercase tracking-widest text-muted">
                Category
              </span>
              <Select
                id="category-filter"
                value={filter}
                onChange={handleFilterChange}
                className="w-48 bg-transparent border-none font-bold text-text"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Select>
            </div>

            <Button
              size="sm"
              variant="secondary"
              onClick={() => refetch()}
              disabled={loading}
              className="gap-2"
            >
              <FaSync className={loading ? "animate-spin" : ""} /> Refresh
            </Button>
          </div>

          {/* List */}
          <div className="space-y-6">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-40 bg-surface rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="p-8 text-center bg-red-500/5 text-red-500 rounded-xl border border-red-500/20 font-bold">
                {error}
              </div>
            ) : talents.length > 0 ? (
              <MotionGrid className="space-y-4">
                {talents.map((t) => (
                  <MotionItem key={t.id}>
                    <TalentCard {...t} />
                  </MotionItem>
                ))}
              </MotionGrid>
            ) : (
              <EmptyState
                title="No talents found"
                description="Try adjusting your filter or check back later."
              />
            )}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-8">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1 || loading}
              >
                Previous
              </Button>
              <div className="text-sm font-bold tracking-widest uppercase">
                Page {page} of {pagination.pages}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= pagination.pages || loading}
              >
                Next
              </Button>
            </div>
          )}
        </div>

        {/* Form Sidebar */}
        <aside>
          <Card className="sticky top-24 border-none shadow-2xl bg-gradient-to-br from-brand-500/10 to-transparent p-1 overflow-hidden">
            <div className="bg-surface p-6 rounded-[inherit] space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-lg bg-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/20">
                  <FaUserPlus />
                </div>
                <h2 className="text-xl font-bold">Join the Hub</h2>
              </div>
              <Muted className="text-sm">
                Submit your profile to get discovered by companies and
                collaborators.
              </Muted>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Field>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. John Doe"
                  />
                  {errors.name && <ErrorText>{errors.name}</ErrorText>}
                </Field>
                <Field>
                  <Label htmlFor="role">Current Role</Label>
                  <Input
                    id="role"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder="e.g. Senior Designer"
                  />
                  {errors.role && <ErrorText>{errors.role}</ErrorText>}
                </Field>
                <Field>
                  <Label>Category</Label>
                  <Select
                    id="category"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    <option value="">Select Category</option>
                    {categories.slice(1).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </Select>
                  {errors.category && <ErrorText>{errors.category}</ErrorText>}
                </Field>
                <Field>
                  <Label>Professional Bio</Label>
                  <Textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    rows={4}
                    placeholder="Summarize your skills..."
                  />
                  {errors.bio && <ErrorText>{errors.bio}</ErrorText>}
                </Field>
                <Button
                  type="submit"
                  loading={submitting}
                  className="w-full py-4 text-md font-bold shadow-lg shadow-brand-500/20"
                >
                  Submit Profile <FaRocket className="ml-2 text-xs" />
                </Button>
              </form>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
