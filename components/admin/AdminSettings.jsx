"use client";

import React, { useState, useEffect } from "react";
import {
  FaSave,
  FaUndo,
  FaCog,
  FaGlobe,
  FaSearch,
  FaEnvelope,
  FaShieldAlt,
  FaRocket,
} from "react-icons/fa";
import {
  useSettings,
  updateSettings,
  changePassword,
  testSmtp,
} from "@/hooks/useBackendApi";
import { useToast } from "@/context/ToastContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Badge from "@/components/ui/Badge";

const DEFAULTS = {
  siteName: "Liberia Digital Insights",
  siteDescription: "Your gateway to Liberia's digital transformation",
  contactEmail: "contact@liberiadigitalinsights.com",
  adminEmail: "admin@liberiadigitalinsights.com",
  metaDescription:
    "Your premier destination for technology news, insights, and innovation stories from Liberia and beyond.",
  keywords: "technology, liberia, digital transformation, innovation",
  googleAnalyticsId: "",
  facebook: "https://facebook.com/LiberiaDigitalInsights",
  twitter: "https://x.com/LiberiaDigitalInsights",
  linkedin: "https://linkedin.com/company/LiberiaDigitalInsights",
  youtube: "https://youtube.com/@LiberiaDigitalInsights",
  smtpHost: "",
  smtpPort: "587",
  smtpUser: "",
  smtpPassword: "",
  smtpSecure: false,
  enableCaching: true,
  imageOptimization: true,
  analyticsTracking: false,
  lazyLoading: true,
  enable2FA: false,
  sessionTimeout: "24",
  maxLoginAttempts: "5",
};

