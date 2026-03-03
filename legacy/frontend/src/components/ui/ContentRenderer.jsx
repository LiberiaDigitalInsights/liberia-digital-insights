import React from 'react';
import sanitizeHtml from '../../utils/sanitizeHtml';

export default function ContentRenderer({ html, className = '' }) {
  const safe = sanitizeHtml(html);
  return (
    <div
      className={`prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{
        __html: safe || '<p class="text-[var(--color-muted)]">No content.</p>',
      }}
    />
  );
}
