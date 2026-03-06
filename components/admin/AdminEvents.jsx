"use client";

import React, { useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";
import Link from "next/link";
import ContentManager from "./ContentManager";
import { useEvents, deleteEvent } from "@/hooks/useBackendApi";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useRouter } from "next/navigation";

export default function AdminEvents() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: eventsData,
    loading,
    refetch,
  } = useEvents({
    search: searchTerm,
    status: filterStatus !== "all" ? filterStatus : undefined,
    page,
    limit: 10,
  });

  const events = eventsData?.events || [];
  const pagination = {
    current: page,
    total: eventsData?.pagination?.pages || 1,
    onPageChange: (p) => setPage(p),
  };

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    setIsDeleting(true);
    try {
      await deleteEvent(eventToDelete.id);
      await refetch();
      setShowDeleteModal(false);
      setEventToDelete(null);
    } catch (error) {
      console.error("Failed to delete event:", error);
      alert("Failed to delete event: " + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      key: "title",
      label: "Event Details",
      render: (item) => (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-black text-text group-hover:text-brand-500 transition-colors leading-tight">
            {item.title}
          </span>
          <span className="text-[10px] text-muted font-bold uppercase tracking-widest italic">
            {item.location || "Online"} •{" "}
            {new Date(item.date).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <Badge
          variant={
            item.status === "published"
              ? "success"
              : item.status === "pending"
                ? "warning"
                : "outline"
          }
          className="font-black uppercase tracking-tighter text-[10px]"
        >
          {item.status}
        </Badge>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (item) => (
        <span className="text-xs font-bold text-muted uppercase tracking-widest bg-muted/30 px-2 py-1 rounded">
          {item.type || "General"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (item) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            as={Link}
            href={`/event/${item.slug}`}
            target="_blank"
            variant="ghost"
            size="sm"
            className="p-2 text-muted hover:text-brand-500 hover:bg-brand-500/5 rounded-xl transition-all"
            title="View Page"
          >
            <FaExternalLinkAlt className="w-3 h-3" />
          </Button>
          <Button
            as={Link}
            href={`/admin/events/edit/${item.id}`}
            variant="ghost"
            size="sm"
            className="p-2 text-muted hover:text-emerald-500 hover:bg-emerald-500/5 rounded-xl transition-all"
            title="Edit"
          >
            <FaEdit className="w-3.5 h-3.5" />
          </Button>
          <button
            onClick={() => handleDeleteClick(item)}
            className="p-2 text-muted hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all"
            title="Delete"
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
        title="Events"
        subtitle="Schedule and manage upcoming tech community events."
        items={events}
        loading={loading}
        columns={columns}
        onAdd={() => router.push("/admin/events/new")}
        onSearch={setSearchTerm}
        onFilterStatus={setFilterStatus}
        filterStatus={filterStatus}
        searchTerm={searchTerm}
        pagination={pagination}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Event"
        size="sm"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="font-black uppercase tracking-widest text-[10px] rounded-xl"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-rose-500 hover:bg-rose-600 text-white font-black uppercase tracking-widest text-[10px] rounded-xl px-6"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </Button>
          </>
        }
      >
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTrash className="w-6 h-6" />
          </div>
          <p className="font-bold text-text text-lg italic">
            Are you absolutely sure?
          </p>
          <p className="text-muted leading-relaxed">
            You are about to delete{" "}
            <span className="text-text font-bold">
              "{eventToDelete?.title}"
            </span>
            . This action is permanent and cannot be undone.
          </p>
        </div>
      </Modal>
    </>
  );
}
