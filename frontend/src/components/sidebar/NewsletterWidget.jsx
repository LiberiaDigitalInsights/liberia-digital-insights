import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Field, Label, HelperText } from '../ui/Form';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { useNewsletterSubscription } from '../../hooks/useBackendApi';

export default function NewsletterWidget() {
  const { showToast } = useToast();
  const { subscribe, loading } = useNewsletterSubscription();
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    company: '',
    org: '',
    position: '',
  });
  const [errors, setErrors] = React.useState({});
  const [status, setStatus] = React.useState('idle'); // idle | success | error

  const onChange = (e) => {
    const { id, value } = e.target;
    setForm((f) => ({ ...f, [id.replace('newsletter-', '')]: value }));
    setErrors((prev) => ({ ...prev, [id.replace('newsletter-', '')]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.name) next.name = 'Name is required';
    if (!form.email) next.email = 'Email is required';
    else if (!/.+@.+\..+/.test(form.email)) next.email = 'Enter a valid email address';
    return next;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      showToast({
        title: 'Validation Error',
        description: 'Please correct the highlighted fields.',
        variant: 'danger',
      });
      setStatus('error');
      return;
    }
    try {
      await subscribe(form);
      showToast({
        title: 'Subscribed',
        description: 'Thanks for subscribing to our newsletter!',
        variant: 'success',
      });
      setStatus('success');
      setForm({ name: '', email: '', company: '', org: '', position: '' });
    } catch (err) {
      // Handle specific error cases
      let errorMessage = 'Failed to subscribe. Please try again.';
      let errorTitle = 'Error';

      if (err.message?.includes('Email already subscribed')) {
        errorTitle = 'Already Subscribed';
        errorMessage = 'This email is already subscribed to our newsletter.';
        setStatus('error');
      } else if (err.message?.includes('Invalid email format')) {
        errorTitle = 'Invalid Email';
        errorMessage = 'Please enter a valid email address.';
        setStatus('error');
      } else if (err.message?.includes('Name and email are required')) {
        errorTitle = 'Missing Information';
        errorMessage = 'Please fill in all required fields.';
        setStatus('error');
      } else if (err.message) {
        errorMessage = err.message;
        setStatus('error');
      }

      showToast({
        title: errorTitle,
        description: errorMessage,
        variant: 'danger',
      });
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
        <form className="space-y-3" onSubmit={onSubmit} noValidate>
          <Field>
            <Label htmlFor="newsletter-name">Name</Label>
            <Input
              id="newsletter-name"
              placeholder="Your name"
              value={form.name}
              onChange={onChange}
              aria-invalid={Boolean(errors.name) || undefined}
              aria-describedby={errors.name ? 'newsletter-name-error' : undefined}
            />
            {errors.name ? (
              <HelperText id="newsletter-name-error" variant="error">
                {errors.name}
              </HelperText>
            ) : (
              <HelperText id="newsletter-name-help">Enter your full name</HelperText>
            )}
          </Field>
          <Field>
            <Label htmlFor="newsletter-email">Your Email</Label>
            <Input
              id="newsletter-email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={onChange}
              aria-invalid={Boolean(errors.email) || undefined}
              aria-describedby={errors.email ? 'newsletter-email-error' : 'newsletter-email-help'}
            />
            {errors.email ? (
              <HelperText id="newsletter-email-error" variant="error">
                {errors.email}
              </HelperText>
            ) : (
              <HelperText id="newsletter-email-help">We’ll never share your email</HelperText>
            )}
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
          <Button type="submit" className="w-full" loading={loading} loadingText="Submitting...">
            Sign Up
          </Button>
          {status === 'success' && (
            <div role="status" className="text-sm text-green-600">
              You’re all set! Check your inbox for a welcome email.
            </div>
          )}
          {status === 'error' && Object.keys(errors).length === 0 && (
            <div role="alert" className="text-sm text-red-600">
              Something went wrong. Please try again later.
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
