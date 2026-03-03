"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import LazyImage from "@/components/LazyImage";

export default function EventCard({
  title,
  description,
  date,
  endDate,
  location,
  image,
  category,
  registrationUrl,
  isPast,
  className,
  href,
}) {
  const linkHref = href || "#";
  const displayDate = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={cn(
        "group overflow-hidden rounded-md border border-border bg-surface transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col",
        className,
      )}
    >
      <div className="relative h-48 overflow-hidden bg-brand-500/5 md:h-56">
        {image && image !== "null" ? (
          <LazyImage
            src={image}
            alt={title}
            className="h-full w-full transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-brand-500/10 text-4xl">
            📅
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {category && (
          <div className="absolute top-3 left-3 z-10">
            <Badge variant="solid" className="shadow-lg">
              {typeof category === "string" ? category : category.name}
            </Badge>
          </div>
        )}

        <div className="absolute top-3 right-3 z-10">
          {isPast ? (
            <Badge
              variant="outline"
              className="bg-black/50 text-white backdrop-blur-sm border-white/20"
            >
              Past
            </Badge>
          ) : (
            <Badge variant="solid" className="bg-emerald-500">
              Upcoming
            </Badge>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="mb-3 line-clamp-2 text-lg font-bold text-text transition-colors duration-300 group-hover:text-brand-500">
          <Link href={linkHref}>{title}</Link>
        </h3>

        {description && (
          <p className="mb-4 line-clamp-2 text-sm text-muted transition-colors duration-300 group-hover:text-text">
            {description.replace(/<[^>]*>?/gm, "")}
          </p>
        )}

        <div className="mb-6 mt-auto space-y-2 text-xs font-medium text-muted">
          <div className="flex items-center gap-2">
            <span className="text-brand-500">📅</span>
            <span>{displayDate}</span>
          </div>
          {location && (
            <div className="flex items-center gap-2">
              <span className="text-brand-500">📍</span>
              <span>{location}</span>
            </div>
          )}
        </div>

        {registrationUrl && !isPast ? (
          <Button
            as="a"
            href={registrationUrl}
            variant="solid"
            className="w-full"
          >
            Register Now
          </Button>
        ) : (
          <Button
            variant="secondary"
            className="w-full opacity-50 cursor-not-allowed"
            disabled
          >
            {isPast ? "Event Ended" : "View Details"}
          </Button>
        )}
      </div>
    </div>
  );
}
