import React from 'react';
import { cn } from '../../lib/cn';

const base =
  'w-full resize-y rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] outline-none focus:ring-2 focus:ring-brand-500';

export default function Textarea({ className, ...props }) {
  return <textarea className={cn(base, className)} {...props} />;
}
