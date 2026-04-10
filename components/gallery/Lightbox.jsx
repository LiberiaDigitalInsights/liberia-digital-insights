"use client";

import React, { useEffect, useRef, useCallback } from "react";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaExpand,
  FaDownload,
} from "react-icons/fa";
import VideoPlayer from "@/components/video/VideoPlayer";
import { motion, AnimatePresence } from "framer-motion";
import LazyImage from "@/components/LazyImage";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

export default function Lightbox({
  items,
  currentIndex,
  onClose,
  onNext,
  onPrevious,
}) {
  const isOpen = !!(items && items.length > 0 && currentIndex !== null);
  const current = isOpen ? items[currentIndex] : null;
  const stripRef = useRef(null);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (!stripRef.current) return;
    const active = stripRef.current.querySelector(`[data-active="true"]`);
    if (active) {
      active.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentIndex]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrevious();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onNext, onPrevious],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-black/97 backdrop-blur-2xl"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Image viewer"
      >
        {/* Top bar */}
        <div
          className="w-full flex items-center justify-between px-6 py-4 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3">
            {current.featured && (
              <Badge
                variant="warning"
                className="text-[10px] font-black uppercase tracking-widest"
              >
                <FaStar className="mr-1 text-[8px]" /> Featured
              </Badge>
            )}
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
              {currentIndex + 1} / {items.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {current.url && current.type === "image" && (
              <a
                href={current.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-brand-500 transition-colors"
                aria-label="Download"
              >
                <FaDownload className="text-sm" />
              </a>
            )}
            <button
              onClick={onClose}
              className="h-10 w-10 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-rose-500 hover:rotate-90 transition-all duration-300"
              aria-label="Close"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Main viewer */}
        <div
          className="relative w-full flex-1 flex items-center justify-center px-20 min-h-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Prev / Next */}
          {items.length > 1 && (
            <>
              <button
                onClick={onPrevious}
                className="absolute left-4 h-14 w-14 rounded-2xl bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-brand-500 hover:border-brand-500 transition-all z-10"
                aria-label="Previous"
              >
                <FaChevronLeft className="text-xl" />
              </button>
              <button
                onClick={onNext}
                className="absolute right-4 h-14 w-14 rounded-2xl bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-brand-500 hover:border-brand-500 transition-all z-10"
                aria-label="Next"
              >
                <FaChevronRight className="text-xl" />
              </button>
            </>
          )}

          <motion.div
            key={current.id}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full max-w-5xl flex flex-col items-center gap-6"
          >
            {/* Media */}
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
              {current.type?.toLowerCase() === "image" ? (
                <div className="relative max-h-[60vh] flex items-center justify-center">
                  <LazyImage
                    src={current.url}
                    alt={current.title}
                    className="max-h-[60vh] w-full object-contain"
                  />
                </div>
              ) : (
                <VideoPlayer
                  url={current.url}
                  title={current.title}
                  thumbnail={current.thumbnail_url}
                  className="max-h-[60vh] w-full"
                />
              )}
            </div>

            {/* Caption */}
            <div className="text-center space-y-2 max-w-xl px-4">
              <h3 className="text-xl font-black uppercase italic tracking-tighter text-white leading-none">
                {current.title}
              </h3>
              {current.description && (
                <p className="text-sm text-white/50 font-medium leading-relaxed">
                  {current.description}
                </p>
              )}
              <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-brand-500">
                {current.events?.title && <span>{current.events.title}</span>}
                {current.category && <span className="text-white/20">•</span>}
                {current.category && <span>{current.category}</span>}
                {current.created_at && (
                  <>
                    <span className="text-white/20">•</span>
                    <span className="text-white/40">
                      {new Date(current.created_at).toLocaleDateString(
                        "en-US",
                        { month: "long", year: "numeric" },
                      )}
                    </span>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Thumbnail filmstrip */}
        {items.length > 1 && (
          <div
            className="shrink-0 w-full px-6 py-4 border-t border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              ref={stripRef}
              className="flex gap-2 overflow-x-auto pb-1 scrollbar-none justify-start md:justify-center"
            >
              {items.map((item, idx) => (
                <button
                  key={item.id}
                  data-active={idx === currentIndex ? "true" : "false"}
                  onClick={() => {
                    // Compute direction and call the appropriate handlers n times
                    const diff = idx - currentIndex;
                    if (diff === 0) return;
                    // Call jump directly by updating parent state via a workaround:
                    // We expose the raw setter through an onJump prop, but for backwards
                    // compatibility we loop through onNext/onPrevious
                    if (diff > 0) {
                      for (let i = 0; i < diff; i++) onNext();
                    } else {
                      for (let i = 0; i < Math.abs(diff); i++) onPrevious();
                    }
                  }}
                  className={cn(
                    "relative shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200",
                    idx === currentIndex
                      ? "border-brand-500 scale-110 shadow-lg shadow-brand-500/30"
                      : "border-white/10 opacity-50 hover:opacity-100 hover:border-white/40",
                  )}
                  aria-label={`Go to image ${idx + 1}`}
                >
                  <img
                    src={item.thumbnail_url || item.url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
