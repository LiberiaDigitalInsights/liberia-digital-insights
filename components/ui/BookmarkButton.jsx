"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useAuth, addBookmark, removeBookmark } from "@/hooks/useBackendApi";
import { useBookmarkContext } from "@/context/BookmarkContext";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/cn";

export default function BookmarkButton({
  contentId,
  contentType,
  className,
  size = "md",
  onToggle,
}) {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const {
    isBookmarked: checkBookmarked,
    getBookmarkId,
    refresh,
  } = useBookmarkContext();

  const isBookmarked = checkBookmarked(contentId, contentType);
  const bookmarkId = getBookmarkId(contentId, contentType);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast({
        title: "Login Required",
        description: "Please log in to bookmark content.",
        variant: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      if (isBookmarked && bookmarkId) {
        await removeBookmark(bookmarkId);
        showToast({
          title: "Bookmark Removed",
          description: "Content has been removed from your bookmarks.",
          variant: "info",
        });
      } else {
        await addBookmark(contentId, contentType);
        showToast({
          title: "Bookmark Added",
          description: "Content has been saved to your bookmarks.",
          variant: "success",
        });
      }

      // Notify parent if callback provided
      if (onToggle) onToggle(!isBookmarked);

      // Refresh bookmarks list to keep global state in sync
      refresh();
    } catch (error) {
      console.error("Bookmark toggle failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const Icon = isBookmarked ? FaBookmark : FaRegBookmark;

  const sizeClasses = {
    sm: "p-1.5 text-sm",
    md: "p-2 text-base",
    lg: "p-2.5 text-lg",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggle}
      disabled={loading}
      className={cn(
        "relative flex items-center justify-center rounded-full transition-colors duration-200",
        isBookmarked
          ? "bg-brand-500 text-white"
          : "bg-surface/80 text-muted hover:bg-surface hover:text-brand-500 border border-border/50",
        sizeClasses[size],
        loading && "opacity-50 cursor-not-allowed",
        className,
      )}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isBookmarked ? "active" : "inactive"}
          initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
          transition={{ duration: 0.2 }}
        >
          <Icon />
        </motion.div>
      </AnimatePresence>

      {/* Subtle pulse animation when active */}
      {isBookmarked && (
        <span className="absolute inset-0 rounded-full animate-ping bg-brand-500/20 pointer-events-none" />
      )}
    </motion.button>
  );
}
