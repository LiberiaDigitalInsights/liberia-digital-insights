"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaArrowRight,
  FaKeyboard,
  FaNewspaper,
  FaLightbulb,
  FaMicrophone,
  FaCalendar,
  FaUsers,
  FaHeartbeat,
  FaClock,
  FaUserPlus,
  FaImages,
  FaFileExport,
} from "react-icons/fa";
import { cn } from "@/lib/cn";

const QUICK_ACTIONS = [
  {
    id: "new-article",
    label: "Create New Article",
    icon: FaNewspaper,
    href: "/admin/articles/new",
    category: "Action",
  },
  {
    id: "new-insight",
    label: "Create New Insight",
    icon: FaLightbulb,
    href: "/admin/insights/new",
    category: "Action",
  },
  {
    id: "new-podcast",
    label: "New Podcast Episode",
    icon: FaMicrophone,
    href: "/admin/podcasts/new",
    category: "Action",
  },
  {
    id: "new-event",
    label: "Schedule New Event",
    icon: FaCalendar,
    href: "/admin/events/new",
    category: "Action",
  },
  {
    id: "platform-health",
    label: "Platform Health Dashboard",
    icon: FaHeartbeat,
    href: "/admin/health",
    category: "Navigation",
  },
  {
    id: "activity-feed",
    label: "Live Activity Feed",
    icon: FaClock,
    href: "/admin/activity",
    category: "Navigation",
  },
  {
    id: "invite-user",
    label: "Invite New Contributor",
    icon: FaUserPlus,
    href: "/admin/invitations",
    category: "Action",
  },
  {
    id: "gallery-manage",
    label: "Manage Media Gallery",
    icon: FaImages,
    href: "/admin/gallery",
    category: "Navigation",
  },
  {
    id: "data-exports",
    label: "System Data Exports",
    icon: FaFileExport,
    href: "/admin/exports",
    category: "Navigation",
  },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Toggle with Meta+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSelectedIndex(0);
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Handle Search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/v1/admin/search?q=${encodeURIComponent(query)}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("ldi_token")}`,
            },
          },
        );
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Flatten actions and results for keyboard navigation
  const filteredActions = query
    ? QUICK_ACTIONS.filter((a) =>
        a.label.toLowerCase().includes(query.toLowerCase()),
      )
    : QUICK_ACTIONS;

  const combinedResults = [...filteredActions, ...results];

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % combinedResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(
        (prev) => (prev - 1 + combinedResults.length) % combinedResults.length,
      );
    } else if (e.key === "Enter") {
      if (combinedResults[selectedIndex]) {
        executeAction(combinedResults[selectedIndex]);
      }
    }
  };

  const executeAction = (item) => {
    router.push(item.href);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-xl mx-4 bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/10"
          >
            {/* Search Bar */}
            <div className="flex items-center px-4 border-b border-border bg-muted/20">
              <FaSearch className="w-4 h-4 text-muted" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a command or search for content..."
                className="flex-1 h-16 bg-transparent border-none focus:outline-none focus:ring-0 text-text font-medium px-4"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-muted/40 text-[10px] font-bold text-muted uppercase tracking-widest border border-border">
                <FaKeyboard className="w-3 h-3" />
                <span>ESC to Close</span>
              </div>
            </div>

            {/* Results Section */}
            <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden custom-scrollbar">
              {combinedResults.length > 0 ? (
                <div className="p-2 space-y-1">
                  {combinedResults.map((item, index) => {
                    const active = index === selectedIndex;
                    const Icon =
                      item.icon ||
                      (item._type === "user" ? FaUsers : FaNewspaper);

                    return (
                      <button
                        key={item.id + (item._type || "action")}
                        onClick={() => executeAction(item)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                          "w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 text-left group",
                          active
                            ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                            : "hover:bg-brand-500/5",
                        )}
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                            active
                              ? "bg-white/20 text-white"
                              : "bg-muted text-muted group-hover:text-brand-500",
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-4">
                            <span
                              className={cn(
                                "text-sm font-black italic tracking-tighter truncate uppercase",
                                active ? "text-white" : "text-text",
                              )}
                            >
                              {item.label}
                            </span>
                            {item.category && !active && (
                              <span className="text-[10px] font-black uppercase tracking-widest text-muted opacity-60">
                                {item.category}
                              </span>
                            )}
                          </div>
                          <p
                            className={cn(
                              "text-xs truncate font-medium",
                              active ? "text-white/80" : "text-muted",
                            )}
                          >
                            {item.description || item.href}
                          </p>
                        </div>

                        {active && (
                          <motion.div
                            layoutId="arrow"
                            className="text-white ml-auto"
                          >
                            <FaArrowRight className="w-3 h-3" />
                          </motion.div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : query.length >= 2 && !loading ? (
                <div className="p-12 text-center text-muted">
                  <p className="font-bold italic text-lg uppercase tracking-tighter mb-1">
                    No matches found
                  </p>
                  <p className="text-xs">
                    Try searching for something else or use a different keyword.
                  </p>
                </div>
              ) : (
                <div className="p-12 text-center text-muted animate-pulse">
                  <p className="font-black italic text-sm uppercase tracking-widest mb-1">
                    Waiting for query...
                  </p>
                  <p className="text-[10px]">
                    Start typing to search administrative resources.
                  </p>
                </div>
              )}
            </div>

            {/* Footer Tip */}
            {!query && (
              <div className="p-4 border-t border-border bg-muted/10 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted">
                      ↑
                    </kbd>
                    <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted">
                      ↓
                    </kbd>{" "}
                    to Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted">
                      ↵
                    </kbd>{" "}
                    to Select
                  </span>
                </div>
                <span>
                  Pro Tip: Use{" "}
                  <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted">
                    ⌘
                  </kbd>{" "}
                  +{" "}
                  <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted">
                    K
                  </kbd>{" "}
                  anywhere
                </span>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
