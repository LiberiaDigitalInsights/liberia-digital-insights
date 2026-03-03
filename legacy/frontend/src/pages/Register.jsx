import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { H1 } from '../components/ui/Typography';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Field, Label, HelperText, ErrorText } from '../components/ui/Form';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const [params] = useSearchParams();
  const { showToast } = useToast();
  const type = params.get('type') || 'training';
  const id = params.get('id');

  const [form, setForm] = React.useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    role: '',
  });
  const [errors, setErrors] = React.useState({});
  const [submitting, setSubmitting] = React.useState(false);

  const onChange = (e) => {
    const { id, value } = e.target;
    setForm((f) => ({ ...f, [id]: value }));
    if (errors[id]) setErrors((err) => ({ ...err, [id]: undefined }));
  };

  const validate = () => {
    const err = {};
    if (!form.fullName) err.fullName = 'Full name is required';
    if (!form.email) err.email = 'Email is required';
    else if (!/.+@.+\..+/.test(form.email)) err.email = 'Enter a valid email';
    if (!form.phone) err.phone = 'Phone is required';
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
    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 800));
      showToast({
        title: 'Registered',
        description: 'Your registration was submitted.',
        variant: 'success',
      });
      setForm({ fullName: '', email: '', phone: '', organization: '', role: '' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Register" description={`Register for the ${type} (ID: ${id || 'N/A'})`} />
      <div className="mx-auto max-w-2xl px-4 py-8 md:px-6 md:py-12">
        <header className="mb-6">
          <H1 className="mb-2 text-3xl font-bold">Registration</H1>
          <p className="text-sm text-[var(--color-muted)]">
            You are registering for:{' '}
            <span className="font-medium text-[var(--color-text)]">{type}</span>
            {id ? ` #${id}` : ''}
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Participant Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={onSubmit} noValidate>
              <Field>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={form.fullName}
                  onChange={onChange}
                  aria-invalid={Boolean(errors.fullName) || undefined}
                  aria-describedby={errors.fullName ? 'fullName-error' : 'fullName-help'}
                />
                {errors.fullName ? (
                  <ErrorText id="fullName-error">{errors.fullName}</ErrorText>
                ) : (
                  <HelperText id="fullName-help">As shown on your ID</HelperText>
                )}
              </Field>

              <Field>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  aria-invalid={Boolean(errors.email) || undefined}
                  aria-describedby={errors.email ? 'email-error' : 'email-help'}
                />
                {errors.email ? (
                  <ErrorText id="email-error">{errors.email}</ErrorText>
                ) : (
                  <HelperText id="email-help">We will send confirmation here</HelperText>
                )}
              </Field>

              <Field>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={onChange}
                  aria-invalid={Boolean(errors.phone) || undefined}
                  aria-describedby={errors.phone ? 'phone-error' : 'phone-help'}
                />
                {errors.phone ? (
                  <ErrorText id="phone-error">{errors.phone}</ErrorText>
                ) : (
                  <HelperText id="phone-help">Include country code if outside Liberia</HelperText>
                )}
              </Field>

              <Field>
                <Label htmlFor="organization">Organization</Label>
                <Input id="organization" value={form.organization} onChange={onChange} />
                <HelperText>Optional</HelperText>
              </Field>

              <Field>
                <Label htmlFor="role">Role</Label>
                <Select id="role" value={form.role} onChange={onChange} defaultValue="">
                  <option value="" disabled>
                    Select your role
                  </option>
                  <option value="student">Student</option>
                  <option value="professional">Professional</option>
                  <option value="other">Other</option>
                </Select>
                <HelperText>Optional</HelperText>
              </Field>

              <div className="flex gap-2 pt-2">
                <Button type="submit" loading={submitting} loadingText="Submitting...">
                  Submit Registration
                </Button>
                <Button as={Link} to="/training-courses" variant="secondary">
                  Back to Training & Courses
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
