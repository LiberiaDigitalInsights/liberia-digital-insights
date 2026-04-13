"use client";

import React, { useState } from "react";
import {
  FaDownload,
  FaEnvelope,
  FaShieldAlt,
  FaUsers,
  FaNewspaper,
  FaFileCsv,
  FaHistory,
  FaInfoCircle,
} from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const ExportCard = ({
  title,
  description,
  icon: Icon,
  resource,
  hasDates = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const handleExport = async () => {
    setLoading(true);
    try {
      let url = `/api/v1/admin/export/${resource}`;
      const params = new URLSearchParams();
      if (hasDates && dateRange.start) params.append("start", dateRange.start);
      if (hasDates && dateRange.end) params.append("end", dateRange.end);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ldi_token")}`,
        },
      });

      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute(
        "download",
        `ldi-${resource}-${new Date().toISOString().split("T")[0]}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error(err);
      alert("Failed to export. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      elevation="sm"
      className="border-border/50 bg-surface/50 group hover:border-brand-500/30 transition-all"
    >
      <CardHeader className="p-6 pb-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-muted/20 flex items-center justify-center text-brand-500 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-black uppercase italic tracking-tighter">
              {title}
            </CardTitle>
            <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-0.5">
              CSV Format
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-4 space-y-6">
        <p className="text-xs text-muted font-medium leading-relaxed">
          {description}
        </p>

        {hasDates && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted pl-1">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
                className="w-full bg-muted/20 border-border rounded-lg text-xs font-bold px-3 h-10 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted pl-1">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
                className="w-full bg-muted/20 border-border rounded-lg text-xs font-bold px-3 h-10 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          </div>
        )}

        <Button
          onClick={handleExport}
          disabled={loading}
          className="w-full h-11 rounded-xl bg-brand-500 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />
          ) : (
            <FaDownload className="w-3 h-3" />
          )}
          {loading ? "Generating..." : "Generate Export"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default function AdminExportCenter() {
  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-4xl font-black italic tracking-tighter uppercase text-text">
          Data Export <span className="text-brand-500">Center</span>
        </h2>
        <p className="text-muted font-bold text-sm tracking-tight">
          One-click CSV reports for system compliance, analysis, and backups.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
        <ExportCard
          title="Newsletter Subscribers"
          description="A complete list of all portal subscribers including their email, status, and join date. Useful for external email campaigns or CRM sync."
          icon={FaEnvelope}
          resource="subscribers"
        />
        <ExportCard
          title="Security Audit Logs"
          description="Export administrative actions for security reviews or compliance audits. Includes user IDs, actions performed, and metadata."
          icon={FaShieldAlt}
          resource="audit-logs"
          hasDates={true}
        />
        <ExportCard
          title="User Directory"
          description="Detailed export of all system users, their roles, and account statuses. Essential for quarterly access reviews and permission audits."
          icon={FaUsers}
          resource="users"
        />
        <ExportCard
          title="Content Inventory"
          description="A snapshot of all articles, including their publication status, category, and slugs. Great for content auditing and SEO analysis."
          icon={FaNewspaper}
          resource="content"
        />
      </div>

      {/* Info Notice */}
      <div className="p-6 rounded-2xl bg-brand-500/5 border border-brand-500/10 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-500 shrink-0">
          <FaInfoCircle className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-black text-brand-500 uppercase tracking-tight italic">
            Confidential Data Handling
          </p>
          <p className="text-xs text-muted font-medium leading-relaxed">
            Exports contain sensitive PII (Personally Identifiable Information).
            Please ensure all downloaded files are stored securely and discarded
            according to your data retention policy. All export actions are
            logged for security oversight.
          </p>
        </div>
      </div>
    </div>
  );
}
