import React from 'react';
import { useToast } from '../../context/ToastContext';
import Button from './Button';

const variantStyles = {
  info: 'border-sky-500/40 bg-sky-500/10',
  success: 'border-emerald-500/40 bg-emerald-500/10',
  warning: 'border-amber-500/40 bg-amber-500/10',
  danger: 'border-red-500/40 bg-red-500/10',
};

export default function ToastViewport() {
  const { toasts, removeToast } = useToast();
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-80 flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={
            'pointer-events-auto overflow-hidden rounded-[var(--radius-md)] border p-3 text-sm shadow ' +
            (variantStyles[t.variant] || variantStyles.info)
          }
          role="status"
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              {t.title && <div className="font-semibold">{t.title}</div>}
              {t.description && <div className="text-[var(--color-muted)]">{t.description}</div>}
            </div>
            <Button size="sm" variant="subtle" onClick={() => removeToast(t.id)}>
              Dismiss
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
