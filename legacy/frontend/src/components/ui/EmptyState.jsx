import React from 'react';
import { cn } from '../../lib/cn';

export default function EmptyState({ className, title = 'Nothing here yet', description }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center',
        className,
      )}
    >
      <div className="mb-2 text-base font-semibold text-[var(--color-text)]">{title}</div>
      {description && <p className="text-sm text-[var(--color-muted)]">{description}</p>}
    </div>
  );
}
