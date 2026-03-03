"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { H1, Muted } from "@/components/ui/Typography";
import Card from "@/components/ui/Card";
import { Field, Label, HelperText, ErrorText } from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaUserTie,
  FaChevronLeft,
  FaCheckCircle,
} from "react-icons/fa";

function RegisterForm() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const type = searchParams.get("type") || "training";
  const id = searchParams.get("id");

  const [form, setForm] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    role: "",
  });
  const [errors, setErrors] = React.useState({});
  const [submitting, setSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const onChange = (e) => {
    const { id, value } = e.target;
    setForm((f) => ({ ...f, [id]: value }));
    if (errors[id]) setErrors((err) => ({ ...err, [id]: undefined }));
  };

  const validate = () => {
    const err = {};
    if (!form.fullName.trim()) err.fullName = "Full name is required";
    if (!form.email.trim()) err.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = "Invalid email";
    if (!form.phone.trim()) err.phone = "Phone is required";
    return err;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }
    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 1200));
      setIsSuccess(true);
      showToast({
        title: "Success!",
        description: "You have been registered successfully.",
        variant: "success",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-20">
        <div className="mb-8 flex justify-center">
          <div className="h-24 w-24 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/40">
            <FaCheckCircle className="text-5xl" />
          </div>
        </div>
        <H1 className="mb-4">Registration Successful!</H1>
        <Muted className="text-lg mb-10">
          We've received your application for the {type}. Check your email for
          further instructions.
        </Muted>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/training"
            className="inline-flex items-center gap-2 rounded-md bg-brand-500 px-8 py-3 text-white font-bold hover:bg-brand-600 transition-colors"
          >
            Explore More
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-border px-8 py-3 font-bold hover:bg-surface transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl grid lg:grid-cols-[1fr_350px] gap-12">
      <div>
        <header className="mb-10">
          <Link
            href="/training"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-500 hover:text-brand-600 mb-6 transition-colors"
          >
            <FaChevronLeft className="text-[10px]" /> Back to Trainings
          </Link>
          <H1 className="mb-2 text-4xl font-black leading-tight tracking-tight uppercase">
            Ready to Grow?
          </H1>
          <Muted className="text-lg">
            You are registering for the{" "}
            <span className="text-brand-500 font-bold uppercase">{type}</span>{" "}
            {id && (
              <span className="bg-brand-500/10 px-2 py-0.5 rounded text-brand-500 text-xs">
                ID: {id}
              </span>
            )}
          </Muted>
        </header>

        <Card className="p-8 border-border/50 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-brand-500" />
          <form className="space-y-6" onSubmit={onSubmit} noValidate>
            <div className="grid sm:grid-cols-2 gap-6">
              <Field>
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <Input
                    id="fullName"
                    value={form.fullName}
                    onChange={onChange}
                    className="pl-10"
                    placeholder="John Doe"
                  />
                </div>
                {errors.fullName && <ErrorText>{errors.fullName}</ErrorText>}
              </Field>
              <Field>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    className="pl-10"
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && <ErrorText>{errors.email}</ErrorText>}
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <Field>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={onChange}
                    className="pl-10"
                    placeholder="+231..."
                  />
                </div>
                {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
              </Field>
              <Field>
                <Label htmlFor="organization">Organization / School</Label>
                <div className="relative">
                  <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <Input
                    id="organization"
                    value={form.organization}
                    onChange={onChange}
                    className="pl-10"
                    placeholder="Optional"
                  />
                </div>
              </Field>
            </div>

            <Field>
              <Label htmlFor="role">Current Category</Label>
              <div className="relative">
                <FaUserTie className="absolute left-3 top-1/2 -translate-y-1/2 text-muted z-10" />
                <Select
                  id="role"
                  value={form.role}
                  onChange={onChange}
                  className="pl-10"
                >
                  <option value="">Select your role</option>
                  <option value="student">Student</option>
                  <option value="professional">Professional</option>
                  <option value="entrepreneur">Entrepreneur</option>
                  <option value="other">Other</option>
                </Select>
              </div>
            </Field>

            <div className="pt-6">
              <Button
                type="submit"
                loading={submitting}
                className="w-full py-4 text-lg font-black uppercase tracking-widest shadow-xl shadow-brand-500/20"
              >
                Complete Registration
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <aside className="space-y-6">
        <Card className="p-6 bg-brand-500/5 border-none">
          <h3 className="text-xl font-bold mb-4">Why Register?</h3>
          <ul className="space-y-4 text-sm text-muted">
            <li className="flex gap-3">
              <FaCheckCircle className="text-brand-500 shrink-0 mt-1" />
              <span>Get certified upon completion of the {type}.</span>
            </li>
            <li className="flex gap-3">
              <FaCheckCircle className="text-brand-500 shrink-0 mt-1" />
              <span>Access to premium learning resources and community.</span>
            </li>
            <li className="flex gap-3">
              <FaCheckCircle className="text-brand-500 shrink-0 mt-1" />
              <span>Networking opportunities with industry leaders.</span>
            </li>
          </ul>
        </Card>
        <Card className="p-6 border-border/50">
          <h4 className="font-bold mb-2">Need Help?</h4>
          <p className="text-xs text-muted mb-4">
            Questions about the registration process?
          </p>
          <Link
            href="/contact"
            className="text-sm font-bold text-brand-500 hover:underline"
          >
            Contact Support →
          </Link>
        </Card>
      </aside>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-20">
      <Suspense
        fallback={
          <div className="text-center py-20 font-bold text-muted animate-pulse">
            Initializing Form...
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </div>
  );
}
