"use client";

import React from "react";
import sanitizeHtml from "@/utils/sanitizeHtml";

export default function ContentRenderer({ html, className = "" }) {
  const [safe, setSafe] = React.useState("");

  React.useEffect(() => {
    setSafe(sanitizeHtml(html));
  }, [html]);

  return (
    <div
      className={`prose prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{
        __html: safe || '<p class="text-muted">Loading content...</p>',
      }}
    />
  );
}
