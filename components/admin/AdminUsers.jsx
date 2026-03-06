"use client";

import React, { useState } from "react";
import {
  FaUserShield,
  FaUserSlash,
  FaUserCheck,
  FaTrash,
  FaSpinner,
} from "react-icons/fa";
import ContentManager from "./ContentManager";
import {
  useUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
} from "@/hooks/useBackendApi";
import { cn } from "@/lib/cn";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [page, setPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

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
    } catch (error) {
      alert("Failed to update role: " + error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    setUpdatingId(id);
    try {
      await updateUserStatus(id, !currentStatus);
      await refetch();
    } catch (error) {
      alert("Failed to update status: " + error.message);
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
      await refetch();
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      alert("Failed to delete user: " + error.message);
    } finally {
      setIsDeleting(false);
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
    </>
  );
}
