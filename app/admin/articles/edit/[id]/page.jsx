"use client";

import React from "react";
import { useParams } from "next/navigation";
import ArticleEditor from "@/components/admin/ArticleEditor";
import { useArticleById } from "@/hooks/useBackendApi";
import { FaSpinner } from "react-icons/fa";

export default function EditArticlePage() {
  const params = useParams();
  const { id } = params;
  const { data: article, loading, error } = useArticleById(id);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <FaSpinner className="w-8 h-8 text-brand-500 animate-spin" />
        <p className="text-sm font-black uppercase tracking-widest text-muted italic">
          Retrieving Article Data...
        </p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="p-4 rounded-full bg-rose-500/10 text-rose-500">
          <FaSpinner className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black uppercase italic tracking-tighter">
          Article Not Found
        </h3>
        <p className="text-muted font-bold">
          {error?.message ||
            "The article you are looking for does not exist or has been removed."}
        </p>
      </div>
    );
  }

  return <ArticleEditor initialData={article} mode="edit" />;
}
