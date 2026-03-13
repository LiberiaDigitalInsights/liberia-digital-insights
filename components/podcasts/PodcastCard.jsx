"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import LazyImage from "@/components/LazyImage";
import { stripHtml } from "@/lib/text";

export default function PodcastCard({
  id,
  title,
  description,
  duration,
  date,
  guest,
  image,
  href,
  className,
  tags = [],
  featured = false,
}) {
  const linkHref = href || `/podcast/${id}`;
  const cleanDescription = stripHtml(description);

  return (
    <Link
      href={linkHref}
      className={cn(
        "group block overflow-hidden rounded-[2.5rem] border border-border/10 bg-surface/30 p-3 sm:p-4 transition-all duration-500 hover:shadow-2xl hover:shadow-black/40 hover:-translate-y-1.5 hover:border-brand-500/20 hover:bg-surface/50",
        featured && "sm:flex sm:flex-row sm:gap-6 sm:p-5 md:p-6",
        className,
      )}
    >
      {/* Cover image - Framed / Inset */}
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl bg-surface transition-all duration-500",
          featured
            ? "sm:w-80 sm:shrink-0 aspect-square sm:aspect-[4/3]"
            : "aspect-video mb-5",
        )}
      >
        {image ? (
          <LazyImage
            src={image}
            alt={title}
            className="h-full w-full transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-brand-500/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-12 h-12 text-brand-500/40"
            >
              <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
              <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
            </svg>
          </div>
        )}

        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Play icon transition */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-14 w-14 rounded-full bg-brand-500 flex items-center justify-center text-white shadow-2xl shadow-brand-500/50 opacity-0 scale-90 translate-y-4 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 ml-1"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Duration badge */}
        {duration && (
          <div className="absolute bottom-3 left-3 rounded-lg bg-black/70 px-2.5 py-1 text-[10px] font-mono font-bold text-white backdrop-blur-md border border-white/10 uppercase tracking-tighter">
            {duration}
          </div>
        )}
      </div>

      {/* Content */}
      <div className={cn("flex flex-col", featured && "flex-1 py-1 px-1")}>
        <h3
          className={cn(
            "mb-3 font-black uppercase italic leading-[1.1] tracking-tighter text-text transition-colors duration-300 group-hover:text-brand-500 line-clamp-2",
            featured ? "text-2xl md:text-3xl" : "text-lg",
          )}
        >
          {title}
        </h3>
        {cleanDescription && (
          <p
            className={cn(
              "mb-6 text-muted leading-relaxed font-medium",
              featured ? "text-sm line-clamp-3" : "text-xs line-clamp-2",
            )}
          >
            {cleanDescription}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-border/5 pt-4">
          <div className="flex items-center gap-3">
            {guest && (
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-500 text-[10px] font-bold italic">
                  {guest.charAt(0)}
                </div>
                <span className="text-[11px] font-black uppercase italic tracking-wider text-text/60">
                  {guest}
                </span>
              </div>
            )}
            {guest && date && <span className="text-muted/30">•</span>}
            {date && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted/60">
                {date}
              </span>
            )}
          </div>

          {tags.length > 0 && (
            <span className="text-[9px] font-black uppercase italic tracking-widest text-brand-500/80">
              #{tags[0]}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
