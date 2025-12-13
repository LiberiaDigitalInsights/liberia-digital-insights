import React from 'react';
import SEO from '../components/SEO';
import { H1 } from '../components/ui/Typography';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import { Field, Label, HelperText, ErrorText } from '../components/ui/Form';
import EmptyState from '../components/ui/EmptyState';
import TalentCard from '../components/talent/TalentCard';
import { useTalents } from '../hooks/useBackendApi';
import { useToast } from '../context/ToastContext';
import { backendApi } from '../services/backendApi';

export default function Talent() {
  const [filter, setFilter] = React.useState('All');
  const [page, setPage] = React.useState(1);
  const {
    data: talentsData,
    loading,
    error,
    refetch,
  } = useTalents({
    status: 'published',
    category: filter === 'All' ? undefined : filter,
    page: Number(page),
  });

  const { showToast } = useToast();

  const talents = talentsData?.talents || [];
  const pagination = talentsData?.pagination || {};

  const [form, setForm] = React.useState({ name: '', role: '', category: '', bio: '', link: '' });
  const [errors, setErrors] = React.useState({});
  const [submitting, setSubmitting] = React.useState(false);

  const categories = ['All', 'Design', 'Engineering', 'Product'];

  const handleFilterChange = (event) => {
    let value;
    if (event && typeof event === 'object' && event.target) {
      // It's a DOM event
      value = event.target.value;
    } else if (typeof event === 'string') {
      // It's already a string
      value = event;
    } else if (event && event.value) {
      // It's an object with a value property
      value = event.value;
    } else {
      // Fallback
      value = String(event);
    }

    setFilter(value);
    setPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      // Generate slug from name
      const slug = form.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      const newTalent = {
        name: form.name,
        slug,
        role: form.role,
        category: form.category,
        bio: form.bio,
        links: { website: form.link },
        status: 'pending', // Changed from 'published' to 'pending' for admin approval
      };

      await backendApi.talents.create(newTalent);

      // Reset form
      setForm({ name: '', role: '', category: '', bio: '', link: '' });

      // Refetch talents
      await refetch();

      showToast({
        title: 'Profile Submitted!',
        description: 'Your talent profile has been submitted and is pending admin approval.',
        variant: 'success',
      });
    } catch {
      showToast({
        title: 'Error',
        description: 'Failed to submit talent profile.',
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Talent Hub" description="Browse tech talent and submit your profile." />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <header>
              <H1 className="mb-4 text-3xl font-bold">Talent Hub</H1>
              <p className="text-lg text-[var(--color-muted)]">
                Connect with Liberia's brightest tech talent and submit your profile.
              </p>
            </header>

            {/* Filter */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Filter by category:</label>
              <Select value={filter} onChange={handleFilterChange} className="w-48">
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Select>
              <Button size="sm" variant="subtle" onClick={refetch} disabled={loading}>
                Refresh
              </Button>
            </div>

            {/* Talent Grid */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-pulse">Loading talents...</div>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  Error loading talents. Please try again.
                </div>
              ) : talents.length > 0 ? (
                talents.map((t) => <TalentCard key={t.id} {...t} />)
              ) : (
                <EmptyState
                  title="No talents found"
                  description={
                    filter === 'All'
                      ? 'No talents are available at the moment.'
                      : `No talents found in ${filter} category.`
                  }
                />
              )}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="subtle"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1 || loading}
                >
                  Previous
                </Button>
                <span className="text-sm text-[var(--color-muted)]">
                  Page {page} of {pagination.pages}
                </span>
                <Button
                  size="sm"
                  variant="subtle"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= pagination.pages || loading}
                >
                  Next
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Submit Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Field>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your full name"
                      required
                    />
                    {errors.name && <ErrorText>{errors.name}</ErrorText>}
                  </Field>

                  <Field>
                    <Label htmlFor="role">Role/Title *</Label>
                    <Input
                      id="role"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      placeholder="e.g., Frontend Developer"
                      required
                    />
                    {errors.role && <ErrorText>{errors.role}</ErrorText>}
                  </Field>

                  <Field>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      id="category"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.slice(1).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </Select>
                    {errors.category && <ErrorText>{errors.category}</ErrorText>}
                  </Field>

                  <Field>
                    <Label htmlFor="bio">Bio *</Label>
                    <textarea
                      id="bio"
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      placeholder="Tell us about yourself and your expertise..."
                      className="min-h-[100px] w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
                      required
                      aria-describedby={errors.bio ? 'bio-error' : 'bio-help'}
                    />
                    {errors.bio ? (
                      <ErrorText id="bio-error">{errors.bio}</ErrorText>
                    ) : (
                      <HelperText id="bio-help">Min 10 characters.</HelperText>
                    )}
                  </Field>
                  <Field>
                    <Label htmlFor="link">Link</Label>
                    <Input
                      id="link"
                      value={form.link}
                      onChange={(e) => setForm({ ...form, link: e.target.value })}
                      placeholder="https://"
                    />
                    <HelperText>Website, GitHub, or LinkedIn (optional)</HelperText>
                  </Field>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={submitting}>
                      {submitting ? 'Submitting...' : 'Submit'}
                    </Button>
                    <Button
                      type="button"
                      variant="subtle"
                      onClick={() =>
                        setForm({ name: '', role: '', category: '', bio: '', link: '' })
                      }
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