const ToggleSwitch = ({ checked, onChange, label, description }) => (
  <div className="flex items-center justify-between py-1">
    <div>
      <p className="text-sm font-bold text-text">{label}</p>
      {description && (
        <p className="text-[11px] text-muted mt-0.5">{description}</p>
      )}
    </div>
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500/50 ${
        checked ? "bg-brand-500 shadow-lg shadow-brand-500/30" : "bg-border"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

function SectionCard({
  title,
  icon: Icon,
  children,
  iconClass = "text-brand-500",
}) {
  return (
    <Card className="bg-surface border-border/50 hover:shadow-md hover:shadow-black/5 transition-shadow">
      <CardHeader className="pb-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-xl bg-muted/30 flex items-center justify-center ${iconClass}`}
          >
            <Icon className="text-sm" />
          </div>
          <CardTitle className="text-sm font-black italic uppercase tracking-tighter">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-5 space-y-5">{children}</CardContent>
    </Card>
  );
}

function FieldGroup({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black uppercase tracking-widest text-muted block">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function AdminSettings() {
  const { showToast } = useToast();
  const { data: remoteSettings, loading: loadingSettings } = useSettings();
  const [settings, setSettings] = useState(DEFAULTS);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("general");
  const [initialized, setInitialized] = useState(false);

  // Merge: defaults → localStorage → backend (backend wins if available)
  useEffect(() => {
    if (loadingSettings) return; // wait until backend query resolves
    try {
      const saved = JSON.parse(
        localStorage.getItem("ldi_admin_settings") || "{}",
      );
      const merged = { ...DEFAULTS, ...saved, ...(remoteSettings || {}) };
      setSettings(merged);
    } catch {
      setSettings((prev) => ({ ...prev, ...(remoteSettings || {}) }));
    }
    setInitialized(true);
  }, [loadingSettings, remoteSettings]);

  const update = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const toggle = (field) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      localStorage.setItem("ldi_admin_settings", JSON.stringify(settings));
      await updateSettings(settings); // No more swallowed catch here
      showToast({
        title: "Settings Saved",
        description: "All changes have been applied.",
        variant: "success",
      });
      setHasChanges(false);
    } catch (err) {
      console.error("Save error:", err);
      showToast({
        title: "Save Failed",
        description: err.message || "Could not persist settings to the cloud.",
        variant: "danger",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!confirm("Reset all settings to their defaults?")) return;
    setSettings(DEFAULTS);
    setHasChanges(true);
    showToast({
      title: "Reset Complete",
      description: "Save to apply the defaults.",
      variant: "info",
    });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passData.newPass !== passData.confirm) {
      showToast({
        title: "Mismatch",
        description: "New passwords do not match.",
        variant: "danger",
      });
      return;
    }
    if (passData.newPass.length < 6) {
      showToast({
        title: "Too Short",
        description: "Password must be at least 6 characters.",
        variant: "danger",
      });
      return;
    }
    setPassSaving(true);
    try {
      await changePassword({
        currentPassword: passData.current,
        newPassword: passData.newPass,
      });
      showToast({
        title: "Password Updated",
        description: "Your new password is active.",
        variant: "success",
      });
      setPassData({ current: "", newPass: "", confirm: "" });
    } catch (err) {
      showToast({
        title: "Error",
        description: err.message,
        variant: "danger",
      });
    } finally {
      setPassSaving(false);
    }
  };

  const [testingSmtp, setTestingSmtp] = useState(false);
  const handleTestSmtp = async () => {
    if (!settings.smtpHost || !settings.smtpUser || !settings.smtpPassword) {
      showToast({
        title: "Missing Info",
        description: "Please fill in SMTP Host, User, and Password first.",
        variant: "warning",
      });
      return;
    }

    setTestingSmtp(true);
    try {
      await testSmtp(settings);
      showToast({
        title: "SMTP Verified",
        description: "Successfully connected to the mail server!",
        variant: "success",
      });
    } catch (err) {
      showToast({
        title: "SMTP Error",
        description: err.message,
        variant: "danger",
      });
    } finally {
      setTestingSmtp(false);
    }
  };

  const NAV = [
    { id: "general", label: "General", icon: FaCog },
    { id: "seo", label: "SEO", icon: FaSearch },
    { id: "social", label: "Social", icon: FaGlobe },
    { id: "email", label: "Email / SMTP", icon: FaEnvelope },
    { id: "performance", label: "Performance", icon: FaRocket },
    { id: "security", label: "Security", icon: FaShieldAlt },
  ];

  // Show skeleton while settings load from API
  if (loadingSettings || !initialized) {
    return (
      <div className="space-y-6">
        <div className="h-14 w-72 bg-muted animate-pulse rounded-2xl" />
        <div className="h-6 w-96 bg-muted/50 animate-pulse rounded-xl" />
        <div className="grid grid-cols-1 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-40 bg-surface animate-pulse rounded-2xl border border-border/50"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase text-text">
            System <span className="text-brand-500">Settings</span>
          </h2>
          <p className="text-muted font-bold text-sm tracking-tight">
            Manage your platform configuration, SEO, integrations, and security.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 font-black uppercase text-[10px] tracking-widest">
              Unsaved Changes
            </Badge>
          )}
          <Button
            variant="outline"
            onClick={handleReset}
            className="rounded-full px-6 uppercase font-black text-xs tracking-widest"
          >
            <FaUndo className="mr-2" /> Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="rounded-full px-8 uppercase font-black text-xs tracking-widest italic shadow-lg shadow-brand-500/20"
          >
            <FaSave className="mr-2" />
            {saving ? "Saving..." : "Save All"}
          </Button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Nav */}
        <aside className="hidden lg:flex flex-col gap-1 w-48 shrink-0">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-black uppercase tracking-widest transition-all ${
                activeSection === id
                  ? "bg-brand-500/10 text-brand-500"
                  : "text-muted hover:bg-muted/20 hover:text-text"
              }`}
            >
              <Icon className="text-sm shrink-0" />
              {label}
            </button>
          ))}
        </aside>

        {/* Main content */}
        <div className="flex-1 grid grid-cols-1 gap-6">
          {(activeSection === "general" || activeSection === "all") && (
            <SectionCard title="General Settings" icon={FaCog}>
              <FieldGroup label="Site Name">
                <Input
                  value={settings.siteName}
                  onChange={(e) => update("siteName", e.target.value)}
                  placeholder="e.g. Liberia Digital Insights"
                />
              </FieldGroup>
              <FieldGroup label="Site Description">
                <Textarea
                  rows={3}
                  value={settings.siteDescription}
                  onChange={(e) => update("siteDescription", e.target.value)}
                />
              </FieldGroup>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FieldGroup label="Contact Email">
                  <Input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => update("contactEmail", e.target.value)}
                    placeholder="contact@example.com"
                  />
                </FieldGroup>
                <FieldGroup label="Admin Email">
                  <Input
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) => update("adminEmail", e.target.value)}
                    placeholder="admin@example.com"
                  />
                </FieldGroup>
              </div>
            </SectionCard>
          )}

          {activeSection === "seo" && (
            <SectionCard
              title="SEO Settings"
              icon={FaSearch}
              iconClass="text-emerald-500"
            >
              <FieldGroup label="Meta Description">
                <Textarea
                  rows={3}
                  value={settings.metaDescription}
                  onChange={(e) => update("metaDescription", e.target.value)}
                />
              </FieldGroup>
              <FieldGroup label="Keywords (comma-separated)">
                <Input
                  value={settings.keywords}
                  onChange={(e) => update("keywords", e.target.value)}
                  placeholder="technology, liberia, innovation"
                />
              </FieldGroup>
              <FieldGroup label="Google Analytics ID">
                <Input
                  value={settings.googleAnalyticsId}
                  onChange={(e) => update("googleAnalyticsId", e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                />
              </FieldGroup>
            </SectionCard>
          )}

          {activeSection === "social" && (
            <SectionCard
              title="Social Media Links"
              icon={FaGlobe}
              iconClass="text-blue-500"
            >
              {["facebook", "twitter", "linkedin", "youtube"].map(
                (platform) => (
                  <FieldGroup
                    key={platform}
                    label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                  >
                    <Input
                      value={settings[platform]}
                      onChange={(e) => update(platform, e.target.value)}
                      placeholder={`https://${platform}.com/...`}
                    />
                  </FieldGroup>
                ),
              )}
            </SectionCard>
          )}

          {activeSection === "email" && (
            <SectionCard
              title="Email / SMTP"
              icon={FaEnvelope}
              iconClass="text-violet-500"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FieldGroup label="SMTP Host">
                  <Input
                    value={settings.smtpHost}
                    onChange={(e) => update("smtpHost", e.target.value)}
                    placeholder="smtp.example.com"
                  />
                </FieldGroup>
                <FieldGroup label="SMTP Port">
                  <Input
                    value={settings.smtpPort}
                    onChange={(e) => update("smtpPort", e.target.value)}
                    placeholder="587"
                  />
                </FieldGroup>
                <FieldGroup label="SMTP User">
                  <Input
                    value={settings.smtpUser}
                    onChange={(e) => update("smtpUser", e.target.value)}
                    placeholder="user@example.com"
                  />
                </FieldGroup>
                <FieldGroup label="SMTP Password">
                  <Input
                    type="password"
                    value={settings.smtpPassword}
                    onChange={(e) => update("smtpPassword", e.target.value)}
                    placeholder="••••••••"
                  />
                </FieldGroup>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border/30">
                <ToggleSwitch
                  checked={settings.smtpSecure}
                  onChange={() => toggle("smtpSecure")}
                  label="Use TLS/SSL"
                  description="Enable encrypted SMTP connection"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestSmtp}
                  disabled={testingSmtp}
                  className="rounded-full text-[10px] font-black uppercase tracking-widest px-4 h-9"
                >
                  {testingSmtp ? "Testing..." : "Test Connection"}
                </Button>
              </div>
            </SectionCard>
          )}

          {activeSection === "performance" && (
            <SectionCard
              title="Performance"
              icon={FaRocket}
              iconClass="text-amber-500"
            >
              <div className="divide-y divide-border/30 space-y-4">
                <ToggleSwitch
                  checked={settings.enableCaching}
                  onChange={() => toggle("enableCaching")}
                  label="Enable Caching"
                  description="Cache pages and API responses for faster load times"
                />
                <div className="pt-4">
                  <ToggleSwitch
                    checked={settings.imageOptimization}
                    onChange={() => toggle("imageOptimization")}
                    label="Image Optimization"
                    description="Automatically compress and resize uploaded images"
                  />
                </div>
                <div className="pt-4">
                  <ToggleSwitch
                    checked={settings.analyticsTracking}
                    onChange={() => toggle("analyticsTracking")}
                    label="Analytics Tracking"
                    description="Enable platform-level user behavior analytics"
                  />
                </div>
                <div className="pt-4">
                  <ToggleSwitch
                    checked={settings.lazyLoading}
                    onChange={() => toggle("lazyLoading")}
                    label="Lazy Loading"
                    description="Load images and embeds only when scrolled into view"
                  />
                </div>
              </div>
            </SectionCard>
          )}

          {activeSection === "security" && (
            <SectionCard
              title="Security"
              icon={FaShieldAlt}
              iconClass="text-rose-500"
            >
              <ToggleSwitch
                checked={settings.enable2FA}
                onChange={() => toggle("enable2FA")}
                label="Require 2FA for Admins"
                description="Force two-factor authentication for all admin accounts"
              />
              <FieldGroup label="Session Timeout (hours)">
                <Input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => update("sessionTimeout", e.target.value)}
                  placeholder="24"
                />
              </FieldGroup>
              <FieldGroup label="Max Login Attempts">
                <Input
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => update("maxLoginAttempts", e.target.value)}
                  placeholder="5"
                />
              </FieldGroup>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}
