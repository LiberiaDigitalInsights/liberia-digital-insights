import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../lib/cn';

export default function LazyImage({
  src,
  alt,
  className,
  sizes,
  fetchpriority = 'auto',
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23e5e7eb"/%3E%3C/svg%3E',
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const node = imgRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
      },
    );

    if (node) {
      observer.observe(node);
    }

    return () => {
      if (node) {
        observer.unobserve(node);
      }
    };
  }, []);

  return (
    <div ref={imgRef} className={cn('relative overflow-hidden', className)} {...props}>
      {error ? (
        <div className="flex h-full w-full items-center justify-center bg-[var(--color-surface)] text-[var(--color-muted)]">
          <span className="text-sm">Image not found</span>
        </div>
      ) : (
        <>
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-surface)]">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500/20 border-t-brand-500" />
            </div>
          )}
          <img
            src={isInView ? src : placeholder}
            alt={alt}
            onLoad={() => setIsLoaded(true)}
            onError={() => {
              setError(true);
              setIsLoaded(true);
            }}
            className={cn(
              'h-full w-full object-cover transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0',
            )}
            loading="lazy"
            decoding="async"
            sizes={sizes}
            fetchpriority={fetchpriority}
          />
        </>
      )}
    </div>
  );
}
