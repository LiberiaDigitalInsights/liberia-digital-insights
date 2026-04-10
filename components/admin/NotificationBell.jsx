"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FaBell,
  FaCheckDouble,
  FaTrashAlt,
  FaTimes,
  FaInfoCircle,
  FaExclamationTriangle,
  FaUserShield,
  FaHistory,
} from "react-icons/fa";
import { useNotifications } from "@/context/NotificationContext";
import { cn } from "@/lib/cn";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

const TYPE_ICONS = {
  SYSTEM: { icon: FaInfoCircle, color: "text-blue-500", bg: "bg-blue-500/10" },
  SECURITY: {
    icon: FaExclamationTriangle,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  USER: {
    icon: FaUserShield,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  CONTENT: {
    icon: FaHistory,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
};

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } =
    useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Target Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-2.5 rounded-full transition-all duration-300 hover:bg-muted-foreground/10 group",
          isOpen ? "bg-muted-foreground/10 text-brand-500" : "text-muted",
        )}
      >
        <FaBell
          className={cn(
            "text-xl group-hover:scale-110 transition-transform",
            unreadCount > 0 && "animate-pulse",
          )}
        />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white border-2 border-surface shadow-lg animate-in zoom-in">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 bg-surface border border-border rounded-2xl shadow-2xl shadow-black/20 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300 origin-top-right">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-surface/50 backdrop-blur-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-text italic">
              Notifications
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllAsRead}
                title="Mark all as read"
                className="p-1.5 rounded-lg hover:bg-muted text-muted hover:text-brand-500 transition-colors"
              >
                <FaCheckDouble className="text-xs" />
              </button>
              <button
                onClick={clearAll}
                title="Clear all"
                className="p-1.5 rounded-lg hover:bg-muted text-muted hover:text-rose-500 transition-colors"
              >
                <FaTrashAlt className="text-xs" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-muted text-muted hover:text-text transition-colors"
              >
                <FaTimes className="text-xs" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <FaBell className="w-8 h-8 mx-auto text-muted/20 mb-3" />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted">
                  all caught up
                </p>
              </div>
            ) : (
              notifications.map((n) => {
                const cfg = TYPE_ICONS[n.type] || TYPE_ICONS.SYSTEM;
                const Icon = cfg.icon;
                return (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (!n.is_read) markAsRead(n.id);
                    }}
                    className={cn(
                      "flex items-start gap-3 p-4 border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors cursor-pointer relative group",
                      !n.is_read && "bg-brand-500/5",
                    )}
                  >
                    <div
                      className={cn(
                        "mt-1 shrink-0 p-2 rounded-xl",
                        cfg.bg,
                        cfg.color,
                      )}
                    >
                      <Icon className="text-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-xs font-black text-text uppercase tracking-tight truncate pr-4">
                          {n.title}
                        </h4>
                        {!n.is_read && (
                          <span className="h-2 w-2 rounded-full bg-brand-500 shadow-sm shadow-brand-500/50 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-muted font-bold leading-normal mb-1">
                        {n.message}
                      </p>
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted/50">
                        {formatDistanceToNow(new Date(n.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-border bg-muted/10 text-center">
            <Link
              href="/admin/activity"
              onClick={() => setIsOpen(false)}
              className="block text-[10px] font-black uppercase tracking-widest text-brand-500 hover:text-brand-600 transition-colors"
            >
              View Activity Feed
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
