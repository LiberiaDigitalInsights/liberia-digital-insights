import React from 'react';
import { Link } from 'react-router-dom';
import { H1, Muted } from '../components/ui/Typography';
import SEO from '../components/SEO';
import { CATEGORIES } from '../constants/categories';

export default function Categories() {
  return (
    <>
      <SEO title="Categories | Liberia Digital Insights" />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <header className="mb-8">
          <H1 className="mb-4">Categories</H1>
          <Muted className="text-lg">Browse all categories.</Muted>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((c) => {
            const slug = encodeURIComponent(c.toLowerCase());
            return (
              <Link
                key={c}
                to={`/category/${slug}`}
                className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:bg-[color-mix(in_oklab,var(--color-surface),white_6%)]"
              >
                <div className="font-medium">{c}</div>
                <div className="text-sm text-[var(--color-muted)]">Explore {c} content</div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
