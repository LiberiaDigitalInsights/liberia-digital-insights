"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaSearch,
  FaNewspaper,
  FaMicrophone,
  FaCalendar,
  FaLightbulb,
  FaTimes,
  FaArrowRight,
  FaSpinner,
} from "react-icons/fa";
import { cn } from "@/lib/cn";

const TYPE_META = {
  article: {
    label: "Article",
    icon: FaNewspaper,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  podcast: {
    label: "Podcast",
    icon: FaMicrophone,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  event: {
    label: "Event",
    icon: FaCalendar,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  insight: {
    label: "Insight",
    icon: FaLightbulb,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
};

function ResultItem({ result, isActive, onClick }) {
  const meta = TYPE_META[result._type] || TYPE_META.article;
  const Icon = meta.icon;
  const snippet = result.excerpt || result.description || "";

  return (
    <Link
      href={result.href}
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 px-4 py-3 hover:bg-brand-500/5 transition-colors group",
        isActive && "bg-brand-500/5",
      )}
    >
      <div className={cn("mt-0.5 p-2 rounded-lg shrink-0", meta.bg)}>
        <Icon className={cn("w-3.5 h-3.5", meta.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-black text-text truncate group-hover:text-brand-500 transition-colors">
          {result.title}
        </p>
        {snippet && (
          <p className="text-[11px] text-muted font-medium line-clamp-1 mt-0.5">
            {snippet}
          </p>
        )}
      </div>
      <span
        className={cn(
          "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md shrink-0 self-start mt-0.5",
          meta.bg,
          meta.color,
        )}
      >
        {meta.label}
      </span>
    </Link>
  );
}

export default function Search({ placeholder = "Search…", className }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!containerRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced search
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setResults([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    const id = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/v1/search?q=${encodeURIComponent(term)}&limit=6`,
        );
        const data = await res.json();
        setResults(data.results || []);
        setOpen(true);
        setActiveIndex(-1);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(id);
  }, [q]);

  const handleKeyDown = useCallback(
    (e) => {
      if (!open) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, -1));
      } else if (e.key === "Enter") {
        if (activeIndex >= 0 && results[activeIndex]) {
          router.push(results[activeIndex].href);
          setOpen(false);
          setQ("");
        } else if (q.trim()) {
          router.push(`/search?q=${encodeURIComponent(q.trim())}`);
          setOpen(false);
          setQ("");
        }
      } else if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    },
    [open, results, activeIndex, q, router],
  );

  const handleClose = () => {
    setQ("");
    setResults([]);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Input */}
      <div className="relative flex items-center">
        <FaSearch className="absolute left-3.5 text-muted text-sm pointer-events-none" />
        <input
          ref={inputRef}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={placeholder}
          aria-label="Search site content"
          aria-autocomplete="list"
          aria-expanded={open}
          role="combobox"
          className="w-64 md:w-72 pl-10 pr-8 py-2 rounded-xl bg-surface border border-border/60 focus:border-brand-500 focus:outline-none text-sm font-medium text-text placeholder-muted transition-colors"
        />
        {loading ? (
          <FaSpinner className="absolute right-3 text-muted text-sm animate-spin pointer-events-none" />
        ) : q ? (
          <button
            onClick={handleClose}
            className="absolute right-3 text-muted hover:text-text transition-colors"
            aria-label="Clear search"
          >
            <FaTimes className="text-sm" />
          </button>
        ) : null}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-200 top-full mt-2 w-[380px] -left-12 md:left-0 rounded-2xl border border-border/60 bg-surface shadow-2xl shadow-black/20 overflow-hidden">
          {results.length > 0 ? (
            <>
              <div className="px-4 pt-3 pb-1">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted">
                  {results.length} result{results.length !== 1 ? "s" : ""} for
                  &ldquo;{q}&rdquo;
                </p>
              </div>
              <div className="divide-y divide-border/20 max-h-80 overflow-y-auto">
                {results.map((result, idx) => (
                  <ResultItem
                    key={result.id + result._type}
                    result={result}
                    isActive={idx === activeIndex}
                    onClick={() => {
                      setOpen(false);
                      setQ("");
                    }}
                  />
                ))}
              </div>
              <div className="border-t border-border/30 px-4 py-3">
                <Link
                  href={`/search?q=${encodeURIComponent(q)}`}
                  onClick={() => {
                    setOpen(false);
                    setQ("");
                  }}
                  className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-brand-500 hover:underline"
                >
                  <span>See all results for &ldquo;{q}&rdquo;</span>
                  <FaArrowRight className="text-[10px]" />
                </Link>
              </div>
            </>
          ) : !loading ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm font-black text-muted italic">
                No results for &ldquo;{q}&rdquo;
              </p>
              <p className="text-[11px] text-muted/70 mt-1 font-medium">
                Try different keywords
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
