"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { H1, Muted } from "@/components/ui/Typography";
import Card from "@/components/ui/Card";
import { Field, Label, ErrorText } from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useBackendApi";
import { FaEnvelope, FaLock, FaShieldAlt, FaArrowRight } from "react-icons/fa";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const redirect = searchParams.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      router.push(redirect);
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-10 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-500 shadow-inner mb-6">
          <FaShieldAlt className="text-3xl" />
        </div>
        <H1 className="mb-2 text-3xl font-black uppercase tracking-tighter italic">
          Admin Portal
        </H1>
        <Muted className="text-sm font-bold tracking-widest uppercase">
          Secure Access for Platform Management
        </Muted>
      </div>

      <Card className="p-8 border-border/50 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-brand-400 via-brand-600 to-brand-400" />

        <form onSubmit={handleSubmit} className="space-y-6">
          <Field>
            <Label
              htmlFor="email"
              className="text-[10px] font-black uppercase tracking-widest text-muted"
            >
              Email Address
            </Label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-muted/50 text-sm" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="[EMAIL_ADDRESS]"
                className="pl-10 h-12 bg-muted/20 border-border/40 focus:bg-surface transition-all"
                required
              />
            </div>
          </Field>

          <Field>
            <div className="flex items-center justify-between mb-1">
              <Label
                htmlFor="password"
                title="password label"
                className="text-[10px] font-black uppercase tracking-widest text-muted mb-0"
              >
                Password
              </Label>
              <Link
                href="/contact"
                className="text-[10px] font-black uppercase tracking-widest text-brand-500 hover:text-brand-600"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted/50 text-sm" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 h-12 bg-muted/20 border-border/40 focus:bg-surface transition-all"
                required
              />
            </div>
          </Field>

          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <ErrorText className="text-center font-bold text-xs">
                {error}
              </ErrorText>
            </div>
          )}

          <Button
            type="submit"
            loading={loading}
            className="w-full h-14 text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-brand-500/20 group-hover:shadow-brand-500/30 transition-all rounded-xl"
          >
            Authenticate{" "}
            <FaArrowRight className="ml-2 text-xs group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>
      </Card>

      <Muted className="mt-8 text-center text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
        <span className="w-8 h-px bg-border" />
        Protected by Liberia Digital Insights
        <span className="w-8 h-px bg-border" />
      </Muted>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 md:px-6">
      <Suspense
        fallback={
          <div className="font-black uppercase tracking-widest text-muted animate-pulse">
            Initializing Security...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
