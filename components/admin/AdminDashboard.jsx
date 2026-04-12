"use client";

import React from "react";
import {
  FaNewspaper,
  FaMicrophone,
  FaCalendar,
  FaUsers,
  FaPlus,
  FaArrowRight,
  FaLightbulb,
  FaEnvelope,
  FaBullhorn,
  FaChartBar,
  FaGraduationCap,
} from "react-icons/fa";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAnalyticsStats, useRecentActivity } from "@/hooks/useBackendApi";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { cn } from "@/lib/cn";
import { FaBell, FaBellSlash } from "react-icons/fa";

const StatCard = ({ title, value, icon: Icon, color, change, loading }) => {
  return (
    <Card
      elevation="sm"
      className="relative overflow-hidden group hover:border-brand-500/50 transition-colors"
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between transition-transform duration-300 group-hover:translate-x-1">
          <div className="space-y-2">
            <p className="text-xs font-black uppercase tracking-widest text-muted">
              {title}
            </p>
            {loading ? (
              <div className="h-8 w-16 bg-muted animate-pulse rounded" />
            ) : (
              <p className="text-3xl font-black italic tracking-tighter text-text leading-none">
                {value ?? 0}
              </p>
            )}
            {change && (
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-green-500/10 text-green-500">
                  {change}
                </span>
                <span className="text-[10px] text-muted font-bold uppercase tracking-tight">
                  vs last month
                </span>
              </div>
            )}
          </div>
          <div
            className={cn("p-4 rounded-2xl bg-opacity-10 shadow-inner", color)}
          >
            <Icon className={cn("w-6 h-6", color.replace("bg-", "text-"))} />
          </div>
        </div>
      </CardContent>
      <div
        className={cn(
          "absolute bottom-0 left-0 h-1 transition-all duration-300 w-0 group-hover:w-full opacity-50",
          color,
        )}
      />
    </Card>
  );
};

const QuickAction = ({ title, icon: Icon, href }) => (
  <Link
    href={href}
    className="flex flex-col items-center justify-center p-6 rounded-2xl bg-surface border border-border hover:border-brand-500 hover:bg-brand-500/5 transition-all duration-300 group text-center"
  >
    <div className="p-4 rounded-full bg-muted group-hover:bg-brand-500 transition-colors mb-4 group-hover:shadow-lg group-hover:shadow-brand-500/20">
      <Icon className="w-5 h-5 text-muted group-hover:text-white transition-colors" />
    </div>
    <span className="text-sm font-black uppercase tracking-tighter italic group-hover:text-brand-500 transition-colors">
      {title}
    </span>
  </Link>
);

export default function AdminDashboard() {
  const { data: stats, loading: statsLoading } = useAnalyticsStats();
  const { data: activityData, loading: activityLoading } = useRecentActivity();
  const {
    subscription,
    isSupported,
    loading: pushLoading,
    permission,
    subscribe,
    unsubscribe,
  } = usePushNotifications();

  const handlePushToggle = async () => {
    if (subscription) {
      await unsubscribe();
    } else {
      try {
        await subscribe();
      } catch (err) {
        alert("Failed to enable notifications. Please check site permissions.");
      }
    }
  };

  const statCards = [
    {
      title: "Articles",
      value: stats?.articles,
      icon: FaNewspaper,
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      title: "Podcasts",
      value: stats?.podcasts,
      icon: FaMicrophone,
      color: "bg-green-500",
      change: "+8%",
    },
    {
      title: "Events",
      value: stats?.events,
      icon: FaCalendar,
      color: "bg-purple-500",
      change: "+15%",
    },
    {
      title: "Active Users",
      value: stats?.users,
      icon: FaUsers,
      color: "bg-orange-500",
      change: "+23%",
    },
  ];

  const recentActivity = Array.isArray(activityData) ? activityData : [];

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase text-text">
            Dashboard <span className="text-brand-500">Overview</span>
          </h2>
          <p className="text-muted font-bold text-sm tracking-tight">
            Welcome back! Here's a snapshot of the Liberia Digital Insights
            ecosystem.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {isSupported && (
            <button
              onClick={handlePushToggle}
              disabled={pushLoading || permission === "denied"}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 border shadow-sm",
                subscription
                  ? "bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20"
                  : "bg-surface text-muted border-border hover:border-brand-500 hover:text-brand-500",
                permission === "denied" &&
                  "opacity-50 cursor-not-allowed grayscale",
              )}
            >
              {pushLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
              ) : subscription ? (
                <FaBell className="w-3.5 h-3.5" />
              ) : (
                <FaBellSlash className="w-3.5 h-3.5" />
              )}
              {permission === "denied"
                ? "Notifications Blocked"
                : subscription
                  ? "Live Alerts Active"
                  : "Enable Push Alerts"}
            </button>
          )}
          <Link
            href="/admin/articles/new"
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-500 text-white text-sm font-black uppercase tracking-widest shadow-lg shadow-brand-500/20 hover:scale-105 transition-transform"
          >
            <FaPlus className="w-3 h-3" />
            New Article
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} loading={statsLoading} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card
          elevation="sm"
          className="xl:col-span-2 border-border/50 bg-surface/50"
        >
          <CardHeader className="p-6 border-b border-border/50 bg-muted/20">
            <div className="flex items-center justify-between w-full">
              <CardTitle className="text-lg font-black uppercase italic tracking-tighter">
                Recent Activity
              </CardTitle>
              <Link
                href="/admin/activity"
                className="text-xs font-black text-brand-500 hover:underline uppercase tracking-widest"
              >
                View All
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/30">
              {activityLoading ? (
                [...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="p-5 flex items-center gap-4 animate-pulse"
                  >
                    <div className="w-2 h-2 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/3" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))
              ) : recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="p-5 flex items-start gap-4 hover:bg-muted/10 transition-colors group"
                  >
                    <div
                      className={cn(
                        "w-2 h-2 mt-2 rounded-full",
                        activity.type === "article"
                          ? "bg-blue-500"
                          : activity.type === "user"
                            ? "bg-orange-500"
                            : activity.type === "podcast"
                              ? "bg-green-500"
                              : "bg-purple-500",
                      )}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-text mb-0.5 group-hover:text-brand-500 transition-colors">
                        {activity.message}
                      </p>
                      <p className="text-xs text-muted font-medium line-clamp-1 italic">
                        {activity.detail}
                      </p>
                    </div>
                    <time className="text-[10px] font-black text-muted uppercase tracking-widest bg-muted/30 px-2 py-1 rounded">
                      {new Date(activity.time).toLocaleDateString()}
                    </time>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-muted italic font-medium">
                  No recent activity found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Sidebar */}
        <section className="space-y-6">
          <h3 className="text-lg font-black uppercase italic tracking-tighter pl-1 border-l-4 border-brand-500">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <QuickAction
              title="Articles"
              icon={FaNewspaper}
              href="/admin/articles"
            />
            <QuickAction
              title="Insights"
              icon={FaLightbulb}
              href="/admin/insights"
            />
            <QuickAction
              title="Podcasts"
              icon={FaMicrophone}
              href="/admin/podcasts"
            />
            <QuickAction
              title="Events"
              icon={FaCalendar}
              href="/admin/events"
            />
            <QuickAction
              title="Newsletter"
              icon={FaEnvelope}
              href="/admin/newsletter"
            />
            <QuickAction title="Ads" icon={FaBullhorn} href="/admin/ads" />
            <QuickAction
              title="Analytics"
              icon={FaChartBar}
              href="/admin/analytics"
            />
            <QuickAction
              title="Training"
              icon={FaGraduationCap}
              href="/admin/training"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
