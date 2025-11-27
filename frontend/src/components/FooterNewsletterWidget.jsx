import React from 'react';
import { Field, Label, HelperText } from './ui/Form';
import Input from './ui/Input';
import Button from './ui/Button';
import { useToast } from '../context/ToastContext';
import { subscribeNewsletter } from '../lib/newsletter';

export default function FooterNewsletterWidget() {
  const { showToast } = useToast();
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    company: '',
    org: '',
    position: '',
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [status, setStatus] = React.useState('idle'); // idle | success | error

  const onChange = (e) => {
    const { id, value } = e.target;
    setForm((f) => ({ ...f, [id.replace('footer-newsletter-', '')]: value }));
    setErrors((prev) => ({ ...prev, [id.replace('footer-newsletter-', '')]: '' }));
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
      setSubmitting(true);
      await subscribeNewsletter(form);
      showToast({
        title: 'Subscribed',
        description: 'Thanks for subscribing to our newsletter!',
        variant: 'success',
      });
      setStatus('success');
      setForm({ name: '', email: '', company: '', org: '', position: '' });
    } catch {
      showToast({
        title: 'Error',
        description: 'Failed to subscribe. Please try again.',
        variant: 'danger',
      });
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field>
          <Label
            htmlFor="footer-newsletter-name"
            className="text-sm font-medium text-[var(--color-text)]"
          >
            Name
          </Label>
          <Input
            id="footer-newsletter-name"
            placeholder="Your name"
            value={form.name}
            onChange={onChange}
            aria-invalid={Boolean(errors.name) || undefined}
            aria-describedby={errors.name ? 'footer-newsletter-name-error' : undefined}
            className="mt-1"
          />
          {errors.name && (
            <HelperText id="footer-newsletter-name-error" variant="error" className="mt-1">
              {errors.name}
            </HelperText>
          )}
        </Field>
        <Field>
          <Label
            htmlFor="footer-newsletter-email"
            className="text-sm font-medium text-[var(--color-text)]"
          >
            Email
          </Label>
          <Input
            id="footer-newsletter-email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={onChange}
            aria-invalid={Boolean(errors.email) || undefined}
            aria-describedby={
              errors.email ? 'footer-newsletter-email-error' : 'footer-newsletter-email-help'
            }
            className="mt-1"
          />
          {errors.email ? (
            <HelperText id="footer-newsletter-email-error" variant="error" className="mt-1">
              {errors.email}
            </HelperText>
          ) : (
            <HelperText id="footer-newsletter-email-help" className="mt-1">
              We'll never share your email
            </HelperText>
          )}
        </Field>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field>
          <Label
            htmlFor="footer-newsletter-company"
            className="text-sm font-medium text-[var(--color-text)]"
          >
            Company
          </Label>
          <Input
            id="footer-newsletter-company"
            placeholder="Company"
            value={form.company}
            onChange={onChange}
            className="mt-1"
          />
        </Field>
        <Field>
          <Label
            htmlFor="footer-newsletter-org"
            className="text-sm font-medium text-[var(--color-text)]"
          >
            Organization
          </Label>
          <Input
            id="footer-newsletter-org"
            placeholder="Organization"
            value={form.org}
            onChange={onChange}
            className="mt-1"
          />
        </Field>
        <Field>
          <Label
            htmlFor="footer-newsletter-position"
            className="text-sm font-medium text-[var(--color-text)]"
          >
            Position
          </Label>
          <Input
            id="footer-newsletter-position"
            placeholder="Position"
            value={form.position}
            onChange={onChange}
            className="mt-1"
          />
        </Field>
      </div>
      <Button
        type="submit"
        className="w-full"
        loading={submitting}
        loadingText="Submitting..."
        size="lg"
      >
        Sign Up for Newsletter
      </Button>
      {status === 'success' && (
        <div role="status" className="text-center text-sm text-green-600 font-medium">
          You're all set! Check your inbox for a welcome email.
        </div>
      )}
      {status === 'error' && Object.keys(errors).length === 0 && (
        <div role="alert" className="text-center text-sm text-red-600">
          Something went wrong. Please try again later.
        </div>
      )}
    </form>
  );
}
