"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import React from "react";
import Logo from "./Logo";
import Search from "./Search";
import { CATEGORIES } from "@/constants/categories";
import { FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";
import AdSlot from "@/components/ads/AdSlot";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [openMenu, setOpenMenu] = React.useState(null);
  const [pinned, setPinned] = React.useState(false);
  const [barHeight, setBarHeight] = React.useState(0);
  const contentTriggerRef = React.useRef(null);
  const contentMenuRef = React.useRef(null);
  const communityTriggerRef = React.useRef(null);
  const communityMenuRef = React.useRef(null);
  const moreTriggerRef = React.useRef(null);
  const moreMenuRef = React.useRef(null);
  const primaryBarRef = React.useRef(null);

  const isActive = (path) => pathname === path;

  React.useEffect(() => {
    function onDocClick(e) {
      if (!openMenu) return;
      const map = {
        content: {
          trigger: contentTriggerRef.current,
          menu: contentMenuRef.current,
        },
        community: {
          trigger: communityTriggerRef.current,
          menu: communityMenuRef.current,
        },
        more: { trigger: moreTriggerRef.current, menu: moreMenuRef.current },
      };
      const nodes = map[openMenu];
      if (!nodes) return;
      const t = e.target;
      if (
        nodes.trigger &&
        nodes.menu &&
        !nodes.trigger.contains(t) &&
        !nodes.menu.contains(t)
      ) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [openMenu]);

  React.useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      setPinned(y > 40);
    };
    const measure = () => {
      if (primaryBarRef.current) {
        setBarHeight(primaryBarRef.current.offsetHeight || 0);
      }
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <nav className="z-40" role="navigation" aria-label="Primary">
      {/* Top utility strip */}
      <div className="hidden bg-nav-top text-xs md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5">
          <div className="text-white/90">
            <span className="hidden md:inline">
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-4 text-white">
            <a
              href="#"
              aria-label="Facebook"
              className="transition-transform hover:scale-110"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="transition-transform hover:scale-110"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="transition-transform hover:scale-110"
            >
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      {/* Mid header */}
      <div className="bg-brand-500">
        <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr] items-center gap-6 px-4 py-4">
          <Logo />
          <div className="hidden justify-end md:flex">
            <div className="h-14 w-[520px]">
              <AdSlot position="hero" />
            </div>
          </div>
        </div>
      </div>

      {/* Primary nav bar */}
      <div
        ref={primaryBarRef}
        className={`border-t border-border transition-all duration-300 ${
          pinned
            ? "fixed inset-x-0 top-0 z-50 bg-brand-600/80 backdrop-blur-md shadow-lg border-b border-white/10"
            : "bg-brand-600"
        } text-white`}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2 text-sm">
          <div className="hidden items-center gap-5 md:flex">
            <Link
              href="/"
              className={`relative py-1 transition-colors hover:text-yellow-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-yellow-300 after:transition-all hover:after:w-full ${isActive("/") ? "text-yellow-300 after:w-full" : ""}`}
            >
              Home
            </Link>

            {/* Dropdowns logic remains the same, just using href and Link */}
            <div
              className="relative group"
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button
                className="relative inline-flex items-center gap-1 py-1 transition-colors hover:text-yellow-300"
                onClick={() =>
                  setOpenMenu((m) => (m === "content" ? null : "content"))
                }
                ref={contentTriggerRef}
              >
                Content ▾
              </button>
              <div
                ref={contentMenuRef}
                className={`absolute left-0 top-full z-50 mt-2 w-56 rounded-md bg-surface p-2 text-text shadow-lg ring-1 ring-border transition-all ${openMenu === "content" ? "visible opacity-100" : "invisible opacity-0"}`}
              >
                {[
                  { href: "/insights", label: "Insights" },
                  { href: "/articles", label: "Articles" },
                  { href: "/podcasts", label: "Podcasts" },
                  { href: "/gallery", label: "Gallery" },
                  { href: "/categories", label: "Categories" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded px-3 py-2 text-sm hover:bg-[color-mix(in_oklab,var(--color-surface),white_8%)]"
                    onClick={() => setOpenMenu(null)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            {/* ... other dropdowns omitted for space, can be added later ... */}
          </div>

          <div className="ml-auto hidden items-center gap-3 md:flex">
            <Search placeholder="Search For" />
            <ThemeToggle />
          </div>
          <button
            className="md:hidden rounded px-2 py-1 text-sm text-white"
            onClick={() => setOpen((v) => !v)}
          >
            ☰
          </button>
        </div>
      </div>

      {pinned && <div style={{ height: barHeight }} />}

      {/* Mobile drawer (logic simplified for port) */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-surface p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <Logo />
              <button onClick={() => setOpen(false)}>✕</button>
            </div>
            <nav className="flex flex-col gap-4">
              <Link href="/" onClick={() => setOpen(false)}>
                Home
              </Link>
              <Link href="/articles" onClick={() => setOpen(false)}>
                Articles
              </Link>
              <Link href="/insights" onClick={() => setOpen(false)}>
                Insights
              </Link>
              <Link href="/talent" onClick={() => setOpen(false)}>
                Tech Talents
              </Link>
              {/* Add more as needed */}
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
}
