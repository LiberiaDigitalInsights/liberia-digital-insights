"use client";

import React from "react";
import { H1, Muted } from "@/components/ui/Typography";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { Field, Label, HelperText, ErrorText } from "@/components/ui/Form";
import { useToast } from "@/context/ToastContext";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";

export default function ContactPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  });
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email address";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const { submitContactForm } = await import("@/hooks/useBackendApi");
      await submitContactForm(formData);

      showToast({
        title: "Message Sent!",
        description:
          "Thank you for reaching out. We will get back to you soon.",
        variant: "success",
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "",
        message: "",
      });
    } catch (err) {
      showToast({
        title: "Submission Failed",
        description: err.message || "Failed to send message. Please try again.",
        variant: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <header className="mb-12 text-center">
        <H1 className="mb-4">Contact Us</H1>
        <Muted className="mx-auto max-w-3xl text-lg">
          We’d love to hear from you. Whether you have a question about our
          content, partnerships, or just want to say hello.
        </Muted>
      </header>

      <div className="grid gap-12 lg:grid-cols-3">
        {/* Contact info column */}
        <div className="space-y-6">
          <Card className="p-8 border-none bg-brand-500/5 shadow-sm rounded-3xl">
            <h2 className="text-2xl font-black italic tracking-tighter text-brand-500 mb-8 uppercase">
              Get in Touch
            </h2>
            <div className="space-y-8">
              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 rounded-xl bg-brand-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/20">
                  <FaEnvelope />
                </div>
                <div>
                  <div className="text-sm font-bold uppercase tracking-wider text-muted mb-1">
                    Email
                  </div>
                  <a
                    href="mailto:info@liberiadigitalinsights.com"
                    className="text-text font-bold hover:text-brand-500 transition-colors"
                  >
                    info@liberiadigitalinsights.com
                  </a>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 rounded-xl bg-brand-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/20">
                  <FaPhone />
                </div>
                <div>
                  <div className="text-sm font-bold uppercase tracking-wider text-muted mb-1">
                    Phone
                  </div>
                  <a
                    href="tel:+231777850481"
                    className="text-text font-bold hover:text-brand-500 transition-colors"
                  >
                    +231 77 785 0481
                  </a>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 rounded-xl bg-brand-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/20">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <div className="text-sm font-bold uppercase tracking-wider text-muted mb-1">
                    Address
                  </div>
                  <p className="text-text font-bold">Monrovia, Liberia</p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-border/10">
              <h3 className="text-sm font-black uppercase tracking-widest text-brand-500/60 mb-4">
                Business Inquiries
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-muted uppercase tracking-tighter mb-1">
                    Advertising
                  </p>
                  <a
                    href="mailto:sales@liberiadigitalinsights.com"
                    className="text-sm font-bold hover:text-brand-500 transition-colors"
                  >
                    sales@liberiadigitalinsights.com
                  </a>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted uppercase tracking-tighter mb-1">
                    Press & Media
                  </p>
                  <a
                    href="mailto:newsroom@liberiadigitalinsights.com"
                    className="text-sm font-bold hover:text-brand-500 transition-colors"
                  >
                    newsroom@liberiadigitalinsights.com
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Form column */}
        <div className="lg:col-span-2">
          <Card className="p-8 border-border/50 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <Field>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                  {errors.name && <ErrorText>{errors.name}</ErrorText>}
                </Field>
                <Field>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                  />
                  {errors.email && <ErrorText>{errors.email}</ErrorText>}
                </Field>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                  />
                  {errors.subject && <ErrorText>{errors.subject}</ErrorText>}
                </Field>
                <Field>
                  <Label htmlFor="category">Inquiry Category</Label>
                  <Select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Choose category</option>
                    <option value="general">General Inquiry</option>
                    <option value="advertising">Advertising</option>
                    <option value="partnership">Partnership</option>
                    <option value="feedback">Feedback</option>
                  </Select>
                  {errors.category && <ErrorText>{errors.category}</ErrorText>}
                </Field>
              </div>
              <Field>
                <Label htmlFor="message">Your Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Type your message here..."
                />
                {errors.message && <ErrorText>{errors.message}</ErrorText>}
              </Field>
              <Button
                type="submit"
                loading={isSubmitting}
                className="w-full sm:w-auto px-10 py-4 text-lg"
              >
                <FaPaperPlane className="mr-2 inline" /> Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
