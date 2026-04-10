"use client";

import React from "react";
import { FaTrash, FaCheck, FaTimes, FaArchive } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export default function BulkActions({
  selectedCount,
  onAction,
  onClear,
  actions = ["publish", "unpublish", "delete", "archive"],
  filterStatus = "all",
}) {
  if (selectedCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0, x: "-50%" }}
        animate={{ y: 0, opacity: 1, x: "-50%" }}
        exit={{ y: 100, opacity: 0, x: "-50%" }}
        className="fixed bottom-12 left-1/2 z-50 flex items-center gap-6 px-8 py-4 bg-surface/90 backdrop-blur-xl border border-brand-500/30 rounded-full shadow-2xl shadow-brand-500/20 ring-1 ring-white/10"
      >
        <div className="flex items-center gap-3 border-r border-border/50 pr-6 mr-2">
          <span className="h-7 w-7 rounded-lg bg-brand-500 flex items-center justify-center text-xs font-black text-white shadow-lg shadow-brand-500/30">
            {selectedCount}
          </span>
          <span className="text-xs font-black uppercase tracking-widest text-text italic">
            Items Selected
          </span>
        </div>

        <div className="flex items-center gap-3">
          {actions.includes("publish") && (
            <Button
              onClick={() => onAction("publish")}
              size="sm"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[10px] rounded-xl px-5 h-9"
            >
              <FaCheck className="mr-2" /> Publish
            </Button>
          )}

          {actions.includes("unpublish") && (
            <Button
              onClick={() => onAction("unpublish")}
              size="sm"
              variant="outline"
              className="border-muted-foreground/30 text-text hover:bg-brand-500/5 font-black uppercase tracking-widest text-[10px] rounded-xl px-5 h-9"
            >
              <FaTimes className="mr-2" /> Draft
            </Button>
          )}

          {actions.includes("archive") && (
            <Button
              onClick={() =>
                onAction(filterStatus === "archived" ? "unpublish" : "archive")
              }
              size="sm"
              variant="outline"
              className={cn(
                "font-black uppercase tracking-widest text-[10px] rounded-xl px-5 h-9",
                filterStatus === "archived"
                  ? "border-brand-500/50 text-brand-500 hover:bg-brand-500/5"
                  : "border-amber-500/50 text-amber-500 hover:bg-amber-500/5",
              )}
            >
              {filterStatus === "archived" ? (
                <>
                  <FaCheck className="mr-2" /> Restore to Draft
                </>
              ) : (
                <>
                  <FaArchive className="mr-2" /> Archive
                </>
              )}
            </Button>
          )}

          {actions.includes("delete") && (
            <Button
              onClick={() => onAction("delete")}
              size="sm"
              className="bg-rose-500 hover:bg-rose-600 text-white font-black uppercase tracking-widest text-[10px] rounded-xl px-5 h-9"
            >
              <FaTrash className="mr-2" /> Delete
            </Button>
          )}
        </div>

        <button
          onClick={onClear}
          className="ml-2 p-2 text-muted hover:text-rose-500 transition-colors bg-muted/10 rounded-full"
          title="Clear Selection"
        >
          <FaTimes className="w-3 h-3" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
