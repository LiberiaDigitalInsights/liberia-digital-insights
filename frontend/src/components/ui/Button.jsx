import React from 'react';
import { cn } from '../../lib/cn';

const base =
  'inline-flex items-center justify-center rounded-[var(--radius-md)] px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-50 disabled:pointer-events-none';

const variants = {
  solid: 'bg-brand-500 text-white hover:bg-brand-600',
  outline: 'border border-[var(--color-border)] text-white hover:bg-[var(--color-surface)]',
  ghost: 'text-white hover:bg-[color-mix(in_oklab,var(--color-text),transparent_92%)]',
  subtle: 'bg-[var(--color-surface)] text-white hover:bg-[color-mix(in_oklab,var(--color-surface),white_5%)]',
};

export default function Button({ as: Comp = 'button', className, variant = 'solid', ...props }) {
  return <Comp className={cn(base, variants[variant], className)} {...props} />;
}

