"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/cn";

export default function TableOfContents({ headings }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0% -80% 0%" },
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (!headings || headings.length === 0) return null;

  return (
    <nav className="hidden lg:block space-y-4">
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-6 flex items-center gap-2">
        <span className="w-4 h-px bg-brand-500/30" />
        Table of Contents
      </h4>
      <ul className="space-y-3">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 2) * 16}px` }}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(heading.id);
                if (el) {
                  const offset = 100;
                  const bodyRect = document.body.getBoundingClientRect().top;
                  const elementRect = el.getBoundingClientRect().top;
                  const elementPosition = elementRect - bodyRect;
                  const offsetPosition = elementPosition - offset;

                  window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                  });
                }
              }}
              className={cn(
                "text-sm font-bold transition-all duration-200 block border-l-2 py-1 pl-4",
                activeId === heading.id
                  ? "border-brand-500 text-brand-500 bg-brand-500/5"
                  : "border-transparent text-muted hover:text-text hover:border-border",
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
