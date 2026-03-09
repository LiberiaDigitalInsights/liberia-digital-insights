"use client";

import React, { useState } from "react";
import {
  FaUserShield,
  FaUserSlash,
  FaUserCheck,
  FaTrash,
  FaSpinner,
  FaPlus,
  FaLock,
} from "react-icons/fa";
import ContentManager from "./ContentManager";
import {
  useUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  inviteUser,
  resetUserPassword,
} from "@/hooks/useBackendApi";
import { cn } from "@/lib/cn";
import { useToast } from "@/context/ToastContext";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";

export default function AdminUsers() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [page, setPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    role: "editor",
    is_active: true,
  });

  const {
    data: usersData,
    loading,
    refetch,
  } = useUsers({
    search: searchTerm,
    role: filterRole !== "all" ? filterRole : undefined,
    page,
    limit: 10,
  });

  const users = usersData?.users || [];
  const pagination = {
    current: page,
    total: usersData?.pagination?.pages || 1,
    onPageChange: (p) => setPage(p),
  };

  const handleRoleChange = async (id, newRole) => {
    setUpdatingId(id);
    try {
      await updateUserRole(id, newRole);
      await refetch();
      showToast({
        title: "Role Updated",
        description: "User role has been successfully changed.",
        variant: "success",
      });
    } catch (error) {
      showToast({
        title: "Update Failed",
        description: error.message,
        variant: "danger",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    setUpdatingId(id);
    try {
      await updateUserStatus(id, !currentStatus);
      await refetch();
      showToast({
        title: "Status Updated",
        description: `User account has been ${!currentStatus ? "enabled" : "disabled"}.`,
        variant: "success",
      });
    } catch (error) {
      showToast({
        title: "Update Failed",
        description: error.message,
        variant: "danger",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await deleteUser(userToDelete.id);
      showToast({
        title: "User Deleted",
        description: "The user account has been permanently removed.",
        variant: "success",
      });
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      showToast({
        title: "Delete Failed",
        description: error.message,
        variant: "danger",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    setInviting(true);
    try {
      await inviteUser(inviteData);
      showToast({
        title: "User Invited",
        description: `Invitation sent to ${inviteData.email}.`,
        variant: "success",
      });
      setShowInviteModal(false);
      setInviteData({
        email: "",
        first_name: "",
        last_name: "",
        role: "editor",
        is_active: true,
      });
      refetch();
    } catch (error) {
      showToast({
        title: "Invitation Failed",
        description: error.message,
        variant: "danger",
      });
    } finally {
      setInviting(false);
    }
  };

  const handleResetPassword = async (id, name) => {
    if (!confirm(`Generate a new temporary password for ${name}?`)) return;
    setUpdatingId(id);
    try {
      const result = await resetUserPassword(id);
      showToast({
        title: "Password Reset",
        description: `Email sent! Temp Pass: ${result.tempPassword}`,
        variant: "warning",
      });
    } catch (error) {
      showToast({
        title: "Reset Failed",
        description: error.message,
        variant: "danger",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const columns = [
    {
      key: "user",
      label: "User Information",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center font-black text-xs border border-brand-500/20">
            {item.first_name?.[0]}
            {item.last_name?.[0]}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-text italic leading-tight">
              {item.first_name} {item.last_name}
            </span>
            <span className="text-[10px] text-muted font-bold tracking-widest uppercase">
              {item.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "System Role",
      render: (item) => (
        <div className="flex items-center gap-2">
          {updatingId === item.id ? (
            <FaSpinner className="w-3 h-3 text-brand-500 animate-spin" />
          ) : (
            <Select
              value={item.role}
              onChange={(e) => handleRoleChange(item.id, e.target.value)}
              disabled={updatingId === item.id}
              className="text-[10px] font-black uppercase tracking-widest bg-muted/10 border-0 h-8 rounded-lg min-w-[120px]"
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="moderator">Moderator</option>
              <option value="user">User</option>
            </Select>
          )}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <Badge
          variant={item.is_active ? "success" : "danger"}
          className="font-black uppercase tracking-tighter text-[10px]"
        >
          {item.is_active ? "Active" : "Disabled"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (item) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleStatusToggle(item.id, item.is_active)}
            disabled={updatingId === item.id}
            className={cn(
              "p-2 rounded-xl transition-all",
              item.is_active
                ? "text-rose-500 hover:bg-rose-500/10"
                : "text-emerald-500 hover:bg-emerald-500/10",
            )}
            title={item.is_active ? "Disable Account" : "Enable Account"}
          >
            {item.is_active ? (
              <FaUserSlash className="w-3.5 h-3.5" />
            ) : (
              <FaUserCheck className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={() => handleResetPassword(item.id, item.first_name)}
            disabled={updatingId === item.id}
            className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-xl transition-all"
            title="Reset Password"
          >
            <FaLock className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleDeleteClick(item)}
            disabled={updatingId === item.id}
            className="p-2 text-muted hover:text-rose-600 hover:bg-rose-600/5 rounded-xl transition-all"
            title="Permanent Delete"
          >
            <FaTrash className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <ContentManager
        title="Users"
        subtitle="Manage platform access, assign roles, and moderate user accounts."
        items={users}
        loading={loading}
        columns={columns}
        onSearch={setSearchTerm}
        onFilterStatus={setFilterRole}
        onAdd={() => setShowInviteModal(true)}
        filterStatus={filterRole}
        searchTerm={searchTerm}
        pagination={pagination}
      />

      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete User"
        size="sm"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-rose-500 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </Button>
          </>
        }
      >
        <div className="text-center py-4 space-y-3">
          <p className="font-bold text-lg italic">Confirm Account Deletion</p>
          <p className="text-sm text-muted">
            You are about to delete{" "}
            <span className="text-text font-black">
              {userToDelete?.first_name} {userToDelete?.last_name}
            </span>
            . This will remove all their data and access.
          </p>
        </div>
      </Modal>

      <Modal
        open={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite New User"
        size="md"
      >
        <form onSubmit={handleInviteSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={inviteData.first_name}
              onChange={(e) =>
                setInviteData({ ...inviteData, first_name: e.target.value })
              }
              placeholder="e.g. John"
              required
            />
            <Input
              label="Last Name"
              value={inviteData.last_name}
              onChange={(e) =>
                setInviteData({ ...inviteData, last_name: e.target.value })
              }
              placeholder="e.g. Doe"
              required
            />
          </div>
          <Input
            label="Email Address"
            type="email"
            value={inviteData.email}
            onChange={(e) =>
              setInviteData({ ...inviteData, email: e.target.value })
            }
            placeholder="john.doe@example.com"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="System Role"
              value={inviteData.role}
              onChange={(e) =>
                setInviteData({ ...inviteData, role: e.target.value })
              }
              required
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="moderator">Moderator</option>
              <option value="user">User</option>
            </Select>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted">
                Initial Status
              </label>
              <div className="flex items-center h-10 gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setInviteData({ ...inviteData, is_active: true })
                  }
                  className={cn(
                    "px-4 py-1 rounded-full text-[10px] font-black uppercase transition-all",
                    inviteData.is_active
                      ? "bg-emerald-500 text-white"
                      : "bg-muted/10 text-muted hover:bg-muted/20",
                  )}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setInviteData({ ...inviteData, is_active: false })
                  }
                  className={cn(
                    "px-4 py-1 rounded-full text-[10px] font-black uppercase transition-all",
                    !inviteData.is_active
                      ? "bg-rose-500 text-white"
                      : "bg-muted/10 text-muted hover:bg-muted/20",
                  )}
                >
                  Disabled
                </button>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-border/30 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowInviteModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={inviting}
              className="bg-brand-500 text-white px-8"
            >
              {inviting ? "Sending..." : "Send Invitation"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
