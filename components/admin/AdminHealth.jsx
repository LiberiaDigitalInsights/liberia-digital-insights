"use client";

import React, { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaSync,
  FaNewspaper,
  FaMicrophone,
  FaCalendar,
  FaLightbulb,
  FaUsers,
  FaArchive,
  FaEnvelope,
  FaUserPlus,
  FaShieldAlt,
  FaHourglass,
} from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { apiRequest } from "@/hooks/useBackendApi";
import { cn } from "@/lib/cn";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

// ─── Sub-components ──────────────────────────────────────────────────────────

const MetricRow = ({ label, value, color = "text-text", suffix = "" }) => (
  <div className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
    <span className="text-xs font-bold text-muted uppercase tracking-widest">
      {label}
    </span>
    <span className={cn("text-sm font-black italic", color)}>
      {value ?? "—"}
      {suffix}
    </span>
  </div>
);

const StatusBar = ({ label, count, total, color }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
        <span className="text-muted">{label}</span>
        <span className="text-text">
          {count} <span className="text-muted">({pct}%)</span>
        </span>
      </div>
      <div className="h-1.5 bg-muted/20 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            color,
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const ContentHealthCard = ({ title, icon: Icon, data, color }) => {
  const total = data?.total || 0;
  return (
    <Card elevation="sm" className="border-border/50 bg-surface/50">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "p-2.5 rounded-xl",
              color.replace("text-", "bg-") + "/10",
            )}
          >
            <Icon className={cn("w-4 h-4", color)} />
          </div>
          <div>
            <CardTitle className="text-base font-black uppercase italic tracking-tight">
              {title}
            </CardTitle>
            <p className="text-[10px] text-muted font-bold uppercase tracking-widest">
              {total} total
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5 space-y-2.5">
        <StatusBar
          label="Published"
          count={data?.published || 0}
          total={total}
          color="bg-emerald-500"
        />
        <StatusBar
          label="Draft"
          count={data?.draft || 0}
          total={total}
          color="bg-slate-400"
        />
        {data?.pending > 0 && (
          <StatusBar
            label="Pending"
            count={data?.pending || 0}
            total={total}
            color="bg-amber-500"
          />
        )}
        {data?.archived > 0 && (
          <StatusBar
            label="Archived"
            count={data?.archived || 0}
            total={total}
            color="bg-rose-400"
          />
        )}
        {data?.upcoming !== undefined && (
          <StatusBar
            label="Upcoming"
            count={data?.upcoming || 0}
            total={total}
            color="bg-brand-500"
          />
        )}
        {data?.completed !== undefined && (
          <StatusBar
            label="Completed"
            count={data?.completed || 0}
            total={total}
            color="bg-purple-500"
          />
        )}
      </CardContent>
    </Card>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminHealth() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const data = await apiRequest("/analytics/health");
      setHealth(data);
      setLastRefresh(new Date());
    } catch (e) {
      console.error("Health fetch failed:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const PendingAlert = () => {
    const pending = health?.moderation?.pendingReviews || 0;
    if (pending === 0) return null;
    return (
      <div className="flex items-center gap-4 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5">
        <FaExclamationTriangle className="text-amber-500 w-5 h-5 shrink-0" />
        <div>
          <p className="text-sm font-black text-amber-500 italic">
            {pending} article{pending !== 1 ? "s" : ""} awaiting review
          </p>
          <p className="text-xs text-muted font-medium">
            Review and publish or reject these submissions.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black italic tracking-tighter uppercase text-text">
            Platform <span className="text-brand-500">Health</span>
          </h2>
          <p className="text-muted font-bold text-sm tracking-tight">
            System-wide content status, user metrics, and operational insights.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastRefresh && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
              Updated {lastRefresh.toLocaleTimeString()}
            </span>
          )}
          <Button
            onClick={fetchHealth}
            disabled={loading}
            variant="outline"
            className="flex items-center gap-2 rounded-xl font-black uppercase tracking-widest text-xs border-border/50 px-5"
          >
            <FaSync className={cn("w-3 h-3", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Alert Banner */}
      {!loading && health && <PendingAlert />}

      {/* Top Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Users",
            value: health?.users?.total,
            icon: FaUsers,
            color: "text-blue-500",
          },
          {
            label: "New (30d)",
            value: health?.users?.newLast30Days,
            icon: FaUserPlus,
            color: "text-brand-500",
          },
          {
            label: "Archived Items",
            value: health?.content?.totalArchived,
            icon: FaArchive,
            color: "text-amber-500",
          },
          {
            label: "Audit Events (30d)",
            value: health?.auditActivity?.eventsLast30Days,
            icon: FaShieldAlt,
            color: "text-purple-500",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card
            key={label}
            elevation="sm"
            className="border-border/50 bg-surface/50"
          >
            <CardContent className="p-5 flex items-center gap-4">
              <div
                className={cn(
                  "p-3 rounded-xl",
                  color.replace("text-", "bg-") + "/10",
                )}
              >
                <Icon className={cn("w-5 h-5", color)} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted">
                  {label}
                </p>
                {loading ? (
                  <div className="h-6 w-10 bg-muted/40 rounded animate-pulse mt-1" />
                ) : (
                  <p className="text-2xl font-black italic tracking-tighter text-text leading-none">
                    {value ?? 0}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Status Grid */}
      <div>
        <h3 className="text-xs font-black uppercase tracking-widest text-muted mb-4 pl-1 border-l-4 border-brand-500 pl-3">
          Content Status Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <Card
                key={i}
                elevation="sm"
                className="border-border/50 bg-surface/50 animate-pulse"
              >
                <CardContent className="p-5 space-y-3">
                  <div className="h-5 bg-muted/40 rounded w-1/2" />
                  <div className="h-3 bg-muted/30 rounded w-full" />
                  <div className="h-3 bg-muted/30 rounded w-3/4" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <ContentHealthCard
                title="Articles"
                icon={FaNewspaper}
                data={health?.content?.articles}
                color="text-blue-500"
              />
              <ContentHealthCard
                title="Podcasts"
                icon={FaMicrophone}
                data={health?.content?.podcasts}
                color="text-green-500"
              />
              <ContentHealthCard
                title="Events"
                icon={FaCalendar}
                data={health?.content?.events}
                color="text-purple-500"
              />
              <ContentHealthCard
                title="Insights"
                icon={FaLightbulb}
                data={health?.content?.insights}
                color="text-amber-500"
              />
            </>
          )}
        </div>
      </div>

      {/* Bottom Row: Users + Newsletter + Invitations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Health */}
        <Card elevation="sm" className="border-border/50 bg-surface/50">
          <CardHeader className="p-5 pb-2 border-b border-border/20">
            <CardTitle className="text-base font-black uppercase italic tracking-tight flex items-center gap-2">
              <FaUsers className="text-blue-500" /> User Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-1">
            {loading ? (
              <div className="space-y-2 animate-pulse">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-8 bg-muted/30 rounded" />
                ))}
              </div>
            ) : (
              <>
                <MetricRow label="Total Users" value={health?.users?.total} />
                <MetricRow
                  label="New (30 days)"
                  value={health?.users?.newLast30Days}
                  color="text-brand-500"
                />
                <MetricRow
                  label="Active (30 days)"
                  value={health?.users?.activeLast30Days}
                  color="text-emerald-500"
                />
              </>
            )}
          </CardContent>
        </Card>

        {/* Newsletter Health */}
        <Card elevation="sm" className="border-border/50 bg-surface/50">
          <CardHeader className="p-5 pb-2 border-b border-border/20">
            <CardTitle className="text-base font-black uppercase italic tracking-tight flex items-center gap-2">
              <FaEnvelope className="text-orange-500" /> Newsletter
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-1">
            {loading ? (
              <div className="space-y-2 animate-pulse">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-8 bg-muted/30 rounded" />
                ))}
              </div>
            ) : (
              <>
                <MetricRow
                  label="Total Subscribers"
                  value={health?.newsletter?.total}
                />
                <MetricRow
                  label="Active"
                  value={health?.newsletter?.active}
                  color="text-emerald-500"
                />
                <MetricRow
                  label="Unsubscribed"
                  value={health?.newsletter?.unsubscribed}
                  color="text-rose-500"
                />
              </>
            )}
          </CardContent>
        </Card>

        {/* Invitations Health */}
        <Card elevation="sm" className="border-border/50 bg-surface/50">
          <CardHeader className="p-5 pb-2 border-b border-border/20">
            <CardTitle className="text-base font-black uppercase italic tracking-tight flex items-center gap-2">
              <FaUserPlus className="text-brand-500" /> Invitations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-1">
            {loading ? (
              <div className="space-y-2 animate-pulse">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-8 bg-muted/30 rounded" />
                ))}
              </div>
            ) : (
              <>
                <MetricRow
                  label="Pending"
                  value={health?.invitations?.pending}
                  color="text-amber-500"
                />
                <MetricRow
                  label="Accepted"
                  value={health?.invitations?.accepted}
                  color="text-emerald-500"
                />
                <MetricRow
                  label="Expired"
                  value={health?.invitations?.expired}
                  color="text-rose-400"
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pending Review Attention */}
      {!loading && health?.moderation?.pendingReviews > 0 && (
        <Card elevation="sm" className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center">
                <FaHourglass className="w-4 h-4" />
              </div>
              <div>
                <p className="font-black text-text italic tracking-tight">
                  {health.moderation.pendingReviews} Article
                  {health.moderation.pendingReviews !== 1 ? "s" : ""} Pending
                  Review
                </p>
                <p className="text-xs text-muted font-medium">
                  These submissions are awaiting editorial approval.
                </p>
              </div>
            </div>
            <Badge
              variant="warning"
              className="font-black uppercase tracking-tighter text-[10px] shrink-0"
            >
              Action Required
            </Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
