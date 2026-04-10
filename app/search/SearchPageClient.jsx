"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FaNewspaper,
  FaMicrophone,
  FaCalendar,
  FaLightbulb,
  FaSearch,
  FaLayerGroup,
  FaTimesCircle,
} from "react-icons/fa";
import { H1, Muted } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";
import LazyImage from "@/components/LazyImage";
import Badge from "@/components/ui/Badge";

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

const TYPE_FILTERS = [
  { key: "all", label: "All", icon: FaLayerGroup },
  { key: "article", label: "Articles", icon: FaNewspaper },
  { key: "podcast", label: "Podcasts", icon: FaMicrophone },
  { key: "event", label: "Events", icon: FaCalendar },
  { key: "insight", label: "Insights", icon: FaLightbulb },
];

function ResultCard({ result }) {
  const meta = TYPE_META[result._type] || TYPE_META.article;
  const Icon = meta.icon;
  const snippet = result.excerpt || result.description || "";
  const date = result.published_at || result.date;
  const thumb = result.cover_image_url || result.thumbnail_url;

  return (
    <Link
      href={result.href}
      className="group flex gap-5 p-5 rounded-2xl border border-border/50 bg-surface hover:border-brand-500/50 hover:bg-brand-500/5 transition-all duration-200"
    >
      {thumb && (
        <div className="w-24 h-20 rounded-xl overflow-hidden shrink-0 bg-muted/20">
          <LazyImage
            src={thumb}
            alt={result.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              "text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 px-2 py-0.5 rounded-md",
              meta.bg,
              meta.color,
            )}
          >
            <Icon className="text-[9px]" /> {meta.label}
          </span>
          {result.category && (
            <Badge
              variant="outline"
              className="text-[9px] font-black uppercase tracking-tight border-border/50"
            >
              {result.category}
            </Badge>
          )}
        </div>
        <h3 className="font-black italic tracking-tight text-text group-hover:text-brand-500 transition-colors line-clamp-2 leading-snug">
          {result.title}
        </h3>
        {snippet && (
          <p className="text-sm text-muted line-clamp-2 font-medium leading-relaxed">
            {snippet}
          </p>
        )}
        {date && (
          <p className="text-[10px] font-bold text-muted/70 uppercase tracking-widest">
            {new Date(date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}
      </div>
    </Link>
  );
}

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const [q, setQ] = useState(initialQ);
  const [inputValue, setInputValue] = useState(initialQ);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeType, setActiveType] = useState("all");

  const fetchResults = async (query) => {
    if (!query || query.trim().length < 2) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(
        `/api/v1/search?q=${encodeURIComponent(query.trim())}&limit=20`,
      );
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQ) fetchResults(initialQ);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e) => {
    e.preventDefault();
    setQ(inputValue);
    setActiveType("all");
    fetchResults(inputValue);
    const url = new URL(window.location.href);
    url.searchParams.set("q", inputValue.trim());
    window.history.pushState({}, "", url);
  };

  const filteredResults = useMemo(() => {
    if (activeType === "all") return results;
    return results.filter((r) => r._type === activeType);
  }, [results, activeType]);

  const countByType = useMemo(() => {
    const counts = { all: results.length };
    Object.keys(TYPE_META).forEach((type) => {
      counts[type] = results.filter((r) => r._type === type).length;
    });
    return counts;
  }, [results]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-20 space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <H1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
          Search <span className="text-brand-500">Results</span>
        </H1>
        <Muted className="font-bold text-sm">
          Find articles, podcasts, events, and insights across the platform.
        </Muted>
      </div>

      {/* Search form */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm" />
          <input
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search articles, podcasts, events..."
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-surface border border-border/60 focus:border-brand-500 focus:outline-none text-sm font-bold text-text placeholder-muted transition-colors"
          />
        </div>
        <button
          type="submit"
          className="px-8 py-3.5 rounded-2xl bg-brand-500 text-white font-black uppercase tracking-widest text-xs hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20"
        >
          Search
        </button>
      </form>

      {/* Results area */}
      {hasSearched && (
        <>
          {/* Type filter tabs */}
          <div className="flex flex-wrap gap-2">
            {TYPE_FILTERS.map(({ key, label, icon: Icon }) => {
              const count = countByType[key] || 0;
              if (key !== "all" && count === 0) return null;
              return (
                <button
                  key={key}
                  onClick={() => setActiveType(key)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                    activeType === key
                      ? "bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/20"
                      : "bg-surface border-border/50 text-muted hover:border-brand-500/40 hover:text-text",
                  )}
                >
                  <Icon />
                  {label}
                  <span
                    className={cn(
                      "px-1.5 py-0.5 rounded-md text-[9px]",
                      activeType === key ? "bg-white/20" : "bg-muted/20",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {!loading && (
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted">
              {filteredResults.length} result
              {filteredResults.length !== 1 ? "s" : ""}
              {q && <> for &ldquo;{q}&rdquo;</>}
            </p>
          )}

          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-5 rounded-2xl border border-border/50 animate-pulse"
                >
                  <div className="w-24 h-20 rounded-xl bg-muted/40 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-muted/40 rounded w-1/5" />
                    <div className="h-5 bg-muted/40 rounded w-3/4" />
                    <div className="h-3 bg-muted/30 rounded w-full" />
                    <div className="h-3 bg-muted/30 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="space-y-3">
              {filteredResults.map((result) => (
                <ResultCard key={result.id + result._type} result={result} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center border-2 border-dashed border-border/50 rounded-3xl space-y-4">
              <FaTimesCircle className="text-5xl text-muted/30 mx-auto" />
              <p className="font-black italic text-xl text-text/60">
                No results found
              </p>
              <Muted className="font-medium text-sm">
                Try broader keywords or a different content type
              </Muted>
            </div>
          )}
        </>
      )}

      {/* Pre-search empty state */}
      {!hasSearched && (
        <div className="py-24 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto">
            <FaSearch className="text-brand-500 text-2xl" />
          </div>
          <p className="font-black italic text-xl text-text/60">
            What are you looking for?
          </p>
          <Muted className="font-medium text-sm">
            Enter keywords above to search across all content
          </Muted>
        </div>
      )}
    </div>
  );
}
