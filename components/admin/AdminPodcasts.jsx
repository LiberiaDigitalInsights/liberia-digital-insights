"use client";

import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlay, FaExternalLinkAlt } from "react-icons/fa";
import Link from "next/link";
import ContentManager from "./ContentManager";
import { usePodcasts, deletePodcast } from "@/hooks/useBackendApi";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useRouter } from "next/navigation";

export default function AdminPodcasts() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [podcastToDelete, setPodcastToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: podcastsData,
    loading,
    refetch,
  } = usePodcasts({
    search: searchTerm,
    status: filterStatus !== "all" ? filterStatus : undefined,
    page,
    limit: 10,
  });

  const podcasts = podcastsData?.podcasts || [];
  const pagination = {
    current: page,
    total: podcastsData?.pagination?.pages || 1,
    onPageChange: (p) => setPage(p),
  };

  const handleDeleteClick = (podcast) => {
    setPodcastToDelete(podcast);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!podcastToDelete) return;
    setIsDeleting(true);
    try {
      await deletePodcast(podcastToDelete.id);
      await refetch();
      setShowDeleteModal(false);
      setPodcastToDelete(null);
    } catch (error) {
      console.error("Failed to delete podcast:", error);
      alert("Failed to delete podcast: " + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      key: "title",
      label: "Podcast Details",
      render: (item) => (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-black text-text group-hover:text-brand-500 transition-colors leading-tight">
            {item.title}
          </span>
          <span className="text-[10px] text-muted font-bold uppercase tracking-widest italic">
            {item.category?.name || "Uncategorized"} • By{" "}
            {item.author?.name || "Admin"}
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
      key: "date",
      label: "Published",
      render: (item) => (
        <span className="text-xs font-bold text-muted tabular-nums">
          {new Date(item.created_at).toLocaleDateString()}
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
            href={`/podcast/${item.slug}`}
            target="_blank"
            variant="ghost"
            size="sm"
            className="p-2 text-muted hover:text-brand-500 hover:bg-brand-500/5 rounded-xl transition-all"
            title="Listen Now"
          >
            <FaPlay className="w-3 h-3" />
          </Button>
          <Button
            as={Link}
            href={`/admin/podcasts/edit/${item.id}`}
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
        title="Podcasts"
        subtitle="Upload and manage podcast episodes and audio content."
        items={podcasts}
        loading={loading}
        columns={columns}
        onAdd={() => router.push("/admin/podcasts/new")}
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
        title="Delete Podcast"
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
              "{podcastToDelete?.title}"
            </span>
            . This action is permanent and cannot be undone.
          </p>
        </div>
      </Modal>
    </>
  );
}
