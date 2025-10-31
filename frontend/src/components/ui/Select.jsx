import React from 'react';
import { cn } from '../../lib/cn';

const base =
  'w-full appearance-none rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:ring-2 focus:ring-brand-500';

export default function Select({ className, children, ...props }) {
  return (
    <div className="relative">
      <select className={cn(base, className)} {...props}>
        {children}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[var(--color-muted)]">
        ▾
      </span>
    </div>
  );
}
