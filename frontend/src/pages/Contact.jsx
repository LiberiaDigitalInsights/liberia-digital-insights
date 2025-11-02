import React from 'react';
import { H1, Muted } from '../components/ui/Typography';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import { Field, Label, HelperText, ErrorText } from '../components/ui/Form';
import { useToast } from '../context/ToastContext';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function Contact() {
  const { showToast } = useToast();
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
  });
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast({
        title: 'Validation Error',
        description: 'Please fill in all required fields correctly.',
        variant: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);

    showToast({
      title: 'Message Sent!',
      description: 'Thank you for contacting us. We will get back to you soon.',
      variant: 'success',
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      category: '',
      message: '',
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const contactInfo = [
    {
      icon: FaEnvelope,
      label: 'Email',
      value: 'info@liberiadigitalinsights.news',
      link: 'mailto:info@liberiadigitalinsights.news',
    },
    {
      icon: FaPhone,
      label: 'Phone',
      value: '+231 123 456 7890',
      link: 'tel:+2311234567890',
    },
    {
      icon: FaMapMarkerAlt,
      label: 'Address',
      value: 'Monrovia, Liberia',
      link: null,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      {/* Header */}
      <header className="mb-12 text-center">
        <H1 className="mb-4">Contact Us</H1>
        <Muted className="mx-auto max-w-3xl text-lg">
          Have a question, suggestion, or want to collaborate? We'd love to hear from you. Fill out
          the form below or reach us directly through our contact information.
        </Muted>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Contact Information */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h2 className="mb-6 text-xl font-semibold">Get in Touch</h2>
            <div className="space-y-6">
              {contactInfo.map((info, idx) => {
                const Icon = info.icon;
                return (
                  <div
                    key={idx}
                    className="opacity-0 animate-slide-up"
                    style={{ animationDelay: `${100 + idx * 100}ms` }}
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <div className="rounded-full bg-brand-500/10 p-2">
                        <Icon className="h-4 w-4 text-brand-500" />
                      </div>
                      <span className="text-sm font-medium text-[var(--color-muted)]">
                        {info.label}
                      </span>
                    </div>
                    {info.link ? (
                      <a
                        href={info.link}
                        className="text-sm text-[var(--color-text)] transition-colors duration-200 hover:text-brand-500"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-sm text-[var(--color-text)]">{info.value}</p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 border-t border-[var(--color-border)] pt-6">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                Business Inquiries
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-[var(--color-muted)]">Advertising:</span>{' '}
                  <a
                    href="mailto:sales@liberiadigitalinsights.news"
                    className="text-[var(--color-text)] transition-colors duration-200 hover:text-brand-500"
                  >
                    sales@liberiadigitalinsights.news
                  </a>
                </div>
                <div>
                  <span className="font-medium text-[var(--color-muted)]">Press/PR:</span>{' '}
                  <a
                    href="mailto:newsroom@liberiadigitalinsights.news"
                    className="text-[var(--color-text)] transition-colors duration-200 hover:text-brand-500"
                  >
                    newsroom@liberiadigitalinsights.news
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="mb-6 text-xl font-semibold">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <Field>
                  <Label htmlFor="name">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    aria-invalid={errors.name ? 'true' : 'false'}
                  />
                  {errors.name && <ErrorText>{errors.name}</ErrorText>}
                </Field>

                <Field>
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    aria-invalid={errors.email ? 'true' : 'false'}
                  />
                  {errors.email && <ErrorText>{errors.email}</ErrorText>}
                </Field>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field>
                  <Label htmlFor="subject">
                    Subject <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this regarding?"
                    aria-invalid={errors.subject ? 'true' : 'false'}
                  />
                  {errors.subject && <ErrorText>{errors.subject}</ErrorText>}
                </Field>

                <Field>
                  <Label htmlFor="category">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    aria-invalid={errors.category ? 'true' : 'false'}
                  >
                    <option value="">Select a category</option>
                    <option value="general">General Inquiry</option>
                    <option value="advertising">Advertising</option>
                    <option value="partnership">Partnership</option>
                    <option value="press">Press/Media</option>
                    <option value="technical">Technical Support</option>
                    <option value="feedback">Feedback</option>
                  </Select>
                  {errors.category && <ErrorText>{errors.category}</ErrorText>}
                </Field>
              </div>

              <Field>
                <Label htmlFor="message">
                  Message <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your inquiry..."
                  aria-invalid={errors.message ? 'true' : 'false'}
                />
                <HelperText>Minimum 10 characters</HelperText>
                {errors.message && <ErrorText>{errors.message}</ErrorText>}
              </Field>

              <Button type="submit" loading={isSubmitting} className="w-full sm:w-auto">
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
