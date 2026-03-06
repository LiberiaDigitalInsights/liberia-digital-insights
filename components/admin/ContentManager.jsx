"use client";

import React, { useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export default function ContentManager({
  title,
  subtitle,
  items = [],
  loading = false,
  columns = [],
  onAdd,
  onSearch,
  onFilterStatus,
  filterStatus = "all",
  searchTerm = "",
  pagination = { current: 1, total: 1, onPageChange: () => {} },
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black italic tracking-tighter uppercase text-text">
            {title} <span className="text-brand-500">Management</span>
          </h2>
          {subtitle && (
            <p className="text-muted font-bold text-sm tracking-tight">
              {subtitle}
            </p>
          )}
        </div>
        {onAdd && (
          <Button
            onClick={onAdd}
            className="bg-brand-500 hover:bg-brand-600 text-white font-black uppercase tracking-widest px-8 rounded-full shadow-lg shadow-brand-500/20"
          >
            <FaPlus className="mr-2 w-3 h-3" />
            Add {title}
          </Button>
        )}
      </div>

      {/* Filters & Search */}
      <Card elevation="sm" className="border-border/50 bg-surface/50">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <Input
                placeholder={`Search ${title.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-12 bg-surface/50 border-border/50 focus:border-brand-500 transition-colors rounded-xl font-medium"
              />
            </div>
            {onFilterStatus && (
              <div className="w-full md:w-56">
                <Select
                  value={filterStatus}
                  onChange={(e) => onFilterStatus(e.target.value)}
                  className="bg-surface/50 border-border/50 focus:border-brand-500 rounded-xl font-black uppercase tracking-widest text-xs"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="pending">Pending Review</option>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card
        elevation="sm"
        className="border-border/50 bg-surface/50 overflow-hidden"
      >
        <CardContent className="p-0">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border/50">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={cn(
                        "px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted",
                        col.className,
                      )}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {columns.map((col) => (
                        <td key={col.key} className="px-6 py-5">
                          <div className="h-4 bg-muted/50 rounded w-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : items.length > 0 ? (
                  items.map((item, idx) => (
                    <tr
                      key={item.id || idx}
                      className="hover:bg-brand-500/5 transition-colors group cursor-default"
                    >
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={cn("px-6 py-5", col.className)}
                        >
                          {col.render ? (
                            col.render(item)
                          ) : (
                            <span className="text-sm font-bold text-text">
                              {item[col.key] || "—"}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-6 py-12 text-center text-muted italic font-medium"
                    >
                      No {title.toLowerCase()} found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.total > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 px-1">
          <p className="text-xs font-black uppercase tracking-widest text-muted">
            Page {pagination.current} of {pagination.total}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.current - 1)}
              disabled={pagination.current === 1}
              className="rounded-xl font-black uppercase tracking-widest text-xs px-5 border-border/50"
            >
              <FaChevronLeft className="mr-2 w-2 h-2" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.current + 1)}
              disabled={pagination.current === pagination.total}
              className="rounded-xl font-black uppercase tracking-widest text-xs px-5 border-border/50"
            >
              Next <FaChevronRight className="ml-2 w-2 h-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
