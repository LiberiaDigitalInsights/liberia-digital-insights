"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import React from "react";
import Logo from "./Logo";
import Search from "./Search";
import { CATEGORIES } from "@/constants/categories";
import { FaFacebookF, FaHamburger, FaTwitter, FaYoutube } from "react-icons/fa";
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

  // Do not show navbar on admin pages
  // if (pathname?.startsWith("/admin")) return null;

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
      {/* Top utility strip with date + social */}
      <div className="hidden bg-nav-top text-xs md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 font-medium">
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
              className="transition-transform duration-200 hover:scale-110 hover:opacity-90"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="transition-transform duration-200 hover:scale-110 hover:opacity-90"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="transition-transform duration-200 hover:scale-110 hover:opacity-90"
            >
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      {/* Mid header with logo + banner ad */}
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

      {/* Primary nav bar with menu + search */}
      <div
        ref={primaryBarRef}
        className={`border-t border-border transition-all duration-300 ${
          pinned
            ? "fixed inset-x-0 top-0 z-50 bg-brand-600/80 backdrop-blur-md shadow-lg border-b border-white/10"
            : "bg-brand-600"
        } text-white`}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2 text-sm font-semibold tracking-wide">
          <div className="hidden items-center gap-5 md:flex">
            <Link
              href="/"
              className={`relative py-1 transition-colors duration-200 hover:text-yellow-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-yellow-300 after:transition-all after:duration-300 hover:after:w-full ${
                isActive("/") ? "text-yellow-300 after:w-full" : ""
              }`}
            >
              Home
            </Link>

            <div
              className="relative group"
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button
                id="content-trigger"
                className={`relative inline-flex items-center gap-1 py-1 transition-colors duration-200 hover:text-yellow-300 ${openMenu === "content" ? "text-yellow-300" : ""}`}
                aria-haspopup="menu"
                aria-controls="content-menu"
                aria-expanded={openMenu === "content"}
                ref={contentTriggerRef}
                onClick={() =>
                  setOpenMenu((m) => (m === "content" ? null : "content"))
                }
              >
                Content
                <span
                  aria-hidden
                  className={`ml-0.5 text-xs opacity-80 transition-transform duration-200 ${openMenu === "content" ? "rotate-180" : ""}`}
                >
                  ▾
                </span>
              </button>
              <div
                id="content-menu"
                role="menu"
                ref={contentMenuRef}
                className={`absolute left-0 top-full z-50 mt-2 w-56 rounded-md bg-surface p-2 text-text shadow-lg ring-1 ring-border transition-all duration-200 ${
                  openMenu === "content"
                    ? "visible opacity-100 translate-y-0"
                    : "invisible opacity-0 translate-y-2"
                } group-hover:visible group-hover:opacity-100 group-hover:translate-y-0`}
              >
                {[
                  { href: "/insights", label: "Insights" },
                  { href: "/articles", label: "Articles" },
                  { href: "/podcasts", label: "Podcasts" },
                  {
                    href: "/tag/insighttechthursday",
                    label: "#InsightTechThursday",
                  },
                  { href: "/gallery", label: "Gallery" },
                  { href: "/events", label: "Events" },
                  { href: "/categories", label: "Categories" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    onClick={() => setOpenMenu(null)}
                    className="block rounded px-3 py-2 text-sm transition-colors duration-150 hover:bg-[color-mix(in_oklab,var(--color-surface),white_8%)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div
              className="relative group"
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button
                id="community-trigger"
                className={`relative inline-flex items-center gap-1 py-1 transition-colors duration-200 hover:text-yellow-300 ${openMenu === "community" ? "text-yellow-300" : ""}`}
                aria-haspopup="menu"
                aria-controls="community-menu"
                aria-expanded={openMenu === "community"}
                ref={communityTriggerRef}
                onClick={() =>
                  setOpenMenu((m) => (m === "community" ? null : "community"))
                }
              >
                Community
                <span
                  aria-hidden
                  className={`ml-0.5 text-xs opacity-80 transition-transform duration-200 ${openMenu === "community" ? "rotate-180" : ""}`}
                >
                  ▾
                </span>
              </button>
              <div
                id="community-menu"
                role="menu"
                ref={communityMenuRef}
                className={`absolute left-0 top-full z-50 mt-2 w-56 rounded-md bg-surface p-2 text-text shadow-lg ring-1 ring-border transition-all duration-200 ${
                  openMenu === "community"
                    ? "visible opacity-100 translate-y-0"
                    : "invisible opacity-0 translate-y-2"
                } group-hover:visible group-hover:opacity-100 group-hover:translate-y-0`}
              >
                {[
                  { href: "/talent", label: "Tech Talents" },
                  { href: "/training", label: "Training & Courses" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    onClick={() => setOpenMenu(null)}
                    className="block rounded px-3 py-2 text-sm transition-colors duration-150 hover:bg-[color-mix(in_oklab,var(--color-surface),white_8%)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div
              className="relative group"
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button
                id="more-trigger"
                className={`relative inline-flex items-center gap-1 py-1 transition-colors duration-200 hover:text-yellow-300 ${openMenu === "more" ? "text-yellow-300" : ""}`}
                aria-haspopup="menu"
                aria-controls="more-menu"
                aria-expanded={openMenu === "more"}
                ref={moreTriggerRef}
                onClick={() =>
                  setOpenMenu((m) => (m === "more" ? null : "more"))
                }
              >
                More
                <span
                  aria-hidden
                  className={`ml-0.5 text-xs opacity-80 transition-transform duration-200 ${openMenu === "more" ? "rotate-180" : ""}`}
                >
                  ▾
                </span>
              </button>
              <div
                id="more-menu"
                role="menu"
                ref={moreMenuRef}
                className={`absolute left-0 top-full z-50 mt-2 w-56 rounded-md bg-surface p-2 text-text shadow-lg ring-1 ring-border transition-all duration-200 ${
                  openMenu === "more"
                    ? "visible opacity-100 translate-y-0"
                    : "invisible opacity-0 translate-y-2"
                } group-hover:visible group-hover:opacity-100 group-hover:translate-y-0`}
              >
                {[
                  { href: "/about", label: "About Us" },
                  { href: "/advertising", label: "Advertisement" },
                  { href: "/bookmarks", label: "My Bookmarks" },
                  { href: "/contact", label: "Contact Us" },
                  { href: "/subscribe", label: "Subscribe" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    onClick={() => setOpenMenu(null)}
                    className="block rounded px-3 py-2 text-sm transition-colors duration-150 hover:bg-[color-mix(in_oklab,var(--color-surface),white_8%)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="ml-auto hidden items-center gap-3 md:flex">
            <Search placeholder="Search For" />
            <ThemeToggle />
          </div>
          <button
            className="md:hidden rounded px-2 py-1 text-sm text-white"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-drawer"
            onClick={() => setOpen((v) => !v)}
          >
            <FaHamburger />
          </button>
        </div>
      </div>
      {/* Spacer to prevent layout shift when bar is pinned */}
      {pinned && <div style={{ height: barHeight }} aria-hidden="true" />}

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
        inert={!open ? true : undefined}
      >
        {/* Backdrop */}
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        />
        {/* Drawer panel */}
        <div
          id="mobile-drawer"
          className={`absolute right-0 top-0 h-full w-full max-w-sm border-l border-border bg-surface shadow-2xl transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
            <Logo />
            <button
              className="rounded-sm p-2 text-text transition-colors duration-200 hover:bg-[color-mix(in_oklab,var(--color-surface),white_6%)]"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <span className="text-lg">✕</span>
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex h-[calc(100vh-60px)] flex-col overflow-y-auto">
            <div className="flex flex-col gap-4 p-4">
              {/* Search */}
              <div>
                <Search onSubmit={() => setOpen(false)} />
              </div>

              {/* Quick actions */}
              <div className="flex gap-2">
                <Link
                  href="/subscribe"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-md bg-brand-500 px-4 py-2.5 text-center text-sm font-medium text-white transition-colors duration-200 hover:bg-brand-600"
                >
                  Subscribe
                </Link>
                <ThemeToggle />
              </div>

              {/* Main navigation */}
              <nav className="flex flex-col gap-1">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                  Navigation
                </div>
                {[
                  { href: "/", label: "Home" },
                  { href: "/about", label: "About Us" },
                  { href: "/insights", label: "Insights" },
                  { href: "/podcasts", label: "Podcasts" },
                  {
                    href: "/tag/insighttechthursday",
                    label: "#InsightTechThursday",
                  },
                  { href: "/articles", label: "Articles" },
                  { href: "/gallery", label: "Gallery" },
                  { href: "/events", label: "Events" },
                  { href: "/advertising", label: "Advertisement" },
                  { href: "/talent", label: "Tech Talents" },
                  { href: "/training", label: "Training & Courses" },
                  { href: "/bookmarks", label: "My Bookmarks" },
                  { href: "/contact", label: "Contact Us" },
                  { href: "/register", label: "Sign Up" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-sm px-3 py-2.5 text-sm font-medium text-text transition-colors duration-200 hover:bg-[color-mix(in_oklab,var(--color-surface),white_8%)] ${
                      isActive(item.href)
                        ? "bg-brand-500/10 text-brand-500"
                        : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Categories */}
              <div className="flex flex-col gap-2">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                  Categories
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {CATEGORIES.map((c) => (
                    <Link
                      key={c}
                      onClick={() => setOpen(false)}
                      href={`/category/${encodeURIComponent(c.toLowerCase())}`}
                      className="rounded-sm px-3 py-2 text-xs text-muted transition-colors duration-200 hover:bg-[color-mix(in_oklab,var(--color-surface),white_6%)] hover:text-text"
                    >
                      {c}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
