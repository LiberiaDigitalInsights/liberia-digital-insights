import React from 'react';
import { cn } from '../../lib/cn';

export function H1({ className, ...props }) {
  return <h1 className={cn('text-3xl font-bold tracking-tight', className)} {...props} />;
}

export function H2({ className, ...props }) {
  return <h2 className={cn('text-2xl font-semibold tracking-tight', className)} {...props} />;
}

export function Muted({ className, ...props }) {
  return <p className={cn('text-sm text-[var(--color-muted)]', className)} {...props} />;
}
