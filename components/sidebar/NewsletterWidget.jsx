"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Field, Label, HelperText } from "../ui/Form";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useToast } from "@/context/ToastContext";
import { useNewsletterSubscription } from "@/hooks/useBackendApi";

export default function NewsletterWidget({ loading: externalLoading = false }) {
  const { showToast } = useToast();
  const { subscribe, loading } = useNewsletterSubscription();
  const [form, setForm] = React.useState({
    name: "",
    email: "",
  });
  const [errors, setErrors] = React.useState({});
  const [status, setStatus] = React.useState("idle"); // idle | success | error

  const onChange = (e) => {
    const { id, value } = e.target;
    setForm((f) => ({ ...f, [id.replace("newsletter-", "")]: value }));
    setErrors((prev) => ({ ...prev, [id.replace("newsletter-", "")]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.name) next.name = "Name is required";
    if (!form.email) next.email = "Email is required";
    else if (!/.+@.+\..+/.test(form.email))
      next.email = "Enter a valid email address";
    return next;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      showToast({
        title: "Validation Error",
        description: "Please correct the highlighted fields.",
        variant: "danger",
      });
      setStatus("error");
      return;
    }
    try {
      await subscribe(form);
      showToast({
        title: "Subscribed",
        description: "Thanks for subscribing!",
        variant: "success",
      });
      setStatus("success");
      setForm({ name: "", email: "" });
    } catch (err) {
      showToast({
        title: "Error",
        description: err.message || "Failed to subscribe",
        variant: "danger",
      });
      setStatus("error");
    }
  };

  return (
    <Card className="bg-surface/50 border-border/40">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-6 bg-brand-500 rounded-full" />
          <CardTitle className="text-lg">Weekly Newsletter</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-6 text-xs text-muted leading-relaxed">
          Get the latest technology insights and local trends delivered to your
          inbox every Thursday.
        </p>
        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          <Field>
            <Input
              id="newsletter-name"
              placeholder="Full Name"
              value={form.name}
              onChange={onChange}
              className="bg-bg/50 border-border/40 text-sm"
              aria-invalid={Boolean(errors.name) || undefined}
            />
          </Field>
          <Field>
            <Input
              id="newsletter-email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={onChange}
              className="bg-bg/50 border-border/40 text-sm"
              aria-invalid={Boolean(errors.email) || undefined}
            />
          </Field>
          <Button
            type="submit"
            className="w-full font-bold text-xs tracking-widest uppercase"
            loading={loading}
          >
            Subscribe Now
          </Button>
          {status === "success" && (
            <div
              role="status"
              className="text-xs text-green-500 text-center font-medium mt-2"
            >
              Welcome aboard! Check your inbox.
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
