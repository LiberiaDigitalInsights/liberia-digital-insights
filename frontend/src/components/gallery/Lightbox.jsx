import React, { useEffect, useRef } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import VideoPlayer from '../video/VideoPlayer';

export default function Lightbox({ items, currentIndex, onClose, onNext, onPrevious }) {
  const isOpen = !!(items && items.length > 0 && currentIndex !== null);
  const current = isOpen ? items[currentIndex] : null;
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);
  const lastFocusedRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    lastFocusedRef.current = document.activeElement;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrevious();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'Tab') {
        // Focus trap
        const container = dialogRef.current;
        if (!container) return;
        const focusable = container.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    // Initial focus to close button
    setTimeout(() => closeBtnRef.current?.focus(), 0);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      // Restore focus to previous element
      if (lastFocusedRef.current && lastFocusedRef.current.focus) {
        lastFocusedRef.current.focus();
      }
    };
  }, [isOpen, onClose, onNext, onPrevious]);

  if (!isOpen) return null;

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      aria-describedby="lightbox-caption"
    >
      <div className="relative max-h-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={onClose}
          ref={closeBtnRef}
          className="absolute -right-12 top-0 rounded-full bg-white/10 p-3 text-white transition-colors duration-200 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Close lightbox"
        >
          <FaTimes />
        </button>

        {/* Navigation buttons */}
        {items.length > 1 && (
          <>
            <button
              onClick={onPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors duration-200 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Previous"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors duration-200 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Next"
            >
              <FaChevronRight />
            </button>
          </>
        )}

        {/* Content */}
        <div className="space-y-4">
          {current.type === 'image' ? (
            <img
              src={current.url}
              alt={current.title}
              className="max-h-[80vh] w-auto rounded-[var(--radius-lg)] object-contain"
            />
          ) : (
            <VideoPlayer
              url={current.url}
              title={current.title}
              thumbnail={current.thumbnail_url}
              className="max-h-[80vh] w-auto"
            />
          )}

          {/* Metadata */}
          <div className="text-center text-white">
            <h3 id="lightbox-title" className="mb-2 text-xl font-semibold">
              {current.title}
            </h3>
            <div
              id="lightbox-caption"
              className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/70"
            >
              {current.event && <span>{current.event}</span>}
              {current.category && <span>•</span>}
              {current.category && <span>{current.category}</span>}
              {current.date && <span>•</span>}
              {current.date && (
                <span>
                  {new Date(current.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              )}
            </div>
            {items.length > 1 && (
              <div className="mt-4 text-sm text-white/50">
                {currentIndex + 1} / {items.length}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
