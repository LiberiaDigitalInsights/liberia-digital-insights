"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import LazyImage from "@/components/LazyImage";

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
}) {
  const linkHref = href || `/podcast/${id}`;

  return (
    <Link
      href={linkHref}
      className={cn(
        "group block overflow-hidden rounded-md border border-border bg-surface transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
        className,
      )}
    >
      {image && (
        <div className="relative h-48 overflow-hidden bg-brand-500/5 md:h-56">
          <LazyImage
            src={image}
            alt={title}
            className="h-full w-full transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm z-10">
            {duration}
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
            <div className="h-12 w-12 rounded-full bg-brand-500 flex items-center justify-center text-white shadow-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      )}
      <div className="p-5">
        <h3 className="mb-3 line-clamp-2 text-base font-semibold text-text transition-colors duration-300 group-hover:text-brand-500">
          {title}
        </h3>
        {description && (
          <p className="mb-4 line-clamp-2 text-sm text-muted transition-colors duration-300 group-hover:text-text">
            {description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted transition-colors duration-300 group-hover:text-text">
          {guest && <span className="font-medium text-text">{guest}</span>}
          {date && <span>•</span>}
          {date && <span>{date}</span>}
          {tags.length > 0 && (
            <span className="flex gap-1 ml-auto">
              {tags.slice(0, 1).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] uppercase tracking-wider text-brand-500 font-bold"
                >
                  #{tag}
                </span>
              ))}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
