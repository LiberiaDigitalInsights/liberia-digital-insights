import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';
import LazyImage from '../LazyImage';

export default function ArticleCard({
  image,
  title,
  excerpt,
  category,
  author,
  date,
  readTime,
  to = '#',
  featured = false,
  className,
}) {
  return (
    <Link
      to={to}
      className={cn(
        'group block overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
        featured && 'md:col-span-2',
        className,
      )}
    >
      {image && (
        <div className="relative h-48 overflow-hidden bg-[color-mix(in_oklab,var(--color-surface),white_6%)] md:h-56">
          <div className="h-full w-full transition-transform duration-500 group-hover:scale-110">
            <LazyImage
              src={image}
              alt={title}
              className="h-full w-full object-cover"
              sizes={
                featured
                  ? '(min-width: 1024px) 66vw, 100vw'
                  : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
              }
              fetchPriority={featured ? 'high' : 'auto'}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
          {category && (
            <div className="absolute top-3 left-3 rounded-full bg-brand-500 px-2.5 py-1 text-xs font-medium text-white shadow-lg transition-transform duration-300 group-hover:scale-110 z-10">
              {category}
            </div>
          )}
        </div>
      )}
      <div className="p-5">
        <h3 className="mb-3 line-clamp-2 text-base font-semibold text-[var(--color-text)] transition-colors duration-300 group-hover:text-brand-500">
          {title}
        </h3>
        {excerpt && (
          <p className="mb-4 line-clamp-2 text-sm text-[var(--color-muted)] transition-colors duration-300 group-hover:text-[var(--color-text)]">
            {excerpt}
          </p>
        )}
        <div className="flex items-center gap-3 text-xs text-[var(--color-muted)] transition-colors duration-300 group-hover:text-[var(--color-text)]">
          {author && <span>{author}</span>}
          {date && <span>•</span>}
          {date && <span>{date}</span>}
          {readTime && <span>•</span>}
          {readTime && <span>{readTime} mins read</span>}
        </div>
      </div>
    </Link>
  );
}
