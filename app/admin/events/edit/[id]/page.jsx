"use client";

import React from "react";
import { useParams } from "next/navigation";
import EventEditor from "@/components/admin/EventEditor";
import { useEventById } from "@/hooks/useBackendApi";
import { FaSpinner } from "react-icons/fa";

export default function EditEventPage() {
  const params = useParams();
  const { id } = params;
  const { data: event, loading, error } = useEventById(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h3 className="text-xl font-black uppercase italic tracking-tighter">
          Event Not Found
        </h3>
        <p className="text-muted font-bold">
          {error?.message || "Unavailable"}
        </p>
      </div>
    );
  }

  return <EventEditor initialData={event} mode="edit" />;
}
