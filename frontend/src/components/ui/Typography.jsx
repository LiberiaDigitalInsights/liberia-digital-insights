import React from 'react';
import { cn } from '../../lib/cn';

export function H1({ className, ...props }) {
  return <h1 className={cn('text-3xl font-bold tracking-tight', className)} {...props} />;
}

export function H2({ className, ...props }) {
  return <h2 className={cn('text-2xl font-semibold tracking-tight', className)} {...props} />;
}

export function H3({ className, ...props }) {
  return <h3 className={cn('text-xl font-semibold tracking-tight', className)} {...props} />;
}

export function H4({ className, ...props }) {
  return <h4 className={cn('text-lg font-semibold tracking-tight', className)} {...props} />;
}

export function H5({ className, ...props }) {
  return <h5 className={cn('text-md font-semibold tracking-tight', className)} {...props} />;
}

export function H6({ className, ...props }) {
  return <h6 className={cn('text-sm font-semibold tracking-tight', className)} {...props} />;
}

export function Muted({ className, ...props }) {
  return <p className={cn('text-sm text-[var(--color-muted)]', className)} {...props} />;
}

export function P({ className, ...props }) {
  return <p className={cn('text-sm font-semibold tracking-tight', className)} {...props} />;
}

export function A({ className, ...props }) {
  return (
    <a
      className={cn('text-sm text-blue-600 hover:text-blue-800 underline', className)}
      {...props}
    />
  );
}
