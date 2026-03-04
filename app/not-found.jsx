import React from "react";
import Link from "next/link";
import { H1 } from "@/components/ui/Typography";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-8 text-9xl font-black text-brand-500/10">404</div>
      <H1 className="mb-4 text-4xl font-bold">Page Not Found</H1>
      <p className="mb-8 max-w-md text-muted text-lg">
        The page you are looking for doesn't exist or has been moved to a new
        location.
      </p>
      <Link
        href="/"
        className="rounded-full bg-brand-500 px-8 py-3 text-white font-bold transition-all hover:scale-105 hover:bg-brand-600 shadow-xl shadow-brand-500/20"
      >
        Return to Homepage
      </Link>
    </div>
  );
}
