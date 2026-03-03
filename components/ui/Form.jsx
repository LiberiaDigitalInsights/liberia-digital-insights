import React from "react";
import { cn } from "@/lib/cn";

export function Label({ className, ...props }) {
  return (
    <label
      className={cn("mb-1 block text-sm font-medium", className)}
      {...props}
    />
  );
}

export function HelperText({ className, variant, ...props }) {
  const variantClass =
    variant === "error" ? "text-red-500" : "text-[var(--color-muted)]";
  return (
    <p className={cn("mt-1 text-xs", variantClass, className)} {...props} />
  );
}

export function ErrorText({ className, ...props }) {
  return (
    <p className={cn("mt-1 text-xs text-red-500", className)} {...props} />
  );
}

export function Field({ className, children, ...props }) {
  return (
    <div className={cn("w-full", className)} {...props}>
      {children}
    </div>
  );
}
