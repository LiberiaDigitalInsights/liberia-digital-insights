import React from 'react';
import { cn } from '../../lib/cn';

const base =
  'inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-50 disabled:pointer-events-none';

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
  leftIcon,
  rightIcon,
  loading = false,
  loadingText,
  disabled,
  children,
  ...props
}) {
  const spinnerSize = size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
  return (
    <Comp
      className={cn(base, sizes[size], variants[variant], className)}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span
          aria-hidden
          className={cn(
            spinnerSize,
            'animate-spin rounded-full border-2 border-current border-t-transparent',
          )}
        />
      )}
      {!loading && leftIcon}
      {loading ? loadingText || 'Loading…' : children}
      {!loading && rightIcon}
    </Comp>
  );
}
