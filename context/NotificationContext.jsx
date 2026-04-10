"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { supabaseClient as supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch initial notifications
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      const { data, error, count } = await supabase
        .from("notifications")
        .select("*", { count: "exact" })
        .or(`user_id.eq.${user.id},user_id.is.null`)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      setNotifications(data || []);

      // Calculate unread from full set if possible, or just fetch count
      const { count: unread } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false)
        .or(`user_id.eq.${user.id},user_id.is.null`);

      setUnreadCount(unread || 0);
    } catch (err) {
      console.error("[NotificationContext] Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  // Set up real-time subscription
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    fetchNotifications();

    const channel = supabase
      .channel("admin-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`, // Specific to user
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev].slice(0, 50));
          setUnreadCount((prev) => prev + 1);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          // Broader filter for broadcast (user_id is null)
          // Note: Supabase realtime filters are limited. We might need logic here.
        },
        (payload) => {
          if (!payload.new.user_id) {
            setNotifications((prev) => [payload.new, ...prev].slice(0, 50));
            setUnreadCount((prev) => prev + 1);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isAuthenticated, fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("[NotificationContext] Mark read error:", err);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("is_read", false)
        .or(`user_id.eq.${user.id},user_id.is.null`);

      if (error) throw error;

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("[NotificationContext] Mark all read error:", err);
    }
  };

  const clearAll = async () => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .or(`user_id.eq.${user.id},user_id.is.null`);

      if (error) throw error;

      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error("[NotificationContext] Clear all error:", err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        clearAll,
        refresh: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
}
