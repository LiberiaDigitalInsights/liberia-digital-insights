import React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import LazyImage from "@/components/LazyImage";
import BookmarkButton from "@/components/ui/BookmarkButton";
import { stripHtml } from "@/lib/text";

export default function NewsCard({
  id,
  image,
  title,
  excerpt,
  category,
  author,
  date,
  readTime,
  href = "#",
  large = false,
  horizontal = false,
  className,
  noBorder = false,
  compact = false,
}) {
  const cleanExcerpt = stripHtml(excerpt);
  // Ensure author always exists for display
  const authorData = author || {
    name: "LDI Staff",
    role: "Editor",
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col bg-surface transition-all duration-300 overflow-hidden",
        !noBorder && "border-b border-border/50 pb-8",
        noBorder &&
          cn(
            "rounded-3xl shadow-sm hover:shadow-2xl hover:bg-surface/80 border border-border/10",
            compact ? "p-5 md:p-6" : "p-6 md:p-8",
          ),
        horizontal &&
          "lg:flex-row lg:items-center lg:gap-12 lg:border-none lg:pb-0 lg:p-10 md:lg:p-14",
        className,
      )}
    >
      <Link
        href={href}
        className={cn(
          "flex flex-col flex-1 relative",
          horizontal && "lg:flex-row lg:items-center",
        )}
      >
        {image && (
          <div
            className={cn(
              "relative overflow-hidden",
              large ? "absolute inset-0 z-0" : "mb-6 rounded-2xl",
              !large && (compact ? "aspect-2/1" : "aspect-video"),
              noBorder && !large && !horizontal && "rounded-2xl shadow-lg mb-8",
              compact && "mb-5",
              horizontal &&
                "lg:relative lg:order-2 lg:flex-1 lg:aspect-square lg:max-h-[400px] lg:rounded-3xl lg:mb-0 lg:shadow-2xl",
            )}
          >
            <div className="h-full w-full transition-transform duration-700 group-hover:scale-110">
              <LazyImage
                src={image}
                alt={title}
                className="h-full w-full object-cover"
                sizes={
                  large || horizontal
                    ? "100vw"
                    : "(min-width: 1024px) 33vw, 50vw"
                }
                priority={large || horizontal}
              />
            </div>
            {large && (
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent z-10" />
            )}
            {category && !large && !horizontal && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-brand-500 text-white text-[10px] font-bold uppercase tracking-widest shadow-xl">
                {category}
              </span>
            )}
          </div>
        )}

        <div
          className={cn(
            "flex flex-col flex-1 transition-transform duration-500 relative z-20",
            large ? "mt-auto p-8 md:p-12" : "",
            horizontal &&
              "lg:order-1 lg:flex-[1.4] lg:pr-12 lg:p-0 lg:justify-center",
            large && "group-hover:-translate-y-2",
          )}
        >
          {category && (large || horizontal) && (
            <span className="inline-block px-3 py-1 rounded-md bg-brand-500 text-white text-[10px] font-bold uppercase tracking-widest mb-4 w-fit shadow-xl transition-all group-hover:bg-white group-hover:text-brand-500">
              {category}
            </span>
          )}

          <h3
            className={cn(
              "tracking-tight transition-colors duration-300 line-clamp-2 md:line-clamp-3 leading-[1.2]",
              large || horizontal
                ? "text-3xl md:text-5xl lg:text-6xl font-extrabold text-text mb-8"
                : cn(
                    "text-text group-hover:text-brand-500 leading-snug",
                    compact
                      ? "text-lg md:text-xl font-bold mb-3 max-w-[90%]"
                      : "text-xl md:text-2xl font-bold mb-6",
                  ),
              large && "text-white drop-shadow-2xl",
            )}
          >
            {title}
          </h3>

          {excerpt && (
            <p
              className={cn(
                "font-normal leading-relaxed",
                large || horizontal
                  ? "text-base md:text-lg lg:text-xl line-clamp-3 mb-10 max-w-3xl"
                  : cn(
                      "text-sm text-muted line-clamp-2",
                      compact ? "mb-4" : "mb-6",
                    ),
                large ? "text-white/80 drop-shadow-lg" : "text-muted",
              )}
            >
              {excerpt}
            </p>
          )}

          <div
            className={cn(
              "mt-auto flex items-center justify-between border-t border-border/10",
              compact ? "pt-5" : "pt-8",
            )}
          >
            <div
              className={cn(
                "flex items-center gap-6 text-[11px] md:text-sm",
                large ? "text-white/60" : "text-muted",
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-9 h-9 rounded-full bg-brand-500/10 flex items-center justify-center text-xs font-bold text-brand-500 uppercase border border-brand-500/20 shadow-sm",
                    !large && "w-8 h-8 text-[10px]",
                  )}
                >
                  {authorData.name?.[0] || "A"}
                </div>
                <div className="flex flex-col">
                  <span
                    className={cn(
                      "font-bold leading-tight",
                      !large && "text-text text-sm md:text-base",
                    )}
                  >
                    {authorData.name}
                  </span>
                  {authorData.role && (
                    <span className="text-[10px] text-brand-500 uppercase tracking-widest font-extrabold line-clamp-1 opacity-80">
                      {authorData.role}
                    </span>
                  )}
                </div>
              </div>
              <span className="w-px h-6 bg-border/50 shadow-xs" />
              <div className="flex flex-col">
                <span className="font-medium leading-none mb-1 text-[10px] md:text-xs">
                  {date}
                </span>
                {readTime && (
                  <span className="font-bold text-brand-500 uppercase text-[9px] md:text-[10px] tracking-widest">
                    {readTime} min read
                  </span>
                )}
              </div>
            </div>

            {id && !large && !horizontal && (
              <div onClick={(e) => e.preventDefault()}>
                <BookmarkButton
                  contentId={id}
                  contentType="article"
                  size="xs"
                  className="bg-transparent border-none text-muted hover:text-brand-500 p-0"
                />
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
