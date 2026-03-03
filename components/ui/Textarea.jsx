import React from "react";
import { cn } from "@/lib/cn";

const base =
  "w-full resize-y rounded-md border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-muted outline-none focus:ring-2 focus:ring-brand-500 transition-all";

export default function Textarea({ className, ...props }) {
  return <textarea className={cn(base, className)} {...props} />;
}
