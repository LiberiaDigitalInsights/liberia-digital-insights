import React from "react";
import { cn } from "@/lib/cn";

export default function EmptyState({
  className,
  title = "Nothing here yet",
  description,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-border bg-surface p-10 text-center shadow-sm",
        className,
      )}
    >
      <div className="mb-2 text-lg font-bold text-text">{title}</div>
      {description && <p className="text-sm text-muted">{description}</p>}
    </div>
  );
}
