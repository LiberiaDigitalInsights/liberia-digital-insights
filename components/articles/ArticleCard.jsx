"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/cn";
import LazyImage from "@/components/LazyImage";
import BookmarkButton from "@/components/ui/BookmarkButton";

export default function ArticleCard({
  id,
  image,
  title,
  excerpt,
  category,
  author,
  date,
  readTime,
  href = "#",
  featured = false,
  featuredReverse = false,
  className,
  tags = [],
  contentType = "article",
}) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link
        href={href}
        className={cn(
          "group block overflow-hidden rounded-md border border-border bg-surface shadow-sm transition-all duration-300 hover:shadow-xl",
          featured &&
            "md:col-span-2 sm:grid sm:grid-cols-[1.1fr_0.9fr] md:grid-cols-[1.25fr_0.75fr]",
          className,
        )}
      >
        {featured ? (
          <>
            <div
              className={cn(
                "p-5 sm:p-6 md:p-8",
                featuredReverse && "md:order-2",
              )}
            >
              <h3 className="mb-3 line-clamp-2 text-base font-semibold text-text transition-colors duration-300 group-hover:text-brand-500">
                {title}
              </h3>
              {excerpt && (
                <p className="mb-4 line-clamp-3 text-sm text-muted transition-colors duration-300 group-hover:text-text">
                  {excerpt}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted transition-colors duration-300 group-hover:text-text">
                {author && <span>{author}</span>}
                {date && <span>•</span>}
                {date && <span>{date}</span>}
                {readTime && <span>•</span>}
                {readTime && <span>{readTime} mins read</span>}
              </div>
            </div>
            {image && (
              <div
                className={cn(
                  "relative order-last h-48 sm:h-64 overflow-hidden bg-brand-500/5 md:h-full",
                  featuredReverse ? "md:order-1" : "md:order-0",
                )}
              >
                <div className="h-full w-full transition-transform duration-500 group-hover:scale-110">
                  <LazyImage
                    src={image}
                    alt={title}
                    className="h-full w-full"
                    sizes={
                      "(min-width: 1024px) 40vw, (min-width: 640px) 45vw, 100vw"
                    }
                    priority
                  />
                </div>
                {category && (
                  <div className="absolute top-3 left-3 rounded-full bg-brand-500 px-2.5 py-1 text-xs font-medium text-white shadow-lg z-10">
                    {category}
                  </div>
                )}
                {id && (
                  <div className="absolute top-3 right-3 z-10">
                    <BookmarkButton
                      contentId={id}
                      contentType={contentType}
                      size="sm"
                    />
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            {image && (
              <div className="relative h-48 overflow-hidden bg-brand-500/5 md:h-56">
                <div className="h-full w-full transition-transform duration-500 group-hover:scale-110">
                  <LazyImage
                    src={image}
                    alt={title}
                    className="h-full w-full"
                    sizes={
                      "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    }
                  />
                </div>
                {category && (
                  <div className="absolute top-3 left-3 rounded-full bg-brand-500 px-2.5 py-1 text-xs font-medium text-white shadow-lg z-10">
                    {category}
                  </div>
                )}
                {id && (
                  <div className="absolute top-3 right-3 z-10">
                    <BookmarkButton
                      contentId={id}
                      contentType={contentType}
                      size="sm"
                    />
                  </div>
                )}
              </div>
            )}
            <div className="p-5">
              <h3 className="mb-3 line-clamp-2 text-base font-semibold text-text transition-colors duration-300 group-hover:text-brand-500">
                {title}
              </h3>
              {excerpt && (
                <p className="mb-4 line-clamp-2 text-sm text-muted transition-colors duration-300 group-hover:text-text">
                  {excerpt}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted transition-colors duration-300 group-hover:text-text">
                {author && <span>{author}</span>}
                {date && <span>•</span>}
                {date && <span>{date}</span>}
                {readTime && <span>•</span>}
                {readTime && <span>{readTime} mins read</span>}
              </div>
            </div>
          </>
        )}
      </Link>
    </motion.div>
  );
}
