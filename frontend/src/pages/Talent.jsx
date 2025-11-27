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
import { mockTalents, getTalentCategories } from '../data/mockTalents';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

export default function Talent() {
  const [filter, setFilter] = React.useState('All');
  const [talents, setTalents] = React.useState([]);
  const { showToast } = useToast();

  const filteredCategory =
    filter === 'All' ? talents : talents.filter((t) => t.category === filter);
  const filtered = filteredCategory.filter((t) => (t.status ? t.status === 'published' : true));

  const [form, setForm] = React.useState({ name: '', role: '', category: '', bio: '', link: '' });
  const [errors, setErrors] = React.useState({});
  const categories = getTalentCategories();

  // Seed and hydrate from mock API
  React.useEffect(() => {
    // Seed initial talents with status 'published' if storage empty
    api.initList(
      'talents',
      mockTalents.map((t) => ({ ...t, status: 'published' })),
    );
    let mounted = true;
    (async () => {
      const list = await api.list('talents');
      if (mounted) setTalents(list);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const reloadTalents = React.useCallback(async () => {
    const list = await api.list('talents');
    setTalents(list);
  }, []);

  React.useEffect(() => {
    const handleFocus = () => {
      reloadTalents();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [reloadTalents]);

  const onChange = (e) => {
    const { id, value } = e.target;
    setForm((f) => ({ ...f, [id]: value }));
    if (errors[id]) setErrors((err) => ({ ...err, [id]: undefined }));
  };

  const validate = () => {
    const err = {};
    if (!form.name) err.name = 'Name is required';
    if (!form.role) err.role = 'Role is required';
    if (!form.category) err.category = 'Category is required';
    if (!form.bio || form.bio.length < 10) err.bio = 'Bio should be at least 10 characters';
    return err;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (Object.keys(err).length) {
      setErrors(err);
      showToast({
        title: 'Validation Error',
        description: 'Please fix the form fields.',
        variant: 'danger',
      });
      return;
    }
    const newTalent = {
      name: form.name,
      role: form.role,
      bio: form.bio,
      category: form.category,
      links: form.link ? { website: form.link } : undefined,
      status: 'pending',
    };
    try {
      const created = await api.create('talents', newTalent);
      // Keep local state in sync even if pending (won't show in list until published)
      setTalents((t) => [created, ...t]);
      setForm({ name: '', role: '', category: '', bio: '', link: '' });
      showToast({
        title: 'Submitted for review',
        description: 'Your profile was submitted and awaits admin approval.',
        variant: 'success',
      });
    } catch {
      showToast({ title: 'Error', description: 'Failed to submit profile.', variant: 'error' });
    }
  };

  return (
    <>
      <SEO title="Talent Hub" description="Browse tech talent and submit your profile." />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <header className="mb-8">
          <H1 className="mb-4 text-3xl font-bold">Talent Hub</H1>
          <p className="text-lg text-[var(--color-muted)]">
            Discover talent and submit your profile.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <section className="md:col-span-2 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  aria-pressed={filter === c}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                    filter === c
                      ? 'bg-brand-500 text-white'
                      : 'bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[color-mix(in_oklab,var(--color-surface),white_8%)]'
                  }`}
                >
                  {c}
                </button>
              ))}
              <Button size="sm" variant="subtle" onClick={reloadTalents}>
                Refresh
              </Button>
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                title="No talent found"
                description="Try a different category or reset filters."
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {filtered.map((t) => (
                  <TalentCard key={t.id} {...t} />
                ))}
              </div>
            )}
          </section>

          <aside className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Submit your profile</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-3" onSubmit={onSubmit}>
                  <Field>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={onChange}
                      aria-invalid={Boolean(errors.name) || undefined}
                      aria-describedby={errors.name ? 'name-error' : 'name-help'}
                    />
                    {errors.name ? (
                      <ErrorText id="name-error">{errors.name}</ErrorText>
                    ) : (
                      <HelperText id="name-help">Your full name.</HelperText>
                    )}
                  </Field>
                  <Field>
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={form.role}
                      onChange={onChange}
                      aria-invalid={Boolean(errors.role) || undefined}
                      aria-describedby={errors.role ? 'role-error' : 'role-help'}
                    />
                    {errors.role ? (
                      <ErrorText id="role-error">{errors.role}</ErrorText>
                    ) : (
                      <HelperText id="role-help">e.g., Engineer</HelperText>
                    )}
                  </Field>
                  <Field>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      id="category"
                      value={form.category}
                      onChange={onChange}
                      defaultValue=""
                      aria-invalid={Boolean(errors.category) || undefined}
                      aria-describedby={errors.category ? 'category-error' : 'category-help'}
                    >
                      <option value="" disabled>
                        Choose a category
                      </option>
                      {categories
                        .filter((c) => c !== 'All')
                        .map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                    </Select>
                    {errors.category ? (
                      <ErrorText id="category-error">{errors.category}</ErrorText>
                    ) : (
                      <HelperText id="category-help">Select best fit.</HelperText>
                    )}
                  </Field>
                  <Field>
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      value={form.bio}
                      onChange={onChange}
                      placeholder="Short bio"
                      aria-invalid={Boolean(errors.bio) || undefined}
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
                    <Input id="link" value={form.link} onChange={onChange} placeholder="https://" />
                    <HelperText>Website, GitHub, or LinkedIn (optional)</HelperText>
                  </Field>
                  <div className="flex gap-2">
                    <Button type="submit">Submit</Button>
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
          </aside>
        </div>
      </div>
    </>
  );
}
