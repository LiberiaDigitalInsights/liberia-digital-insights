"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaUserPlus,
  FaLock,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { apiRequest } from "@/hooks/useBackendApi";
import { motion } from "framer-motion";

export default function InviteOnboarding() {
  const { token } = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invite, setInvite] = useState(null);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    password: "",
    confirm_password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const data = await apiRequest(`/invitations/verify?token=${token}`);
        setInvite(data);
      } catch (err) {
        setError(err.message || "This invitation is invalid or has expired.");
      } finally {
        setLoading(false);
      }
    };

    if (token) verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) {
      showToast({
        title: "Error",
        description: "Passwords do not match",
        variant: "danger",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiRequest("/auth/register-invite", {
        method: "POST",
        body: JSON.stringify({
          token,
          first_name: form.first_name,
          last_name: form.last_name,
          password: form.password,
        }),
      });

      showToast({
        title: "Welcome aboard!",
        description: "Your account has been created successfully.",
        variant: "success",
      });

      // Response should include the JWT token.
      // We should ideally use the AuthContext to log the user in.
      if (response.token) {
        localStorage.setItem("ldi_token", response.token);
        // Refresh or redirect to dashboard
        router.push("/admin");
      } else {
        router.push("/login");
      }
    } catch (err) {
      showToast({
        title: "Setup Failed",
        description: err.message,
        variant: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse space-y-4 text-center">
          <div className="w-16 h-16 bg-brand-500/20 rounded-full mx-auto" />
          <p className="text-muted font-black uppercase tracking-widest text-xs">
            Verifying Invitation...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full border-rose-500/30 bg-surface/50">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <FaExclamationTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase text-text italic">
              Invalid <span className="text-rose-500">Invitation</span>
            </h1>
            <p className="text-muted font-medium leading-relaxed">{error}</p>
            <Button
              as="a"
              href="/login"
              variant="outline"
              className="w-full rounded-xl font-black uppercase tracking-widest text-xs h-12"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full"
      >
        <Card className="border-brand-500/30 bg-surface/80 backdrop-blur-xl shadow-2xl shadow-brand-500/10">
          <CardContent className="p-10 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-brand-500 font-black uppercase tracking-[0.2em] text-[10px]">
                Liberia Digital Insights
              </h2>
              <h1 className="text-3xl font-black tracking-tighter uppercase text-text italic">
                Complete Your <span className="text-brand-500">Setup</span>
              </h1>
              <p className="text-muted text-sm font-medium">
                You've been invited as an{" "}
                <span className="text-text font-bold uppercase tracking-tight">
                  {invite?.role}
                </span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted px-1">
                    First Name
                  </label>
                  <Input
                    required
                    value={form.first_name}
                    onChange={(e) =>
                      setForm({ ...form, first_name: e.target.value })
                    }
                    className="bg-background/50 border-border/50 focus:border-brand-500 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted px-1">
                    Last Name
                  </label>
                  <Input
                    required
                    value={form.last_name}
                    onChange={(e) =>
                      setForm({ ...form, last_name: e.target.value })
                    }
                    className="bg-background/50 border-border/50 focus:border-brand-500 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted px-1">
                  Create Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-3 h-3" />
                  <Input
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="pl-10 bg-background/50 border-border/50 focus:border-brand-500 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted px-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-3 h-3" />
                  <Input
                    type="password"
                    required
                    value={form.confirm_password}
                    onChange={(e) =>
                      setForm({ ...form, confirm_password: e.target.value })
                    }
                    className="pl-10 bg-background/50 border-border/50 focus:border-brand-500 rounded-xl"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-500 hover:bg-brand-600 text-white font-black uppercase tracking-widest h-14 rounded-xl shadow-lg shadow-brand-500/20"
              >
                {isSubmitting ? (
                  "Creating Account..."
                ) : (
                  <>
                    <FaUserPlus className="mr-2" /> Start Collaborating
                  </>
                )}
              </Button>
            </form>

            <div className="pt-4 border-t border-border/20 text-center">
              <p className="text-[10px] text-muted font-bold uppercase tracking-widest">
                Account Email:{" "}
                <span className="text-text">{invite?.email}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
