import React from 'react';
import { cn } from '../../lib/cn';

export default function Accordion({ items, className }) {
  const [open, setOpen] = React.useState(null);
  return (
    <div className={cn('w-full space-y-2', className)}>
      {items.map((item, idx) => {
        const expanded = open === idx;
        return (
          <div
            key={idx}
            className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)]"
          >
            <button
              className="flex w-full items-center justify-between bg-[var(--color-surface)] px-3 py-2 text-left"
              onClick={() => setOpen(expanded ? null : idx)}
              aria-expanded={expanded}
            >
              <span className="text-sm font-medium">{item.title}</span>
              <span aria-hidden>{expanded ? '−' : '+'}</span>
            </button>
            {expanded && (
              <div className="border-t border-[var(--color-border)] p-3 text-sm text-[var(--color-muted)]">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
