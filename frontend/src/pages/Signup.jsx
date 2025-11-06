import React from 'react';
import { H1, Muted } from '../components/ui/Typography';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Field, Label, HelperText, ErrorText } from '../components/ui/Form';
import SEO from '../components/SEO';
import { useToast } from '../context/ToastContext';
import { FaEnvelope, FaUser, FaCheckCircle } from 'react-icons/fa';

export default function Signup() {
  const { showToast } = useToast();
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    interests: [],
  });
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const interests = [
    'Technology News',
    'Podcasts',
    'Events',
    'Startups',
    'Digital Transformation',
    'Innovation',
  ];

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
    setIsSuccess(true);

    showToast({
      title: 'Successfully Subscribed!',
      description: 'Thank you for subscribing. Check your email for confirmation.',
      variant: 'success',
    });

    // Reset form after showing success
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        interests: [],
      });
      setErrors({});
      setIsSuccess(false);
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const toggleInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  if (isSuccess) {
    return (
      <>
        <SEO />
        <div className="mx-auto max-w-2xl px-4 py-12">
          <Card className="p-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-green-500/10 p-4">
                <FaCheckCircle className="h-12 w-12 text-green-500" />
              </div>
            </div>
            <H1 className="mb-4">Thank You for Subscribing!</H1>
            <Muted className="text-lg">
              We've sent a confirmation email to your inbox. Please check and confirm your
              subscription.
            </Muted>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO />
      <div className="mx-auto max-w-2xl px-4 py-8 md:px-6 md:py-12">
        {/* Header */}
        <header className="mb-8 text-center">
          <H1 className="mb-4">Subscribe to Our Newsletter</H1>
          <Muted className="mx-auto max-w-xl text-lg">
            Stay updated with the latest technology news, insights, and events from Liberia and
            beyond. Get exclusive content delivered to your inbox.
          </Muted>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Benefits */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="mb-6 text-xl font-semibold">What You'll Get</h2>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-500" />
                  <span className="text-[var(--color-muted)]">
                    Weekly digest of top tech news and stories
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-500" />
                  <span className="text-[var(--color-muted)]">
                    Early access to podcast episodes and interviews
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-500" />
                  <span className="text-[var(--color-muted)]">
                    Exclusive event invitations and updates
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-500" />
                  <span className="text-[var(--color-muted)]">
                    Insights and analysis from industry experts
                  </span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Signup Form */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="mb-6 text-xl font-semibold">Create Your Account</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Field>
                  <Label htmlFor="name">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="pl-10"
                      aria-invalid={errors.name ? 'true' : 'false'}
                    />
                  </div>
                  {errors.name && <ErrorText>{errors.name}</ErrorText>}
                </Field>

                <Field>
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className="pl-10"
                      aria-invalid={errors.email ? 'true' : 'false'}
                    />
                  </div>
                  {errors.email && <ErrorText>{errors.email}</ErrorText>}
                  <HelperText>
                    We'll send occasional updates. No spam, unsubscribe anytime.
                  </HelperText>
                </Field>

                <Field>
                  <Label>Interests (Optional)</Label>
                  <HelperText className="mb-3">
                    Select topics you're most interested in to receive personalized content.
                  </HelperText>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                          formData.interests.includes(interest)
                            ? 'bg-brand-500 text-white'
                            : 'bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[color-mix(in_oklab,var(--color-surface),white_8%)]'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </Field>

                <Button type="submit" loading={isSubmitting} className="w-full">
                  Subscribe Now
                </Button>

                <Muted className="text-center text-xs">
                  By signing up, you agree to our terms and privacy policy. We respect your inbox
                  and will never share your information.
                </Muted>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
