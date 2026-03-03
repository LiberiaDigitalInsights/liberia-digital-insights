"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { H1, Muted } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { backendApi } from "@/services/backendApi";
import {
  FaInbox,
  FaCheckCircle,
  FaExclamationTriangle,
  FaHourglassHalf,
  FaChevronLeft,
} from "react-icons/fa";

function UnsubscribeFlow() {
  const searchParams = useSearchParams();
  const [status, setStatus] = React.useState("loading"); // loading | success | error | already
  const [message, setMessage] = React.useState("");
  const [subscriberInfo, setSubscriberInfo] = React.useState(null);

  React.useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage(
        "Invalid unsubscribe link. Please check the URL in your email or contact support.",
      );
      return;
    }

    const performUnsubscribe = async () => {
      try {
        const response = await backendApi.newsletters.unsubscribe(token);
        setStatus("success");
        setMessage(
          "You have been successfully unsubscribed from the LDI Newsletter.",
        );
        setSubscriberInfo(response.subscriber);
      } catch (err) {
        if (err.message?.includes("Already unsubscribed")) {
          setStatus("already");
          setMessage("You are already unsubscribed from our updates.");
        } else {
          setStatus("error");
          setMessage(
            "An error occurred while processing your request. Please try again later.",
          );
        }
      }
    };

    performUnsubscribe();
  }, [searchParams]);

  const handleResubscribe = async () => {
    if (!subscriberInfo?.email) return;
    try {
      setStatus("loading");
      await backendApi.newsletters.subscribe({
        name: subscriberInfo.name,
        email: subscriberInfo.email,
        company: subscriberInfo.company,
      });
      setStatus("success");
      setMessage("Welcome back! You have been successfully resubscribed.");
    } catch {
      setStatus("error");
      setMessage("Failed to resubscribe. Please use the main signup form.");
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-12 border-none shadow-2xl relative overflow-hidden bg-surface">
      <div className="absolute top-0 left-0 w-full h-2 bg-brand-500" />

      <div className="text-center">
        {status === "loading" && (
          <div className="mb-8 flex justify-center">
            <div className="h-20 w-20 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center animate-pulse">
              <FaHourglassHalf className="text-4xl animate-spin" />
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="mb-8 flex justify-center">
            <div className="h-20 w-20 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/20">
              <FaCheckCircle className="text-4xl" />
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="mb-8 flex justify-center">
            <div className="h-20 w-20 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-2xl shadow-rose-500/20">
              <FaExclamationTriangle className="text-4xl" />
            </div>
          </div>
        )}

        {status === "already" && (
          <div className="mb-8 flex justify-center">
            <div className="h-20 w-20 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-2xl shadow-amber-500/20">
              <FaInbox className="text-4xl" />
            </div>
          </div>
        )}

        <H1 className="mb-4 text-3xl font-black uppercase italic tracking-tighter leading-none">
          {status === "loading" && "PROCESSING..."}
          {status === "success" && "UNSUBSCRIBED"}
          {status === "error" && "FAILED"}
          {status === "already" && "ALREADY OFF"}
        </H1>

        <Muted className="mb-10 text-lg font-medium leading-relaxed">
          {message}
        </Muted>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {status === "success" && (
            <Button
              onClick={handleResubscribe}
              className="px-10 font-black uppercase tracking-widest shadow-xl shadow-brand-500/20"
            >
              Resubscribe
            </Button>
          )}
          <Button
            as={Link}
            href="/"
            variant="outline"
            className="px-10 font-black uppercase tracking-widest"
          >
            Back to Hub
          </Button>
        </div>

        {status === "success" && (
          <div className="mt-12 pt-8 border-t border-border/50 text-left">
            <h4 className="text-xs font-black uppercase tracking-widest text-brand-500 mb-4 italic underline underline-offset-4">
              We're sorry to see you go
            </h4>
            <p className="text-sm text-muted font-medium mb-4">
              You will no longer receive our weekly intelligence reports, but
              you can still access all our open-source research and podcasts on
              the main site.
            </p>
            <Link
              href="/privacy"
              className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-brand-500 transition-colors"
            >
              Your Privacy Rights →
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-20">
      <Suspense
        fallback={
          <div className="text-center py-20 font-black text-muted animate-pulse uppercase tracking-widest">
            Initializing...
          </div>
        }
      >
        <UnsubscribeFlow />
      </Suspense>
    </div>
  );
}
