"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import {
  FaNewspaper,
  FaMicrophone,
  FaLightbulb,
  FaCalendar,
  FaUsers,
  FaFilter,
  FaArrowRight,
  FaClock,
  FaSyncAlt,
} from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/Card";
import { useApi } from "@/hooks/useBackendApi";
import { apiRequest } from "@/hooks/useBackendApi";

// ── Constants ───────────────────────────────────────────────────────────────────

const TYPE_CONFIG = {
  article: {
    label: "Article",
    icon: FaNewspaper,
    color: "text-brand-500",
    bg: "bg-brand-500/10",
    dot: "bg-brand-500",
  },
  podcast: {
    label: "Podcast",
    icon: FaMicrophone,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    dot: "bg-purple-500",
  },
  insight: {
    label: "Insight",
    icon: FaLightbulb,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    dot: "bg-amber-500",
  },
  event: {
    label: "Event",
    icon: FaCalendar,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
    dot: "bg-sky-500",
  },
  user: {
    label: "User",
    icon: FaUsers,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    dot: "bg-emerald-500",
  },
};

const FILTERS = [
  { key: "all", label: "All Activity" },
  { key: "article", label: "Articles" },
  { key: "podcast", label: "Podcasts" },
  { key: "insight", label: "Insights" },
  { key: "event", label: "Events" },
  { key: "user", label: "Users" },
];

// ── Helpers ─────────────────────────────────────────────────────────────────────

function timeAgo(dateStr) {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatFullDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Activity Row ─────────────────────────────────────────────────────────────────

function ActivityRow({ event, index }) {
  const cfg = TYPE_CONFIG[event.type] || TYPE_CONFIG.article;
  const Icon = cfg.icon;

  return (
    <div
      className="group flex items-start gap-4 px-6 py-4 hover:bg-surface/60 transition-colors border-b border-border/20 last:border-0"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* Icon */}
      <div
        className={`mt-0.5 h-9 w-9 shrink-0 rounded-xl ${cfg.bg} flex items-center justify-center ${cfg.color} transition-transform group-hover:scale-110 duration-300`}
      >
        <Icon className="text-sm" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-text leading-tight">
          {event.message}
        </p>
        {event.detail && (
          <p
            className="text-xs text-muted font-medium mt-0.5 truncate"
            title={event.detail}
          >
            {event.detail}
          </p>
        )}
        {event.meta && (
          <span className="inline-block mt-1 px-2 py-0.5 rounded-lg bg-muted/10 text-[10px] font-black uppercase tracking-wider text-muted">
            {event.meta}
          </span>
        )}
      </div>

      {/* Time + Link */}
      <div className="flex flex-col items-end gap-2 shrink-0 ml-2">
        <span
          className="text-[10px] font-bold text-muted uppercase tracking-widest"
          title={formatFullDate(event.time)}
        >
          {timeAgo(event.time)}
        </span>
        {event.href && (
          <Link
            href={event.href}
            className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-brand-500 hover:text-brand-400"
          >
            View <FaArrowRight className="w-2 h-2" />
          </Link>
        )}
      </div>
    </div>
  );
}

// ── Summary Cards ────────────────────────────────────────────────────────────────

