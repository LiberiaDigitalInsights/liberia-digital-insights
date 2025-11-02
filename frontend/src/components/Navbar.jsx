import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import React from 'react';
import Logo from './Logo';
import Search from './Search';
import { CATEGORIES } from '../constants/categories';
import { FaFacebookF, FaTwitter, FaYoutube } from 'react-icons/fa';

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  return (
    <nav className="sticky top-0 z-40">
      {/* Top utility strip with date + social */}
      <div className="hidden bg-[var(--color-nav-top)] text-xs md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5">
          <div className="text-white/90">Advertisement</div>
          <div className="flex items-center gap-4 text-white">
            <span className="hidden md:inline">
              {new Date().toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </span>
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
      <div className="bg-[var(--color-nav-mid)]/60 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-nav-mid)]/50">
        <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr] items-center gap-6 px-4 py-4">
          <Logo />
          <div className="hidden justify-end md:flex">
            <div className="h-14 w-[520px] rounded-[var(--radius-md)] bg-[color-mix(in_oklab,var(--color-surface),white_8%)] ring-1 ring-[var(--color-border)]" />
          </div>
        </div>
      </div>

      {/* Primary nav bar with menu + search */}
      <div className="border-t border-[var(--color-border)] bg-[var(--color-nav-bottom)] text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2 text-sm">
          <div className="hidden items-center gap-5 md:flex">
            <Link
              to="/"
              className="relative py-1 transition-colors duration-200 hover:text-yellow-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-yellow-300 after:transition-all after:duration-300 hover:after:w-full"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="relative py-1 transition-colors duration-200 hover:text-yellow-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-yellow-300 after:transition-all after:duration-300 hover:after:w-full"
            >
              About Us
            </Link>
            <Link
              to="/insights"
              className="relative py-1 transition-colors duration-200 hover:text-yellow-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-yellow-300 after:transition-all after:duration-300 hover:after:w-full"
            >
              Insights
            </Link>
            <Link
              to="/podcasts"
              className="relative py-1 transition-colors duration-200 hover:text-yellow-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-yellow-300 after:transition-all after:duration-300 hover:after:w-full"
            >
              Podcasts
            </Link>
            <Link
              to="/articles"
              className="relative py-1 transition-colors duration-200 hover:text-yellow-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-yellow-300 after:transition-all after:duration-300 hover:after:w-full"
            >
              Articles
            </Link>
            <Link
              to="/advertisement"
              className="relative py-1 transition-colors duration-200 hover:text-yellow-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-yellow-300 after:transition-all after:duration-300 hover:after:w-full"
            >
              Advertisement
            </Link>
            <Link
              to="/contact"
              className="relative py-1 transition-colors duration-200 hover:text-yellow-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-yellow-300 after:transition-all after:duration-300 hover:after:w-full"
            >
              Contact Us
            </Link>
            <Link
              to="/signup"
              className="relative py-1 transition-colors duration-200 hover:text-yellow-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-yellow-300 after:transition-all after:duration-300 hover:after:w-full"
            >
              Sign Up
            </Link>
          </div>
          <div className="ml-auto hidden items-center gap-3 md:flex">
            <Search placeholder="Search For" onSubmit={(q) => console.log('search', q)} />
            <ThemeToggle />
          </div>
          <button
            className="md:hidden rounded px-2 py-1 text-sm text-white"
            aria-label="Toggle menu"
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
                  { to: '/advertisement', label: 'Advertisement' },
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
