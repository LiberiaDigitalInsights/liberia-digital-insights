import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/cn';
import Accordion from '../ui/Accordion';

export default function SidebarLayout({ sidebarTitle = 'LDI Admin', items = [], children }) {
  const location = useLocation();

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-6 md:grid-cols-[240px_1fr]">
      <aside className="h-fit rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="mb-4 text-sm font-semibold">{sidebarTitle}</div>
        <nav className="space-y-2">
          {items.map((group, idx) => (
            <Accordion
              key={idx}
              items={[
                {
                  title: group.title,
                  content: (
                    <div className="flex flex-col gap-1 pt-1">
                      {group.links.map((l) => (
                        <Link
                          key={l.to}
                          to={l.to}
                          className={cn(
                            'rounded px-2 py-1 text-sm hover:bg-[color-mix(in_oklab,var(--color-surface),white_6%)]',
                            location.pathname === l.to &&
                              'bg-[color-mix(in_oklab,var(--color-surface),white_8%)]',
                          )}
                        >
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  ),
                },
              ]}
            />
          ))}
        </nav>
      </aside>
      <main>{children}</main>
    </div>
  );
}
