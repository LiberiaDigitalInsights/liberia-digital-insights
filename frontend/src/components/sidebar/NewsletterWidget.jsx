import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Field, Label, HelperText } from '../ui/Form';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useToast } from '../../context/ToastContext';

export default function NewsletterWidget() {
  const { showToast } = useToast();
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    company: '',
    org: '',
    position: '',
  });
  const [submitting, setSubmitting] = React.useState(false);

  const onChange = (e) => {
    const { id, value } = e.target;
    setForm((f) => ({ ...f, [id.replace('newsletter-', '')]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      showToast({
        title: 'Validation Error',
        description: 'Name and email are required.',
        variant: 'danger',
      });
      return;
    }
    try {
      setSubmitting(true);
      // Simulate API call
      await new Promise((r) => setTimeout(r, 600));
      showToast({
        title: 'Subscribed',
        description: 'Thanks for subscribing to our newsletter!',
        variant: 'success',
      });
      setForm({ name: '', email: '', company: '', org: '', position: '' });
    } catch {
      showToast({
        title: 'Error',
        description: 'Failed to subscribe. Please try again.',
        variant: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>NEWSLETTER SIGNUP</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-[var(--color-muted)]">
          Sign up for our weekly newsletter and get the latest industry insights right in your
          inbox.
        </p>
        <form className="space-y-3" onSubmit={onSubmit}>
          <Field>
            <Label htmlFor="newsletter-name">Name</Label>
            <Input
              id="newsletter-name"
              placeholder="Your name"
              value={form.name}
              onChange={onChange}
            />
          </Field>
          <Field>
            <Label htmlFor="newsletter-email">Your Email</Label>
            <Input
              id="newsletter-email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={onChange}
            />
          </Field>
          <Field>
            <Label htmlFor="newsletter-company">Company</Label>
            <Input
              id="newsletter-company"
              placeholder="Company"
              value={form.company}
              onChange={onChange}
            />
          </Field>
          <Field>
            <Label htmlFor="newsletter-org">Organization</Label>
            <Input
              id="newsletter-org"
              placeholder="Organization"
              value={form.org}
              onChange={onChange}
            />
          </Field>
          <Field>
            <Label htmlFor="newsletter-position">Position</Label>
            <Input
              id="newsletter-position"
              placeholder="Position"
              value={form.position}
              onChange={onChange}
            />
          </Field>
          <Button type="submit" className="w-full" loading={submitting} loadingText="Submitting...">
            Sign Up
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
