"use client";

import React, { useEffect, useRef } from "react";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import VideoPlayer from "@/components/video/VideoPlayer";
import { motion, AnimatePresence } from "framer-motion";
import LazyImage from "@/components/LazyImage";

export default function Lightbox({
  items,
  currentIndex,
  onClose,
  onNext,
  onPrevious,
}) {
  const isOpen = !!(items && items.length > 0 && currentIndex !== null);
  const current = isOpen ? items[currentIndex] : null;
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrevious();
      if (e.key === "ArrowRight") onNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, onNext, onPrevious]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-10"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="relative w-full max-w-6xl flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute -top-16 right-0 md:-right-16 md:top-0 h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-xl text-white flex items-center justify-center transition-all hover:bg-rose-500 hover:rotate-90 z-[110]"
            aria-label="Close"
          >
            <FaTimes className="text-xl" />
          </button>

          {items.length > 1 && (
            <div className="absolute inset-y-0 -inset-x-20 hidden lg:flex items-center justify-between pointer-events-none">
              <button
                onClick={onPrevious}
                className="h-16 w-16 rounded-3xl bg-white/5 border border-white/10 text-white flex items-center justify-center transition-all hover:bg-brand-500 pointer-events-auto"
                aria-label="Previous"
              >
                <FaChevronLeft className="text-2xl" />
              </button>
              <button
                onClick={onNext}
                className="h-16 w-16 rounded-3xl bg-white/5 border border-white/10 text-white flex items-center justify-center transition-all hover:bg-brand-500 pointer-events-auto"
                aria-label="Next"
              >
                <FaChevronRight className="text-2xl" />
              </button>
            </div>
          )}

          <motion.div
            key={current.id}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="w-full flex flex-col items-center gap-8"
          >
            <div className="w-full relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black">
              {current.type?.toLowerCase() === "image" ? (
                <div className="relative max-h-[70vh] aspect-video">
                  <LazyImage
                    src={current.url}
                    alt={current.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <VideoPlayer
                  url={current.url}
                  title={current.title}
                  thumbnail={current.thumbnail_url}
                  className="max-h-[70vh] w-full"
                />
              )}
            </div>

            <div className="text-center space-y-4 max-w-2xl px-4">
              <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-white leading-none">
                {current.title}
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-brand-500">
                {current.events?.title && <span>{current.events.title}</span>}
                {current.category && <span className="text-white/20">•</span>}
                {current.category && <span>{current.category}</span>}
                {current.date && <span className="text-white/20">•</span>}
                {current.date && (
                  <span className="text-white/60">
                    {new Date(current.date).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
              {items.length > 1 && (
                <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">
                  IMAGE {currentIndex + 1} OF {items.length}
                </div>
              )}
            </div>
          </motion.div>

          <div className="mt-8 flex lg:hidden gap-4">
            <button
              onClick={onPrevious}
              className="h-12 w-12 rounded-2xl bg-white/10 text-white flex items-center justify-center"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={onNext}
              className="h-12 w-12 rounded-2xl bg-white/10 text-white flex items-center justify-center"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
