"use client";

import React from "react";
import { cn } from "@/lib/cn";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
} from "lucide-react";

const variants = {
  success: {
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    className:
      "border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400",
  },
  danger: {
    icon: <AlertCircle className="h-5 w-5 text-red-500" />,
    className: "border-red-500/20 bg-red-500/5 text-red-700 dark:text-red-400",
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    className:
      "border-amber-500/20 bg-amber-500/5 text-amber-700 dark:text-amber-400",
  },
  info: {
    icon: <Info className="h-5 w-5 text-blue-500" />,
    className:
      "border-blue-500/20 bg-blue-500/5 text-blue-700 dark:text-blue-400",
  },
};

export function Toast({ title, description, variant = "info", onClose }) {
  const config = variants[variant] || variants.info;

  return (
    <div
      className={cn(
        "pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border bg-surface shadow-lg animate-in fade-in slide-in-from-right-5 duration-300",
        config.className,
      )}
      role="alert"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0">{config.icon}</div>
          <div className="flex-1 space-y-1">
            {title && <p className="text-sm font-bold leading-none">{title}</p>}
            {description && (
              <p className="text-xs font-medium opacity-90 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-md p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Close"
          >
            <X className="h-4 w-4 opacity-50 hover:opacity-100" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-100 flex flex-col items-end gap-2 p-4 md:p-6"
    >
      <div className="flex w-full flex-col items-end space-y-3 sm:items-end">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}
