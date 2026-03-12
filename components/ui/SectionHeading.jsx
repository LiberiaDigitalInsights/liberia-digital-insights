import React from "react";
import { cn } from "@/lib/cn";

export default function SectionHeading({
  children,
  className,
  subtitle,
  href,
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between border-b border-border/40 mb-12 pb-4",
        className,
      )}
    >
      <div
        className={cn(
          "relative after:absolute after:bottom-[-17px] after:left-0 after:h-[4px] after:w-20 after:bg-brand-500 after:rounded-full",
        )}
      >
        <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-text">
          {children}
        </h2>
        {subtitle && (
          <span className="text-[10px] text-muted mt-2 block font-semibold uppercase tracking-widest">
            {subtitle}
          </span>
        )}
      </div>
      {href && (
        <a
          href={href}
          className="text-xs font-bold text-brand-500 hover:text-brand-600 transition-colors flex items-center gap-1.5 group"
        >
          EXPLORE ALL
          <span className="group-hover:translate-x-1 transition-transform ml-1">
            →
          </span>
        </a>
      )}
    </div>
  );
}
