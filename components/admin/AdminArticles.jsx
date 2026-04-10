"use client";

import React, { useState } from "react";
import { FaEdit, FaTrash, FaEye, FaExternalLinkAlt } from "react-icons/fa";
import Link from "next/link";
import ContentManager from "./ContentManager";
import { useArticles, deleteArticle } from "@/hooks/useBackendApi";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import BulkActions from "./BulkActions";
import { apiRequest } from "@/hooks/useBackendApi";

export default function AdminArticles() {
  const router = useRouter();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [bulkActionType, setBulkActionType] = useState(null);

  const {
    data: articlesData,
    loading,
    refetch,
  } = useArticles({
    search: searchTerm,
    status: filterStatus !== "all" ? filterStatus : undefined,
    page,
    limit: 10,
  });

  const articles = articlesData?.articles || [];
  const pagination = {
    current: page,
    total: articlesData?.pagination?.pages || 1,
    onPageChange: (p) => setPage(p),
  };

  const handleDeleteClick = (article) => {
    setArticleToDelete(article);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!articleToDelete) return;
    setIsDeleting(true);
    try {
      await deleteArticle(articleToDelete.id);
      await refetch();
      showToast({
        title: "Article Deleted",
        description: "The article has been successfully removed.",
        variant: "success",
      });
      setShowDeleteModal(false);
      setArticleToDelete(null);
    } catch (error) {
      console.error("Failed to delete article:", error);
      showToast({
        title: "Delete Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "danger",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkAction = async (action) => {
    if (action === "delete") {
      setBulkActionType("delete");
      setShowDeleteModal(true);
      return;
    }

    setIsBulkProcessing(true);
    try {
      const result = await apiRequest("/articles/bulk", {
        method: "POST",
        body: JSON.stringify({ ids: selectedIds, action }),
      });

      await refetch();
      setSelectedIds([]);
      showToast({
        title: "Bulk Action Successful",
        description: result.message,
        variant: "success",
      });
    } catch (error) {
      showToast({
        title: "Bulk Action Failed",
        description: error.message,
        variant: "danger",
      });
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleConfirmBulkDelete = async () => {
    setIsBulkProcessing(true);
    try {
      await apiRequest("/articles/bulk", {
        method: "POST",
        body: JSON.stringify({ ids: selectedIds, action: "delete" }),
      });

      await refetch();
      setSelectedIds([]);
      setShowDeleteModal(false);
      setBulkActionType(null);
      showToast({
        title: "Bulk Delete Successful",
        description: `${selectedIds.length} articles have been removed.`,
        variant: "success",
      });
    } catch (error) {
      showToast({
        title: "Bulk Delete Failed",
        description: error.message,
        variant: "danger",
      });
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const columns = [
    {
      key: "title",
      label: "Article Details",
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
          {new Date(item.published_at).toLocaleDateString()}
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
            href={`/article/${item.slug}`}
            target="_blank"
            variant="ghost"
            size="sm"
            className="p-2 text-muted hover:text-brand-500 hover:bg-brand-500/5 rounded-xl transition-all"
            title="View Live"
          >
            <FaExternalLinkAlt className="w-3 h-3" />
          </Button>
          <Button
            as={Link}
            href={`/admin/articles/edit/${item.id}`}
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
        title="Articles"
        subtitle="Create, edit, and organize your platform's editorial content."
        items={articles}
        loading={loading}
        columns={columns}
        onAdd={() => router.push("/admin/articles/new")}
        onSearch={setSearchTerm}
        onFilterStatus={setFilterStatus}
        filterStatus={filterStatus}
        searchTerm={searchTerm}
        pagination={pagination}
        selection={{
          selectedIds,
          onSelectionChange: setSelectedIds,
        }}
      />

      <BulkActions
        selectedCount={selectedIds.length}
        onAction={handleBulkAction}
        onClear={() => setSelectedIds([])}
        filterStatus={filterStatus}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setBulkActionType(null);
        }}
        title={
          bulkActionType === "delete"
            ? "Bulk Delete Articles"
            : "Delete Article"
        }
        size="sm"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setBulkActionType(null);
              }}
              className="font-black uppercase tracking-widest text-[10px] rounded-xl"
              disabled={isDeleting || isBulkProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={
                bulkActionType === "delete"
                  ? handleConfirmBulkDelete
                  : confirmDelete
              }
              className="bg-rose-500 hover:bg-rose-600 text-white font-black uppercase tracking-widest text-[10px] rounded-xl px-6"
              disabled={isDeleting || isBulkProcessing}
            >
              {isDeleting || isBulkProcessing
                ? "Processing..."
                : "Confirm Delete"}
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
            {bulkActionType === "delete" ? (
              <>
                You are about to delete{" "}
                <span className="text-text font-bold">
                  {selectedIds.length} articles
                </span>
                . This action is permanent and cannot be undone.
              </>
            ) : (
              <>
                You are about to delete{" "}
                <span className="text-text font-bold">
                  "{articleToDelete?.title}"
                </span>
                . This action is permanent and cannot be undone.
              </>
            )}
          </p>
        </div>
      </Modal>
    </>
  );
}
