import React from 'react';
import { cn } from '../../lib/cn';

const base =
  'inline-flex items-center justify-center rounded-[var(--radius-md)] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-50 disabled:pointer-events-none';

const variants = {
  solid: 'bg-brand-500 text-white hover:bg-brand-600',
  outline:
    'border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)]',
  ghost:
    'text-[var(--color-text)] hover:bg-[color-mix(in_oklab,var(--color-text),transparent_92%)]',
  subtle:
    'bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[color-mix(in_oklab,var(--color-surface),white_5%)]',
  secondary:
    'bg-[color-mix(in_oklab,var(--color-surface),white_6%)] text-[var(--color-text)] hover:bg-[color-mix(in_oklab,var(--color-surface),white_12%)]',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

export default function Button({
  as: Comp = 'button',
  className,
  variant = 'solid',
  size = 'md',
  ...props
}) {
  return <Comp className={cn(base, sizes[size], variants[variant], className)} {...props} />;
}
