"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FaEnvelopeOpenText,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowLeft,
} from "react-icons/fa";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/lib/cn";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const email = searchParams.get("email");

  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");

  const handleUnsubscribe = async () => {
    setStatus("loading");
    try {
      const response = await fetch("/api/v1/newsletters/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(
          "You have been successfully unsubscribed from our newsletter.",
        );
      } else {
        throw new Error(data.error || "Failed to unsubscribe.");
      }
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    }
  };

  if (!id && !email) {
    return (
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
          <FaExclamationTriangle className="text-amber-500 text-3xl" />
        </div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">
          Invalid Link
        </h1>
        <p className="text-muted max-w-md mx-auto">
          The unsubscription link appears to be invalid or expired. Please check
          your email or contact support if you continue to have issues.
        </p>
        <Link href="/">
          <Button
            variant="outline"
            className="mt-8 rounded-full border-brand-500 text-brand-500 hover:bg-brand-500 hover:text-white transition-all"
          >
            <FaArrowLeft className="mr-2" /> Return Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full mx-auto">
      {status === "idle" && (
        <div className="text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-500/20">
            <FaEnvelopeOpenText className="text-brand-500 text-3xl" />
          </div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            Unsubscribe
          </h1>
          <p className="text-muted">
            Are you sure you want to stop receiving newsletters from{" "}
            <span className="text-text font-bold">
              Liberia Digital Insights
            </span>
            ?
          </p>
          <div className="pt-8 flex flex-col gap-3">
            <Button
              onClick={handleUnsubscribe}
              className="w-full h-14 bg-brand-500 hover:bg-brand-600 text-white font-black italic uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-500/20"
            >
              Confirm Unsubscribe
            </Button>
            <Link href="/">
              <Button variant="ghost" className="w-full h-12 rounded-2xl">
                Keep me subscribed
              </Button>
            </Link>
          </div>
        </div>
      )}

      {status === "loading" && (
        <div className="text-center space-y-6 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin mb-4" />
          <p className="text-xl font-black italic uppercase tracking-widest animate-pulse">
            Processing...
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="text-center space-y-6 animate-scale-in">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
            <FaCheckCircle className="text-emerald-500 text-4xl" />
          </div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-emerald-500">
            Unsubscribed
          </h1>
          <p className="text-muted">
            {message} We're sorry to see you go! You can always re-subscribe on
            our homepage.
          </p>
          <Link href="/">
            <Button className="mt-8 rounded-full bg-surface border border-border hover:bg-muted transition-all px-8 h-12">
              <FaArrowLeft className="mr-2" /> Back to Home
            </Button>
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="text-center space-y-6 animate-shake">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
            <FaExclamationTriangle className="text-red-500 text-3xl" />
          </div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-red-500">
            Error
          </h1>
          <p className="text-muted">{message}</p>
          <Button
            onClick={() => setStatus("idle")}
            variant="outline"
            className="mt-8 rounded-full border-brand-500 text-brand-500"
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Abstract Background Design Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/5 rounded-full blur-[120px]" />

      <Suspense
        fallback={
          <div className="animate-pulse text-brand-500 font-black italic uppercase tracking-widest text-xl">
            Loading...
          </div>
        }
      >
        <UnsubscribeContent />
      </Suspense>
    </div>
  );
}
