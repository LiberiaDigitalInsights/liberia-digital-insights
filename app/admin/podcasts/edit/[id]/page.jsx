"use client";

import React from "react";
import { useParams } from "next/navigation";
import PodcastEditor from "@/components/admin/PodcastEditor";
import { usePodcastById } from "@/hooks/useBackendApi";
import { FaSpinner } from "react-icons/fa";

export default function EditPodcastPage() {
  const params = useParams();
  const { id } = params;
  const { data: podcast, loading, error } = usePodcastById(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (error || !podcast) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h3 className="text-xl font-black uppercase italic tracking-tighter">
          Podcast Not Found
        </h3>
        <p className="text-muted font-bold">
          {error?.message || "Unavailable"}
        </p>
      </div>
    );
  }

  return <PodcastEditor initialData={podcast} mode="edit" />;
}
