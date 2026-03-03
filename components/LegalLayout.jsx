"use client";

import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { H1, Muted } from "@/components/ui/Typography";
import { FaChevronLeft } from "react-icons/fa";

export default function LegalLayout({ children, title, lastUpdated }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-20">
        <header className="mb-16 text-center">
          <Link href="/" className="inline-flex items-center gap-3 mb-10 group">
            <div className="p-3 bg-surface rounded-2xl border border-border/50 group-hover:border-brand-500/50 group-hover:shadow-2xl transition-all">
              <Logo noLink className="h-10 w-auto" />
            </div>
          </Link>
          <H1 className="mb-4 text-4xl md:text-5xl font-black uppercase italic tracking-tighter decoration-brand-500 decoration-8 underline underline-offset-8">
            {title}
          </H1>
          {lastUpdated && (
            <Muted className="text-sm font-black uppercase tracking-widest mt-8">
              Last updated: {lastUpdated}
            </Muted>
          )}
        </header>

        <main className="prose prose-invert prose-brand max-w-none bg-surface p-8 md:p-12 rounded-3xl border border-border/50 shadow-2xl">
          {children}
        </main>

        <footer className="mt-16 pt-8 border-t border-border/50 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-black normal-case tracking-widest text-muted hover:text-brand-500 transition-colors"
          >
            <FaChevronLeft className="text-[10px]" /> Back to Home
          </Link>
        </footer>
      </div>
    </div>
  );
}
