"use client";

import React, { useState } from "react";
import { FaLock, FaUserShield, FaShieldAlt } from "react-icons/fa";
import { changePassword, useAuth } from "@/hooks/useBackendApi";
import { useToast } from "@/context/ToastContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

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

export default function AdminAccount() {
  const { showToast } = useToast();
  const { user } = useAuth();

  // Password change state
  const [passData, setPassData] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [passSaving, setPassSaving] = useState(false);

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-4xl font-black italic tracking-tighter uppercase text-text">
          My <span className="text-brand-500">Account</span>
        </h2>
        <p className="text-muted font-bold text-sm tracking-tight">
          Manage your personal profile and security settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <SectionCard title="Profile Snapshot" icon={FaUserShield}>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-24 h-24 rounded-full bg-brand-500 flex items-center justify-center text-white text-3xl font-black mb-4 border-4 border-surface shadow-xl">
                {user?.first_name?.[0]}
                {user?.last_name?.[0]}
              </div>
              <h3 className="text-xl font-black italic uppercase italic tracking-tighter">
                {user?.first_name} {user?.last_name}
              </h3>
              <p className="text-muted text-xs font-bold mt-1 uppercase tracking-widest">
                {user?.role}
              </p>
              <div className="mt-4 px-3 py-1 bg-muted/30 rounded-full border border-border/50">
                <p className="text-[10px] font-black uppercase text-text">
                  {user?.email}
                </p>
              </div>
            </div>
          </SectionCard>

          <div className="bg-brand-500/5 border border-brand-500/20 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-3 text-brand-500 mb-1">
              <FaShieldAlt className="text-sm" />
              <span className="text-xs font-black uppercase tracking-widest italic">
                Security Status
              </span>
            </div>
            <p className="text-[11px] text-muted font-bold leading-relaxed">
              Your account is protected by industry-standard encryption.
              Remember to use a unique password and change it periodically.
            </p>
          </div>
        </div>

        {/* Security Form */}
        <div className="lg:col-span-2">
          <SectionCard title="Change Password" icon={FaLock}>
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <p className="text-xs text-muted font-bold">
                Update your account password. You will need to provide your
                current password for verification.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                <div className="md:col-span-2">
                  <FieldGroup label="Current Password">
                    <Input
                      type="password"
                      required
                      value={passData.current}
                      onChange={(e) =>
                        setPassData({ ...passData, current: e.target.value })
                      }
                      placeholder="Current password"
                    />
                  </FieldGroup>
                </div>
                <FieldGroup label="New Password">
                  <Input
                    type="password"
                    required
                    value={passData.newPass}
                    onChange={(e) =>
                      setPassData({ ...passData, newPass: e.target.value })
                    }
                    placeholder="New password (min 6 chars)"
                  />
                </FieldGroup>
                <FieldGroup label="Confirm New Password">
                  <Input
                    type="password"
                    required
                    value={passData.confirm}
                    onChange={(e) =>
                      setPassData({ ...passData, confirm: e.target.value })
                    }
                    placeholder="Repeat new password"
                  />
                </FieldGroup>
              </div>
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={passSaving}
                  className="rounded-full px-8 uppercase font-black text-xs tracking-widest italic shadow-lg shadow-brand-500/20"
                >
                  {passSaving ? "Updating Security..." : "Apply New Password"}
                </Button>
              </div>
            </form>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