function TypeSummaryCard({ typeKey, activities }) {
  const cfg = TYPE_CONFIG[typeKey];
  const Icon = cfg.icon;
  const count = activities.filter((a) => a.type === typeKey).length;

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-2xl ${cfg.bg} border border-transparent hover:border-border/30 transition-all`}
    >
      <div
        className={`h-10 w-10 rounded-xl bg-surface/50 flex items-center justify-center ${cfg.color}`}
      >
        <Icon className="text-base" />
      </div>
      <div>
        <p className="text-2xl font-black italic tracking-tighter text-text">
          {count}
        </p>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted">
          {cfg.label}s
        </p>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────────

export default function AdminActivity() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [key, setKey] = useState(0); // force re-fetch on refresh
  const limit = 10;

  const fetchActivity = useCallback(
    () =>
      apiRequest(
        `/analytics/activity?limit=${limit}&page=${page}&type=${activeFilter}`,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeFilter, page, key],
  );

  const { data: result, loading } = useApi(fetchActivity, [
    activeFilter,
    page,
    key,
  ]);

  const activities = result?.activities || [];
  const pagination = result?.pagination || {
    page: 1,
    total: 0,
    pages: 1,
    limit: 20,
  };

  const handleRefresh = () => setKey((k) => k + 1);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const scrollRef = React.useRef(null);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-8" ref={scrollRef}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-brand-500/10 text-brand-500">
            Live Feed
          </span>
          <h2 className="text-4xl font-black italic tracking-tighter uppercase text-text">
            Platform <span className="text-brand-500">Activity</span>
          </h2>
          <p className="text-muted font-bold text-sm tracking-tight">
            A real-time log of all content creation and user events across the
            platform.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-border/50 text-xs font-black uppercase tracking-widest text-muted hover:text-text hover:border-border transition-all disabled:opacity-40"
        >
          <FaSyncAlt className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Summary breakdown (only shown in "all" mode with data) */}
      {activeFilter === "all" && pagination.total > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.keys(TYPE_CONFIG).map((t) => (
            <button
              key={t}
              onClick={() => handleFilterChange(t)}
              className="text-left transition-transform hover:scale-105 active:scale-95"
            >
              <TypeSummaryCard typeKey={t} activities={activities} />
            </button>
          ))}
        </div>
      )}

      {/* Filter Tabs + Feed */}
      <Card className="bg-surface border-border/50 overflow-hidden">
        {/* Filter Bar */}
        <div className="flex items-center gap-1 p-4 border-b border-border/30 overflow-x-auto custom-scrollbar">
          <FaFilter className="text-muted text-xs shrink-0 mr-1" />
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => handleFilterChange(f.key)}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shrink-0 transition-all ${
                activeFilter === f.key
                  ? "bg-brand-500 text-white shadow-lg shadow-brand-500/25"
                  : "text-muted hover:text-text hover:bg-surface/80"
              }`}
            >
              {f.label}
            </button>
          ))}
          {!loading && pagination.total > 0 && (
            <span className="ml-auto shrink-0 px-3 py-1 rounded-full bg-muted/10 text-[10px] font-black text-muted uppercase tracking-widest">
              {pagination.total} total events
            </span>
          )}
        </div>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="h-9 w-9 rounded-xl bg-muted/20 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-2/3 bg-muted/20 rounded" />
                    <div className="h-2 w-1/2 bg-muted/10 rounded" />
                  </div>
                  <div className="h-3 w-12 bg-muted/10 rounded shrink-0" />
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="py-20 text-center">
              <FaClock className="w-8 h-8 mx-auto text-muted/30 mb-4" />
              <p className="text-sm font-black italic uppercase tracking-widest text-muted">
                No activity yet
              </p>
              <p className="text-xs text-muted/60 font-medium mt-1">
                Content events will appear here as they happen.
              </p>
            </div>
          ) : (
            <div>
              {activities.map((event, i) => (
                <ActivityRow key={event.id || i} event={event} index={i} />
              ))}

              {/* Pagination UI */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between border-t border-border/20 px-6 py-4 bg-muted/5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-xl border border-border/50 text-[10px] font-black uppercase tracking-widest text-muted hover:text-text hover:bg-surface disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === pagination.pages}
                      className="px-4 py-2 rounded-xl border border-border/50 text-[10px] font-black uppercase tracking-widest text-muted hover:text-text hover:bg-surface disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                    >
                      Next
                    </button>
                  </div>

                  <div className="hidden sm:flex items-center gap-1.5">
                    {[...Array(pagination.pages)].map((_, i) => {
                      const p = i + 1;
                      // Only show current, first, last, and relative pages if there are many
                      if (
                        pagination.pages > 7 &&
                        p !== 1 &&
                        p !== pagination.pages &&
                        Math.abs(p - page) > 1
                      ) {
                        if (Math.abs(p - page) === 2) {
                          return (
                            <span key={p} className="text-muted px-1">
                              ...
                            </span>
                          );
                        }
                        return null;
                      }
                      return (
                        <button
                          key={p}
                          onClick={() => handlePageChange(p)}
                          className={`h-8 w-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${
                            page === p
                              ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
                              : "text-muted hover:text-text hover:bg-surface"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>

                  <div className="text-[10px] font-bold text-muted uppercase tracking-widest">
                    Page {page} of {pagination.pages}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
