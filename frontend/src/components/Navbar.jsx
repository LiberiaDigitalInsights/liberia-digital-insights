import { Link, NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import React from 'react';
import Logo from './Logo';
import Search from './Search';
import { CATEGORIES } from '../constants/categories';
import { FaFacebookF, FaTwitter, FaYoutube } from 'react-icons/fa';
import AdSlot from '../components/ads/AdSlot';

export default function Navbar() {
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

  React.useEffect(() => {
    function onDocClick(e) {
      if (!openMenu) return;
      const map = {
        content: { trigger: contentTriggerRef.current, menu: contentMenuRef.current },
        community: { trigger: communityTriggerRef.current, menu: communityMenuRef.current },
        more: { trigger: moreTriggerRef.current, menu: moreMenuRef.current },
      };
      const nodes = map[openMenu];
      if (!nodes) return;
      const t = e.target;
      if (nodes.trigger && nodes.menu && !nodes.trigger.contains(t) && !nodes.menu.contains(t)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [openMenu]);

  React.useEffect(() => {
    // Move focus into the opened menu's first item
    let menuEl = null;
    if (openMenu === 'content') menuEl = contentMenuRef.current;
    else if (openMenu === 'community') menuEl = communityMenuRef.current;
    else if (openMenu === 'more') menuEl = moreMenuRef.current;
    if (menuEl) {
      const firstItem = menuEl.querySelector('[role="menuitem"]');
      if (firstItem) {
        // delay to ensure visibility transition doesn't block focus
        setTimeout(() => firstItem.focus(), 0);
      }
    }
  }, [openMenu]);

  React.useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      // Pin once the page has scrolled a little (small threshold)
      setPinned(y > 40);
    };
    // Measure bar height for spacer to avoid layout shift
    const measure = () => {
      if (primaryBarRef.current) {
        setBarHeight(primaryBarRef.current.offsetHeight || 0);
      }
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
    };
  }, []);
  return (
    <nav className="z-40" role="navigation" aria-label="Primary">
      {/* Top utility strip with date + social */}
      <div className="hidden bg-[var(--color-nav-top)] text-xs md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5">
          <div className="text-white/90">
            <span className="hidden md:inline">
              {new Date().toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
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
          {/* Spacer to prevent layout jump when bar becomes fixed */}
          {pinned ? <div style={{ height: barHeight }} aria-hidden="true" /> : null}
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
        className={`border-t border-[var(--color-border)] bg-[var(--color-nav-bottom)] text-white ${
          pinned ? 'fixed inset-x-0 top-0 z-50 shadow-sm' : ''
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2 text-sm">
          <div className="hidden items-center gap-5 md:flex">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `relative py-1 transition-colors duration-200 hover:text-yellow-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-yellow-300 after:transition-all after:duration-300 hover:after:w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 ${
                  isActive ? 'text-yellow-300 after:w-full' : ''
                }`
              }
              aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
            >
              Home
            </NavLink>

            <div className="relative group" onMouseLeave={() => setOpenMenu(null)}>
              <button
                id="content-trigger"
                className="relative inline-flex items-center gap-1 py-1 transition-colors duration-200 hover:text-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300"
                aria-haspopup="menu"
                aria-controls="content-menu"
                aria-expanded={openMenu === 'content'}
                ref={contentTriggerRef}
                onClick={() => setOpenMenu((m) => (m === 'content' ? null : 'content'))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setOpenMenu((m) => (m === 'content' ? null : 'content'));
                  } else if (e.key === 'Escape') {
                    setOpenMenu(null);
                    setTimeout(() => contentTriggerRef.current?.focus(), 0);
                  }
                }}
              >
                Content
                <span
                  aria-hidden
                  className={`ml-0.5 text-xs opacity-80 transition-transform duration-200 ${openMenu === 'content' ? 'rotate-180' : ''}`}
                >
                  ▾
                </span>
              </button>
              <div
                id="content-menu"
                role="menu"
                tabIndex={-1}
                ref={contentMenuRef}
                className={`absolute left-0 top-full z-50 mt-2 w-56 rounded-md bg-[var(--color-surface)] p-2 text-[var(--color-text)] shadow-lg ring-1 ring-[var(--color-border)] transition-all duration-200 ${
                  openMenu === 'content' ? 'visible opacity-100' : 'invisible opacity-0'
                } group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100`}
              >
                {[
                  { to: '/insights', label: 'Insights' },
                  { to: '/articles', label: 'Articles' },
                  { to: '/podcasts', label: 'Podcasts' },
                  { to: '/gallery', label: 'Gallery' },
                  { to: '/tag/insighttechthursdays', label: '#InsightTechThursdays' },
                  { to: '/categories', label: 'Categories' },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    role="menuitem"
                    tabIndex={-1}
                    onClick={() => setOpenMenu(null)}
                    className="block rounded px-3 py-2 text-sm transition-colors duration-150 hover:bg-[color-mix(in_oklab,var(--color-surface),white_8%)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="relative group" onMouseLeave={() => setOpenMenu(null)}>
              <button
                id="community-trigger"
                className="relative inline-flex items-center gap-1 py-1 transition-colors duration-200 hover:text-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300"
                aria-haspopup="menu"
                aria-controls="community-menu"
                aria-expanded={openMenu === 'community'}
                ref={communityTriggerRef}
                onClick={() => setOpenMenu((m) => (m === 'community' ? null : 'community'))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setOpenMenu((m) => (m === 'community' ? null : 'community'));
                  } else if (e.key === 'Escape') {
                    setOpenMenu(null);
                    setTimeout(() => communityTriggerRef.current?.focus(), 0);
                  }
                }}
              >
                Community
                <span
                  aria-hidden
                  className={`ml-0.5 text-xs opacity-80 transition-transform duration-200 ${openMenu === 'community' ? 'rotate-180' : ''}`}
                >
                  ▾
                </span>
              </button>
              <div
                id="community-menu"
                role="menu"
                tabIndex={-1}
                ref={communityMenuRef}
                className={`absolute left-0 top-full z-50 mt-2 w-56 rounded-md bg-[var(--color-surface)] p-2 text-[var(--color-text)] shadow-lg ring-1 ring-[var(--color-border)] transition-all duration-200 ${
                  openMenu === 'community' ? 'visible opacity-100' : 'invisible opacity-0'
                } group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100`}
              >
                {[
                  { to: '/talent', label: 'Tech Talents' },
                  { to: '/training-courses', label: 'Training & Courses' },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    role="menuitem"
                    tabIndex={-1}
                    onClick={() => setOpenMenu(null)}
                    className="block rounded px-3 py-2 text-sm transition-colors duration-150 hover:bg-[color-mix(in_oklab,var(--color-surface),white_8%)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="relative group" onMouseLeave={() => setOpenMenu(null)}>
              <button
                id="more-trigger"
                className="relative inline-flex items-center gap-1 py-1 transition-colors duration-200 hover:text-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300"
                aria-haspopup="menu"
                aria-controls="more-menu"
                aria-expanded={openMenu === 'more'}
                ref={moreTriggerRef}
                onClick={() => setOpenMenu((m) => (m === 'more' ? null : 'more'))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setOpenMenu((m) => (m === 'more' ? null : 'more'));
                  } else if (e.key === 'Escape') {
                    setOpenMenu(null);
                    setTimeout(() => moreTriggerRef.current?.focus(), 0);
                  }
                }}
              >
                More
                <span
                  aria-hidden
                  className={`ml-0.5 text-xs opacity-80 transition-transform duration-200 ${openMenu === 'more' ? 'rotate-180' : ''}`}
                >
                  ▾
                </span>
              </button>
              <div
                id="more-menu"
                role="menu"
                tabIndex={-1}
                ref={moreMenuRef}
                className={`absolute left-0 top-full z-50 mt-2 w-56 rounded-md bg-[var(--color-surface)] p-2 text-[var(--color-text)] shadow-lg ring-1 ring-[var(--color-border)] transition-all duration-200 ${
                  openMenu === 'more' ? 'visible opacity-100' : 'invisible opacity-0'
                } group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100`}
              >
                {[
                  { to: '/about', label: 'About Us' },
                  { to: '/advertisement', label: 'Advertisement' },
                  { to: '/contact', label: 'Contact Us' },
                  { to: '/subscribe', label: 'Subscribe' },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    role="menuitem"
                    tabIndex={-1}
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
            <Search placeholder="Search For" onSubmit={(q) => console.log('search', q)} />
            <ThemeToggle />
          </div>
          <button
            className="md:hidden rounded px-2 py-1 text-sm text-white"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-drawer"
            onClick={() => setOpen((v) => !v)}
          >
            ☰
          </button>
        </div>
      </div>
      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* Drawer panel */}
        <div
          id="mobile-drawer"
          className={`absolute right-0 top-0 h-full w-full max-w-sm border-l border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
            <Logo />
            <button
              className="rounded-[var(--radius-sm)] p-2 text-[var(--color-text)] transition-colors duration-200 hover:bg-[color-mix(in_oklab,var(--color-surface),white_6%)]"
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
                <Search
                  onSubmit={(q) => {
                    setOpen(false);
                    console.log('search', q);
                  }}
                />
              </div>

              {/* Quick actions */}
              <div className="flex gap-2">
                <button className="flex-1 rounded-[var(--radius-md)] bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-brand-600">
                  Subscribe
                </button>
                <ThemeToggle />
              </div>

              {/* Main navigation */}
              <nav className="flex flex-col gap-1">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                  Navigation
                </div>
                {[
                  { to: '/', label: 'Home' },
                  { to: '/about', label: 'About Us' },
                  { to: '/insights', label: 'Insights' },
                  { to: '/podcasts', label: 'Podcasts' },
                  { to: '/articles', label: 'Articles' },
                  { to: '/gallery', label: 'Gallery' },
                  { to: '/advertisement', label: 'Advertisement' },
                  { to: '/talent', label: 'Tech Talents' },
                  { to: '/training-courses', label: 'Training & Courses' },
                  { to: '/contact', label: 'Contact Us' },
                  { to: '/signup', label: 'Sign Up' },
                ].map((item) => (
                  <Link
                    key={item.to}
                    onClick={() => setOpen(false)}
                    to={item.to}
                    className="rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors duration-200 hover:bg-[color-mix(in_oklab,var(--color-surface),white_8%)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Categories */}
              <div className="flex flex-col gap-2">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                  Categories
                </div>
                <div className="flex flex-col gap-1">
                  {CATEGORIES.slice(0, 12).map((c) => (
                    <Link
                      key={c}
                      onClick={() => setOpen(false)}
                      to={`/category/${encodeURIComponent(c.toLowerCase())}`}
                      className="rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-muted)] transition-colors duration-200 hover:bg-[color-mix(in_oklab,var(--color-surface),white_6%)] hover:text-[var(--color-text)]"
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
