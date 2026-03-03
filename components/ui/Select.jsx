import React from "react";
import { cn } from "@/lib/cn";

const base =
  "w-full appearance-none rounded-md border border-border bg-surface px-3 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-brand-500 transition-all cursor-pointer";

export default function Select({ className, children, ...props }) {
  return (
    <div className="relative">
      <select className={cn(base, className)} {...props}>
        {children}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted">
        ▾
      </span>
    </div>
  );
}
