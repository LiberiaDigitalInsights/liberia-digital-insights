"use client";

import React from "react";
import { cn } from "@/lib/cn";

export function Tabs({ tabs, value, onChange, className }) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex gap-4 border-b border-border">
        {tabs.map((t) => {
          const active = t.value === value;
          return (
            <button
              key={t.value}
              className={cn(
                "px-4 py-2.5 text-sm font-semibold transition-all relative",
                active ? "text-brand-500" : "text-muted hover:text-text",
              )}
              onClick={() => onChange?.(t.value)}
            >
              {t.label}
              {active && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
      <div className="pt-6">
        {tabs.map((t) => (
          <div
            key={t.value}
            hidden={t.value !== value}
            className="animate-fade-in"
          >
            {t.content}
          </div>
        ))}
      </div>
    </div>
  );
}
