import React from "react";
import Link from "next/link";

export default function Logo({ className, noLink = false }) {
  const content = (
    <div className="flex items-center gap-2">
      <img src="/LDI_favicon.png" alt="LDI" className="h-15 w-15 rounded-sm" />
      <span className="text-sm font-semibold tracking-tight text-white">
        Liberia Digital Insights
      </span>
    </div>
  );

  if (noLink) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link
      href="/"
      aria-label="Liberia Digital Insights home"
      className={className}
    >
      {content}
    </Link>
  );
}
