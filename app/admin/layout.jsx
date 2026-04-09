"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/cn";

export default function AdminLayout({ children }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login?redirect=/admin");
    } else if (!loading && isAuthenticated && user?.role === "viewer") {
      // Basic protection: viewers shouldn't be in the admin area
      router.push("/");
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          <p className="text-muted font-bold animate-pulse">
            Initializing Admin Session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role === "viewer") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background text-text selection:bg-brand-500/30">
      {/* Sidebar */}
      <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-dvh overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-8 bg-surface/50 backdrop-blur-md border-b border-border sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black uppercase italic tracking-tighter text-brand-500">
              Liberia Digital <span className="text-text">Insights</span>
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold leading-none">
                {user?.first_name} {user?.last_name}
              </span>
              <span className="text-[10px] uppercase font-black tracking-widest text-brand-500">
                {user?.role}
              </span>
            </div>
            <div className="h-10 w-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-black border-2 border-surface shadow-lg">
              {user?.first_name?.[0]}
              {user?.last_name?.[0]}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-surface/20">
          <div className="mx-auto max-w-7xl animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
