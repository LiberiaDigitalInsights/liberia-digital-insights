"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Field, Label, HelperText } from "../ui/Form";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useToast } from "@/context/ToastContext";
import { useNewsletterSubscription } from "@/hooks/useBackendApi";

export default function NewsletterWidget() {
  const { showToast } = useToast();
  const { subscribe, loading } = useNewsletterSubscription();
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    company: "",
    org: "",
    position: "",
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
        description: "Thanks for subscribing to our newsletter!",
        variant: "success",
      });
      setStatus("success");
      setForm({ name: "", email: "", company: "", org: "", position: "" });
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
    <Card>
      <CardHeader>
        <CardTitle>NEWSLETTER SIGNUP</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted">
          Sign up for our weekly newsletter and get the latest industry insights
          right in your inbox.
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
            />
            {errors.name ? (
              <HelperText variant="error">{errors.name}</HelperText>
            ) : (
              <HelperText>Enter your full name</HelperText>
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
            />
            {errors.email ? (
              <HelperText variant="error">{errors.email}</HelperText>
            ) : (
              <HelperText>We’ll never share your email</HelperText>
            )}
          </Field>
          <Button
            type="submit"
            className="w-full"
            loading={loading}
            loadingText="Submitting..."
          >
            Sign Up
          </Button>
          {status === "success" && (
            <div role="status" className="text-sm text-green-600">
              You’re all set! Check your inbox for a welcome email.
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
