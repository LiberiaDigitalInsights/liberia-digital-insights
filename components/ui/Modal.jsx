"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/cn";
import Button from "./Button";
import { FaTimes } from "react-icons/fa";

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  className,
  size = "md",
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[95vw]",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className={cn(
          "relative z-10 w-full max-h-[90vh] flex flex-col rounded-3xl border border-border bg-surface shadow-2xl animate-in fade-in zoom-in duration-300",
          sizes[size],
          className,
        )}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div>
            {title && (
              <h3 className="text-xl font-black uppercase italic tracking-tighter text-text">
                {title}
              </h3>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted text-muted hover:text-text transition-all duration-200"
            aria-label="Close modal"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar text-sm font-medium leading-relaxed">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-6 border-t border-border/50 flex justify-end items-center gap-3 bg-muted/10">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
