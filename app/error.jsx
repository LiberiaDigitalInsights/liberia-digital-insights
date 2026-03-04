"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { H1 } from "@/components/ui/Typography";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-8 rounded-full bg-rose-500/10 p-6 text-rose-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-12 w-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>
      </div>
      <H1 className="mb-4 text-3xl font-bold">Something went wrong!</H1>
      <p className="mb-8 max-w-md text-muted">
        An unexpected error occurred. We've been notified and are working to fix
        it.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => reset()}
          className="rounded-md bg-brand-500 px-6 py-2 text-white transition-colors hover:bg-brand-600"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-md border border-border px-6 py-2 transition-colors hover:bg-surface"
        >
          Back Home
        </Link>
      </div>
    </div>
  );
}
