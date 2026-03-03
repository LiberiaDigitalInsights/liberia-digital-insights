"use client";

import React from "react";
import { H1, Muted } from "@/components/ui/Typography";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Field, Label, HelperText, ErrorText } from "@/components/ui/Form";
import { useToast } from "@/context/ToastContext";
import {
  FaEnvelope,
  FaUser,
  FaCheckCircle,
  FaRocket,
  FaBell,
  FaLightbulb,
} from "react-icons/fa";
import Link from "next/link";
import { useNewsletterSubscription } from "@/hooks/useBackendApi";

export default function SubscribePage() {
  const { showToast } = useToast();
  const { subscribe, loading } = useNewsletterSubscription();
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    interests: [],
  });
  const [errors, setErrors] = React.useState({});
  const [isSuccess, setIsSuccess] = React.useState(false);

  const interests = [
    "Technology News",
    "Podcasts",
    "Events",
    "Startups",
    "Digital Transformation",
    "Innovation",
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email address";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await subscribe({
        name: formData.name,
        email: formData.email,
        interests: formData.interests,
      });
      setIsSuccess(true);
      showToast({
        title: "Success!",
        description: "You have subscribed to our newsletter.",
        variant: "success",
      });
    } catch (err) {
      showToast({
        title: "Error",
        description: err.message || "Failed to subscribe.",
        variant: "error",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
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
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <Card className="p-12 border-none bg-brand-500/5 shadow-2xl">
          <div className="mb-6 flex justify-center">
            <div className="h-20 w-20 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <FaCheckCircle className="text-4xl" />
            </div>
          </div>
          <H1 className="mb-4">You're Subscribed!</H1>
          <p className="text-xl text-muted mb-8">
            Thank you for joining our community. Check your inbox for a
            confirmation email and get ready for exclusive tech insights.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md bg-brand-500 px-8 py-3 text-white font-bold hover:bg-brand-600 transition-colors"
          >
            Back to Home
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-20">
      <header className="mb-16 text-center">
        <H1 className="mb-4 text-4xl md:text-5xl font-black italic tracking-tighter">
          INSIGHTS IN YOUR INBOX
        </H1>
        <Muted className="mx-auto max-w-2xl text-lg">
          Join 5,000+ tech enthusiasts receiving our weekly digest of the most
          important tech news, analysis, and opportunities in Liberia.
        </Muted>
      </header>

      <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
        <div className="space-y-6">
          <Card className="p-8 border-none bg-surface shadow-xl">
            <h2 className="text-2xl font-bold mb-8">Subscriber Perks</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
                  <FaRocket />
                </div>
                <div>
                  <div className="font-bold">Weekly Digest</div>
                  <p className="text-xs text-muted">
                    A curated summary of the week's top tech stories.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
                  <FaBell />
                </div>
                <div>
                  <div className="font-bold">Event Alerts</div>
                  <p className="text-xs text-muted">
                    Be the first to know about hackathons and conferences.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
                  <FaLightbulb />
                </div>
                <div>
                  <div className="font-bold">Exclusive Content</div>
                  <p className="text-xs text-muted">
                    Deep dives and analysis only for our subscribers.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-8 border-border/50 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-brand-500" />
            <form onSubmit={handleSubmit} className="space-y-6">
              <Field>
                <Label htmlFor="name">What's your name?</Label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="Anointed Morgan"
                  />
                </div>
                {errors.name && <ErrorText>{errors.name}</ErrorText>}
              </Field>
              <Field>
                <Label htmlFor="email">
                  Where should we send the insights?
                </Label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="name@company.com"
                  />
                </div>
                <HelperText>We respect your privacy. No spam, ever.</HelperText>
                {errors.email && <ErrorText>{errors.email}</ErrorText>}
              </Field>

              <div className="pt-4">
                <Label className="mb-4 block">
                  Tailor your experience (Optional)
                </Label>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all border ${
                        formData.interests.includes(interest)
                          ? "bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/20"
                          : "bg-surface border-border text-muted hover:border-brand-500/50 hover:text-text"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full py-4 text-lg font-bold shadow-xl shadow-brand-500/20"
              >
                Subscribe to Newsletter
              </Button>

              <p className="text-[10px] text-center text-muted uppercase tracking-widest font-bold">
                By subscribing you agree to our{" "}
                <Link href="/terms" className="text-brand-500">
                  Terms
                </Link>{" "}
                &{" "}
                <Link href="/privacy" className="text-brand-500">
                  Privacy
                </Link>
              </p>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
