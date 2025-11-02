import React from 'react';
import { cn } from '../../lib/cn';
import Button from '../ui/Button';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Lightbox({ items, currentIndex, onClose, onNext, onPrevious }) {
  if (!items || items.length === 0 || currentIndex === null) return null;

  const current = items[currentIndex];

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrevious();
      if (e.key === 'ArrowRight') onNext();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, onNext, onPrevious]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
      onClick={onClose}
    >
      <div className="relative max-h-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -right-12 top-0 rounded-full bg-white/10 p-3 text-white transition-colors duration-200 hover:bg-white/20"
          aria-label="Close lightbox"
        >
          <FaTimes />
        </button>

        {/* Navigation buttons */}
        {items.length > 1 && (
          <>
            <button
              onClick={onPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors duration-200 hover:bg-white/20"
              aria-label="Previous"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors duration-200 hover:bg-white/20"
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
            <div className="aspect-video rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-8">
              <p className="text-center text-white">Video player placeholder</p>
              <p className="mt-2 text-center text-sm text-white/70">{current.title}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="text-center text-white">
            <h3 className="mb-2 text-xl font-semibold">{current.title}</h3>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/70">
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
