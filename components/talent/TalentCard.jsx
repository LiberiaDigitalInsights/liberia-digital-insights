"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Muted } from "@/components/ui/Typography";
import Badge from "@/components/ui/Badge";
import { FaGlobe, FaLink, FaExternalLinkAlt } from "react-icons/fa";

export default function TalentCard({ name, role, bio, links, category }) {
  return (
    <Card className="transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 group border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between gap-3">
          <span className="truncate text-xl font-bold group-hover:text-brand-500 transition-colors">
            {name}
          </span>
          {category && (
            <Badge
              variant="solid"
              className="shrink-0 bg-brand-500/10 text-brand-500 border-none"
            >
              {category}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {role && (
          <div className="flex items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-muted bg-surface px-2 py-0.5 rounded border border-border">
              {role}
            </span>
          </div>
        )}
        <p className="text-sm text-muted leading-relaxed line-clamp-3">{bio}</p>

        {links && Object.keys(links).length > 0 && (
          <div className="flex flex-wrap gap-4 pt-2 border-t border-border/50">
            {Object.entries(links).map(([key, url]) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-500 hover:text-brand-600 transition-colors uppercase tracking-tight"
              >
                {key === "website" ? (
                  <FaGlobe className="text-[10px]" />
                ) : (
                  <FaLink className="text-[10px]" />
                )}
                {key}
                <FaExternalLinkAlt className="text-[8px] opacity-50" />
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
