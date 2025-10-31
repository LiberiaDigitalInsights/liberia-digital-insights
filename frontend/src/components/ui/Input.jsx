import React from 'react';
import { cn } from '../../lib/cn';

const base =
  'w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-white placeholder: text-[var(--color-muted)] outline-none focus:ring-2 focus:ring-brand-500';

export default function Input({ className, ...props }) {
  return <input className={cn(base, className)} {...props} />;
}

