"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { changePassword, useBookmarks } from "@/hooks/useBackendApi";
import {
  FaUser,
  FaEnvelope,
  FaShieldAlt,
  FaClock,
  FaChartLine,
  FaBookmark,
  FaChevronRight,
  FaLock,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function ProfileClient() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { data: bookmarksData } = useBookmarks(
    { limit: 1 },
    { immediate: isAuthenticated },
  );
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // Password reset state
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordStatus, setPasswordStatus] = useState({
    type: "",
    message: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ type: "error", message: "Passwords do not match" });
      return;
    }

    setPasswordLoading(true);
    setPasswordStatus({ type: "", message: "" });

    try {
      await changePassword({
        currentPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordStatus({
        type: "success",
        message: "Password changed successfully!",
      });
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setPasswordStatus({
        type: "error",
        message: err.message || "Failed to change password",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: FaUser },
    { id: "security", label: "Security", icon: FaShieldAlt },
    { id: "activity", label: "Activity", icon: FaChartLine },
  ];

  return (
    <div className="min-h-screen bg-surface-50 pt-12 pb-24">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="mb-8 overflow-hidden rounded-2xl bg-surface shadow-xl ring-1 ring-black/5">
          <div className="h-32 bg-linear-to-r from-brand-600 to-brand-400"></div>
          <div className="relative px-8 pb-8">
            <div className="absolute -top-12 left-8">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-surface bg-brand-500 text-3xl font-black text-white shadow-lg uppercase italic">
                {user?.first_name?.charAt(0)}
              </div>
            </div>
            <div className="pt-16">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-text">
                    {user?.first_name} {user?.last_name}
                  </h1>
                  <p className="flex items-center gap-2 text-muted uppercase tracking-widest text-[10px] font-bold mt-1">
                    <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                    {user?.role} Account
                  </p>
                </div>
                {user?.role === "admin" && (
                  <button
                    onClick={() => router.push("/admin")}
                    className="flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-brand-600 hover:shadow-lg active:scale-95"
                  >
                    Manage Dashboard
                    <FaChevronRight className="text-xs" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                    activeTab === tab.id
                      ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
                      : "text-muted hover:bg-surface hover:text-text"
                  }`}
                >
                  <tab.icon
                    className={
                      activeTab === tab.id ? "text-white" : "text-brand-500"
                    }
                  />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl bg-surface p-8 shadow-xl ring-1 ring-black/5">
              {activeTab === "overview" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-3 border-b border-border pb-4">
                    <FaUser className="text-xl text-brand-500" />
                    <h2 className="text-xl font-bold">Account Overview</h2>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-xl border border-border bg-surface-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted">
                        First Name
                      </p>
                      <p className="mt-1 font-medium">{user?.first_name}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-surface-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted">
                        Last Name
                      </p>
                      <p className="mt-1 font-medium">{user?.last_name}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-surface-50 p-4 md:col-span-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-muted">
                            Email Address
                          </p>
                          <p className="mt-1 font-medium">{user?.email}</p>
                        </div>
                        <FaEnvelope className="text-muted opacity-20 text-2xl" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex flex-1 items-center gap-4 rounded-2xl bg-brand-50 p-6 ring-1 ring-brand-100">
                      <div className="rounded-xl bg-white p-3 shadow-sm">
                        <FaClock className="text-xl text-brand-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-600 opacity-70">
                          Member Since
                        </p>
                        <p className="text-lg font-bold">
                          {user?.created_at
                            ? new Date(user.created_at).toLocaleDateString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-1 items-center gap-4 rounded-2xl bg-yellow-50 p-6 ring-1 ring-yellow-100">
                      <div className="rounded-xl bg-white p-3 shadow-sm">
                        <FaBookmark className="text-xl text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-yellow-700 opacity-70">
                          Saved Items
                        </p>
                        <p className="text-lg font-bold">
                          {bookmarksData?.pagination?.total || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-3 border-b border-border pb-4">
                    <FaShieldAlt className="text-xl text-brand-500" />
                    <h2 className="text-xl font-bold">Account Security</h2>
                  </div>

                  <form
                    onSubmit={handlePasswordChange}
                    className="max-w-md space-y-6"
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            required
                            value={passwordForm.oldPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                oldPassword: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-border bg-surface-50 px-4 py-3 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 pl-10"
                            placeholder="••••••••"
                          />
                          <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted opacity-40" />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            required
                            value={passwordForm.newPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                newPassword: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-border bg-surface-50 px-4 py-3 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 pl-10"
                            placeholder="Create a new password"
                          />
                          <FaShieldAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted opacity-40" />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            required
                            value={passwordForm.confirmPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                confirmPassword: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-border bg-surface-50 px-4 py-3 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 pl-10"
                            placeholder="Repeat your new password"
                          />
                          <FaShieldAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted opacity-40" />
                        </div>
                      </div>
                    </div>

                    {passwordStatus.message && (
                      <div
                        className={`rounded-xl p-4 text-sm font-medium ${
                          passwordStatus.type === "success"
                            ? "bg-green-50 text-green-700 ring-1 ring-green-100"
                            : "bg-red-50 text-red-700 ring-1 ring-red-100"
                        }`}
                      >
                        {passwordStatus.message}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="w-full rounded-xl bg-text py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-brand-600 disabled:opacity-50"
                    >
                      {passwordLoading ? "Updating..." : "Update Password"}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === "activity" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-3 border-b border-border pb-4">
                    <FaChartLine className="text-xl text-brand-500" />
                    <h2 className="text-xl font-bold">Recent Activity</h2>
                  </div>

                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="mb-4 rounded-full bg-brand-50 p-8">
                      <FaChartLine className="text-4xl text-brand-300" />
                    </div>
                    <h3 className="text-lg font-bold">
                      No activity data available yet
                    </h3>
                    <p className="mt-2 text-sm text-muted max-w-xs">
                      Once you start interacting with the platform, your
                      highlights will appear here.
                    </p>
                    <button
                      onClick={() => router.push("/")}
                      className="mt-8 text-sm font-bold text-brand-500 hover:underline"
                    >
                      Go back to browsing →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
