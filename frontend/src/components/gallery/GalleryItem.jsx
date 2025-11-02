import React from 'react';
import { cn } from '../../lib/cn';
import Badge from '../ui/Badge';

export default function GalleryItem({ item, onClick, className }) {
  return (
    <div
      onClick={() => onClick(item)}
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
        className,
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-[color-mix(in_oklab,var(--color-surface),white_6%)]">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Video badge */}
        {item.type === 'video' && (
          <div className="absolute top-3 right-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-medium text-white shadow-lg">
            ▶ Video
          </div>
        )}

        {/* Image badge */}
        {item.type === 'image' && (
          <div className="absolute top-3 right-3 rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            📷 Image
          </div>
        )}
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex items-end p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="w-full">
          <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-white">{item.title}</h3>
          {item.event && <p className="mb-1 text-xs text-white/80">{item.event}</p>}
          {item.category && (
            <Badge variant="subtle" className="text-xs">
              {item.category}
            </Badge>
          )}
        </div>
      </div>

      {/* Bottom info (visible on hover) */}
      <div className="absolute bottom-0 left-0 right-0 p-3 opacity-100 transition-opacity duration-300 group-hover:opacity-0">
        <p className="truncate text-xs font-medium text-[var(--color-text)]">{item.title}</p>
      </div>
    </div>
  );
}
