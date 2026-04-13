"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaHome,
  FaNewspaper,
  FaMicrophone,
  FaCalendar,
  FaUsers,
  FaGraduationCap,
  FaChartBar,
  FaCog,
  FaChevronLeft,
  FaChevronRight,
  FaLightbulb,
  FaBullhorn,
  FaEnvelope,
  FaSignOutAlt,
  FaImages,
  FaLock,
  FaClock,
  FaShieldAlt,
  FaUserPlus,
  FaHeartbeat,
  FaFileExport,
} from "react-icons/fa";
import { useAuth } from "@/hooks/useBackendApi";
import { cn } from "@/lib/cn";

const AdminSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const role = user?.role || "viewer";

  const allTabs = [
    { id: "dashboard", label: "Dashboard", href: "/admin", icon: FaHome },
    {
      id: "articles",
      label: "Articles",
      href: "/admin/articles",
      icon: FaNewspaper,
    },
    {
      id: "insights",
      label: "Insights",
      href: "/admin/insights",
      icon: FaLightbulb,
    },
    {
      id: "podcasts",
      label: "Podcasts",
      href: "/admin/podcasts",
      icon: FaMicrophone,
    },
    { id: "events", label: "Events", href: "/admin/events", icon: FaCalendar },
    { id: "gallery", label: "Gallery", href: "/admin/gallery", icon: FaImages },
    {
      id: "talents",
      label: "Talent Hub",
      href: "/admin/talents",
      icon: FaUsers,
    },
    {
      id: "training",
      label: "Training",
      href: "/admin/training",
      icon: FaGraduationCap,
    },
    {
      id: "advertisements",
      label: "Ads",
      href: "/admin/ads",
      icon: FaBullhorn,
    },
    {
      id: "newsletter",
      label: "Newsletter",
      href: "/admin/newsletter",
      icon: FaEnvelope,
    },
    {
      id: "analytics",
      label: "Analytics",
      href: "/admin/analytics",
      icon: FaChartBar,
    },
    {
      id: "activity",
      label: "Activity",
      href: "/admin/activity",
      icon: FaClock,
    },
    {
      id: "audit",
      label: "Audit Logs",
      href: "/admin/audit",
      icon: FaShieldAlt,
    },
    {
      id: "health",
      label: "Platform Health",
      href: "/admin/health",
      icon: FaHeartbeat,
    },
    {
      id: "exports",
      label: "Data Exports",
      href: "/admin/exports",
      icon: FaFileExport,
    },
    { id: "users", label: "Manage Users", href: "/admin/users", icon: FaUsers },
    {
      id: "invitations",
      label: "Invitations",
      href: "/admin/invitations",
      icon: FaUserPlus,
    },
    {
      id: "account",
      label: "My Account",
      href: "/admin/account",
      icon: FaLock,
    },
    { id: "settings", label: "Settings", href: "/admin/settings", icon: FaCog },
  ];

  const rolePermissions = {
    admin: allTabs.map((t) => t.id),
    editor: [
      "dashboard",
      "articles",
      "insights",
      "podcasts",
      "events",
      "gallery",
      "talents",
      "training",
      "newsletter",
      "activity",
      "exports",
      "account",
    ],
    moderator: [
      "dashboard",
      "articles",
      "insights",
      "podcasts",
      "events",
      "gallery",
      "talents",
      "activity",
      "account",
    ],
    viewer: ["dashboard", "articles", "insights", "podcasts", "account"],
  };

  const allowedIds = rolePermissions[role] || rolePermissions.viewer;
  const menuItems = allTabs.filter((t) => allowedIds.includes(t.id));

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div
      className={cn(
        "bg-surface border-r border-border transition-all duration-300 flex flex-col h-dvh sticky top-0 z-40",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-border">
        {!isCollapsed && (
          <h2 className="text-lg font-bold text-text truncate">Admin Panel</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted hover:text-text"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                    active
                      ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                      : "hover:bg-brand-500/5 text-muted hover:text-brand-500",
                  )}
                  title={isCollapsed ? item.label : ""}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 shrink-0",
                      active ? "text-white" : "group-hover:text-brand-500",
                    )}
                  />
                  {!isCollapsed && (
                    <span className="text-sm font-semibold truncate">
                      {item.label}
                    </span>
                  )}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-text text-surface text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                      {item.label}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-rose-500 hover:bg-rose-500/5",
            isCollapsed && "justify-center",
          )}
          title={isCollapsed ? "Logout" : ""}
        >
          <FaSignOutAlt className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="text-sm font-bold">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
