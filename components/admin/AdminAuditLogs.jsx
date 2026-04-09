"use client";

import React, { useState, useCallback } from "react";
import {
  FaShieldAlt,
  FaUserShield,
  FaUserMinus,
  FaUserCheck,
  FaCog,
  FaHistory,
  FaSearch,
  FaSyncAlt,
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/Card";
import { useApi, apiRequest } from "@/hooks/useBackendApi";
import Badge from "@/components/ui/Badge";

// ── Constants ───────────────────────────────────────────────────────────────────

const ACTION_CONFIG = {
  DELETE_USER: {
    label: "User Deleted",
    icon: FaUserMinus,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  UPDATE_USER_ROLE: {
    label: "Role Changed",
    icon: FaUserShield,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  ENABLE_USER: {
    label: "Account Enabled",
    icon: FaUserCheck,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  DISABLE_USER: {
    label: "Account Disabled",
    icon: FaUserShield, // Using similar icon if needed or FaUserTimes
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  UPDATE_USER_BASICS: {
    label: "User Updated",
    icon: FaUserShield,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
  UPDATE_SETTINGS: {
    label: "Settings Modified",
    icon: FaCog,
    color: "text-brand-500",
    bg: "bg-brand-500/10",
  },
};

// ── Helpers ─────────────────────────────────────────────────────────────────────

function formatFullDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

// ── Audit Row ────────────────────────────────────────────────────────────────────

function AuditRow({ log, index }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = ACTION_CONFIG[log.action] || {
    label: log.action,
    icon: FaHistory,
    color: "text-muted",
    bg: "bg-muted/10",
  };
  const Icon = cfg.icon;

  const actorName = log.actor
    ? `${log.actor.first_name || ""} ${log.actor.last_name || ""}`.trim() ||
      log.actor.email
    : "System / Removed User";

  return (
    <div
      className="group flex flex-col border-b border-border/20 last:border-0"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div
        className="flex items-start gap-4 px-6 py-5 hover:bg-surface/60 transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Icon */}
        <div
          className={`mt-0.5 h-10 w-10 shrink-0 rounded-xl ${cfg.bg} flex items-center justify-center ${cfg.color} transition-transform group-hover:scale-110 duration-300`}
        >
          <Icon className="text-base" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${cfg.bg} ${cfg.color}`}
            >
              {cfg.label}
            </span>
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">
              {formatFullDate(log.created_at)}
            </span>
          </div>
          <p className="text-sm text-text font-medium leading-tight mb-1">
            <span className="font-black italic text-brand-500">
              {actorName}
            </span>{" "}
            performed action on{" "}
            <span className="font-bold text-text/80">{log.target_type}</span>
            {log.target_id && (
              <span className="bg-muted/10 px-1.5 py-0.5 rounded ml-1 text-[10px] font-mono">
                {log.target_id}
              </span>
            )}
          </p>
          {log.ip_address && (
            <p className="text-[10px] font-mono text-muted/60">
              IP: {log.ip_address}
            </p>
          )}
        </div>

        {/* Toggle */}
        <button className="mt-2 text-muted/30 group-hover:text-muted transition-colors">
          {expanded ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      {/* Expanded Metadata */}
      {expanded && (
        <div className="px-6 pb-6 pt-2 bg-muted/5 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-surface border border-border/40 rounded-xl p-4 overflow-x-auto">
            <div className="flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest text-muted">
              <FaInfoCircle className="text-brand-500" /> Event Metadata
            </div>
            <pre className="text-xs font-mono text-text/80 whitespace-pre-wrap">
              {JSON.stringify(log.metadata, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────────

export default function AdminAuditLogs() {
  const [page, setPage] = useState(1);
  const [activeAction, setActiveAction] = useState("all");
  const [key, setKey] = useState(0);
  const limit = 15;

  const fetchLogs = useCallback(
    () =>
      apiRequest(
        `/analytics/audit?limit=${limit}&page=${page}&action=${activeAction}`,
      ),
    [page, activeAction, key],
  );

  const { data: result, loading } = useApi(fetchLogs, [
    page,
    activeAction,
    key,
  ]);

  const logs = result?.logs || [];
  const pagination = result?.pagination || { page: 1, total: 0, pages: 1 };

  const handleRefresh = () => setKey((k) => k + 1);

  const handleActionChange = (action) => {
    setActiveAction(action);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-rose-500/10 text-rose-500">
            Security & Compliance
          </span>
          <h2 className="text-4xl font-black italic tracking-tighter uppercase text-text">
            Audit <span className="text-rose-500">Logs</span>
          </h2>
          <p className="text-muted font-bold text-sm tracking-tight">
            A permanent immutable record of all sensitive administrative
            actions.
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

      <Card className="bg-surface border-border/50 overflow-hidden">
        {/* Filter Bar */}
        <div className="flex items-center gap-4 p-4 border-b border-border/30 overflow-x-auto custom-scrollbar">
          <div className="flex items-center gap-2">
            <FaSearch className="text-muted text-xs shrink-0" />
            <select
              value={activeAction}
              onChange={(e) => handleActionChange(e.target.value)}
              className="bg-transparent text-[10px] font-black uppercase tracking-widest text-text outline-none focus:ring-0 cursor-pointer"
            >
              <option value="all">All Actions</option>
              {Object.keys(ACTION_CONFIG).map((key) => (
                <option key={key} value={key}>
                  {ACTION_CONFIG[key].label}
                </option>
              ))}
            </select>
          </div>

          {!loading && pagination.total > 0 && (
            <span className="ml-auto shrink-0 px-3 py-1 rounded-full bg-muted/10 text-[10px] font-black text-muted uppercase tracking-widest">
              {pagination.total} events logged
            </span>
          )}
        </div>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-start gap-4 animate-pulse">
                  <div className="h-10 w-10 rounded-xl bg-muted/20 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 bg-muted/20 rounded" />
                    <div className="h-4 w-full bg-muted/10 rounded" />
                    <div className="h-2 w-24 bg-muted/5 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="py-20 text-center">
              <FaShieldAlt className="w-8 h-8 mx-auto text-muted/30 mb-4" />
              <p className="text-sm font-black italic uppercase tracking-widest text-muted">
                Clean Slate
              </p>
              <p className="text-xs text-muted/60 font-medium mt-1">
                No sensitive actions have been recorded for this filter.
              </p>
            </div>
          ) : (
            <div>
              {logs.map((log, i) => (
                <AuditRow key={log.id} log={log} index={i} />
              ))}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between border-t border-border/20 px-6 py-4 bg-muted/5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-xl border border-border/50 text-[10px] font-black uppercase tracking-widest text-muted hover:text-text hover:bg-surface disabled:opacity-30 transition-all"
                    >
                      Prev
                    </button>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === pagination.pages}
                      className="px-4 py-2 rounded-xl border border-border/50 text-[10px] font-black uppercase tracking-widest text-muted hover:text-text hover:bg-surface disabled:opacity-30 transition-all"
                    >
                      Next
                    </button>
                  </div>
                  <div className="text-[10px] font-black uppercase text-muted tracking-widest italic">
                    Log Page {page} / {pagination.pages}
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
