"use client";

import React, { useState, useEffect } from "react";
import {
  FaUserPlus,
  FaPaperPlane,
  FaTrash,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/context/ToastContext";
import { apiRequest } from "@/hooks/useBackendApi";
import Modal from "@/components/ui/Modal";

export default function AdminInvitations() {
  const { showToast } = useToast();
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("editor");
  const [isSending, setIsSending] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [inviteToRevoke, setInviteToRevoke] = useState(null);
  const [isRevoking, setIsRevoking] = useState(false);

  const fetchInvitations = async () => {
    try {
      const data = await apiRequest("/invitations");
      setInvitations(data);
    } catch (error) {
      showToast({
        title: "Error",
        description: "Failed to load invitations",
        variant: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSending(true);
    try {
      await apiRequest("/invitations", {
        method: "POST",
        body: JSON.stringify({ email, role }),
      });

      showToast({
        title: "Success",
        description: `Invitation sent to ${email}`,
        variant: "success",
      });
      setEmail("");
      fetchInvitations();
    } catch (error) {
      showToast({
        title: "Invite Failed",
        description: error.message,
        variant: "danger",
      });
    } finally {
      setIsSending(false);
    }
  };

  const confirmRevoke = async () => {
    if (!inviteToRevoke) return;
    setIsRevoking(true);
    try {
      // Need to implement DELETE /api/v1/invitations/[id]
      await apiRequest(`/invitations?id=${inviteToRevoke.id}`, {
        method: "DELETE",
      });

      showToast({
        title: "Invitation Revoked",
        description: `Access for ${inviteToRevoke.email} has been cancelled.`,
        variant: "success",
      });
      setShowRevokeModal(false);
      fetchInvitations();
    } catch (error) {
      showToast({
        title: "Revoke Failed",
        description: error.message,
        variant: "danger",
      });
    } finally {
      setIsRevoking(false);
    }
  };

  const getStatusBadge = (invite) => {
    if (invite.accepted_at)
      return (
        <Badge
          variant="success"
          className="font-black uppercase tracking-tighter text-[9px]"
        >
          <FaCheckCircle className="mr-1" /> Accepted
        </Badge>
      );
    if (new Date(invite.expires_at) < new Date())
      return (
        <Badge
          variant="danger"
          className="font-black uppercase tracking-tighter text-[9px]"
        >
          <FaExclamationCircle className="mr-1" /> Expired
        </Badge>
      );
    return (
      <Badge
        variant="warning"
        className="font-black uppercase tracking-tighter text-[9px]"
      >
        <FaClock className="mr-1" /> Pending
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black italic tracking-tighter uppercase text-text">
            User <span className="text-brand-500">Invitations</span>
          </h2>
          <p className="text-muted font-bold text-sm tracking-tight">
            Invite new team members and manage pending access requests.
          </p>
        </div>
      </div>

      {/* Invite Form */}
      <Card
        elevation="sm"
        className="border-border/50 bg-surface/50 border-l-4 border-l-brand-500"
      >
        <CardContent className="p-6">
          <form
            onSubmit={handleSendInvite}
            className="flex flex-col md:flex-row gap-4 items-end"
          >
            <div className="flex-1 space-y-2 w-full">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted px-1">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-surface/50 border-border/50 focus:border-brand-500 rounded-xl"
              />
            </div>
            <div className="w-full md:w-48 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted px-1">
                Assign Role
              </label>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-surface/50 border-border/50 focus:border-brand-500 rounded-xl font-black uppercase tracking-widest text-xs"
              >
                <option value="editor">Editor</option>
                <option value="moderator">Moderator</option>
                <option value="viewer">Viewer</option>
                <option value="admin">Administrator</option>
              </Select>
            </div>
            <Button
              type="submit"
              disabled={isSending}
              className="bg-brand-500 hover:bg-brand-600 text-white font-black uppercase tracking-widest px-8 rounded-xl h-[42px] min-w-[160px]"
            >
              {isSending ? (
                "Sending..."
              ) : (
                <>
                  <FaPaperPlane className="mr-2" /> Send Invite
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Invitations Table */}
      <Card
        elevation="sm"
        className="border-border/50 bg-surface/50 overflow-hidden"
      >
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border/50">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted">
                    Recipient
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted">
                    Role
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted">
                    Invited By
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-5">
                        <div className="h-4 bg-muted/50 rounded w-full" />
                      </td>
                    </tr>
                  ))
                ) : invitations.length > 0 ? (
                  invitations.map((invite) => (
                    <tr
                      key={invite.id}
                      className="hover:bg-brand-500/5 transition-colors group"
                    >
                      <td className="px-6 py-5">
                        <span className="text-sm font-black text-text italic">
                          {invite.email}
                        </span>
                        <div className="text-[10px] text-muted font-bold uppercase tracking-widest mt-0.5">
                          Sent:{" "}
                          {new Date(invite.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <Badge
                          variant="outline"
                          className="font-black uppercase tracking-tighter text-[10px] border-border/50"
                        >
                          {invite.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-5">{getStatusBadge(invite)}</td>
                      <td className="px-6 py-5">
                        <div className="text-xs font-bold text-text uppercase">
                          {invite.invited_by_user?.first_name || "LDI"}{" "}
                          {invite.invited_by_user?.last_name || "Admin"}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        {!invite.accepted_at && (
                          <button
                            onClick={() => {
                              setInviteToRevoke(invite);
                              setShowRevokeModal(true);
                            }}
                            className="p-2 text-muted hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all"
                            title="Revoke Invitation"
                          >
                            <FaTrash className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-muted italic font-medium"
                    >
                      No pending invitations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Revoke Modal */}
      <Modal
        open={showRevokeModal}
        onClose={() => setShowRevokeModal(false)}
        title="Revoke Invitation"
        size="sm"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setShowRevokeModal(false)}
              className="rounded-xl font-black uppercase tracking-widest text-xs"
              disabled={isRevoking}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmRevoke}
              className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-black uppercase tracking-widest text-xs px-6"
              disabled={isRevoking}
            >
              {isRevoking ? "Revoking..." : "Confirm Revoke"}
            </Button>
          </>
        }
      >
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTrash className="w-6 h-6" />
          </div>
          <p className="font-bold text-text text-lg italic tracking-tight">
            Revoke this invitation?
          </p>
          <p className="text-muted leading-relaxed text-sm">
            This will immediately invalidate the link sent to{" "}
            <span className="text-text font-bold">{inviteToRevoke?.email}</span>
            .
          </p>
        </div>
      </Modal>
    </div>
  );
}
