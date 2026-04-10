"use client";

import React from "react";
import sanitizeHtml from "@/utils/sanitizeHtml";

export default function ContentRenderer({ html, className = "" }) {
  const [safe, setSafe] = React.useState("");

  React.useEffect(() => {
    let processed = sanitizeHtml(html);

    // Inject IDs into H2 and H3 tags if they don't have them
    // This allows for deep linking from the Table of Contents
    if (processed) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = processed;
      const headings = tempDiv.querySelectorAll("h2, h3");
      headings.forEach((h, i) => {
        if (!h.id) {
          h.id =
            h.textContent
              .trim()
              .toLowerCase()
              .replace(/[^\w\s-]/g, "")
              .replace(/\s+/g, "-") +
            "-" +
            i;
        }
      });
      processed = tempDiv.innerHTML;
    }

    setSafe(processed);
  }, [html]);

  return (
    <div
      className={`prose prose-invert max-w-none hover:prose-headings:text-brand-500 transition-colors ${className}`}
      dangerouslySetInnerHTML={{
        __html: safe || '<p class="text-muted">Loading content...</p>',
      }}
    />
  );
}
