"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

export default function LazyImage({
  src,
  alt,
  className,
  sizes,
  fill = true,
  priority = false,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Detect hosts that are configured in next.config.mjs
  const isConfiguredHost = useMemo(() => {
    if (!src || typeof src !== "string") return false;
    if (src.startsWith("/") || src.startsWith("http://localhost")) return true;

    const allowedHosts = [
      "fbcdn.net",
      "fbcdn.com",
      "fbsbx.com",
      "unsplash.com",
      "gstatic.com",
      "google.com",
      "googleusercontent.com",
      "licensebuttons.net",
      "licdn.com",
      "twimg.com",
      "giphy.com",
      "supabase.co",
      "cloudinary.com",
      "imgur.com",
      "pexels.com",
      "staticflickr.com",
      "tradecouncil.org",
    ];

    return allowedHosts.some((host) => src.includes(host));
  }, [src]);

  // Detect hosts that usually block Next.js image optimization (hotlinking protection)
  const isProblematicHost =
    src &&
    typeof src === "string" &&
    (src.includes("fbcdn.net") ||
      src.includes("fbsbx.com") ||
      src.includes("googleusercontent.com") ||
      src.includes("gstatic.com") ||
      src.includes("licdn.com") ||
      src.includes("twimg.com"));

  return (
    <div className={cn("relative overflow-hidden", className)} {...props}>
      {error ? (
        <div className="flex h-full w-full items-center justify-center bg-surface text-muted">
          <span className="text-sm">Image not found</span>
        </div>
      ) : (
        <>
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-surface z-10">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500/20 border-t-brand-500" />
            </div>
          )}
          {isConfiguredHost ? (
            <Image
              src={src}
              alt={alt}
              onLoad={() => setIsLoaded(true)}
              onError={() => {
                console.warn(`LazyImage failed to load: ${src}`);
                setError(true);
                setIsLoaded(true);
              }}
              unoptimized={isProblematicHost}
              className={cn(
                "object-cover transition-opacity duration-300",
                isLoaded ? "opacity-100" : "opacity-0",
              )}
              fill={fill}
              sizes={sizes}
              priority={priority}
            />
          ) : (
            <img
              src={src}
              alt={alt}
              onLoad={() => setIsLoaded(true)}
              onError={() => {
                console.warn(`LazyImage (plain img) failed to load: ${src}`);
                setError(true);
                setIsLoaded(true);
              }}
              className={cn(
                "h-full w-full object-cover transition-opacity duration-300",
                isLoaded ? "opacity-100" : "opacity-0",
                fill ? "absolute inset-0" : "",
              )}
            />
          )}
        </>
      )}
    </div>
  );
}
