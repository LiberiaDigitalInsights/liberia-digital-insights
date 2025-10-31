import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import React from 'react';

function Navbar() {
  const [open, setOpen] = React.useState(false);
  return (
    <nav className="border-b border-[var(--color-border)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4 md:p-6">
        <button
          className="md:hidden rounded px-2 py-1 text-sm hover:bg-[color-mix(in_oklab,var(--color-surface),white_6%)]"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>
        <div className="hidden md:flex gap-6">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/components">Components</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>
        <ThemeToggle />
      </div>
      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* Drawer panel */}
        <div
          className={`absolute right-0 top-0 h-full w-72 border-l border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between p-4">
            <span className="text-sm font-semibold">Menu</span>
            <button
              className="rounded px-2 py-1 text-sm hover:bg-[color-mix(in_oklab,var(--color-surface),white_6%)]"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-col gap-2 p-4">
            <Link onClick={() => setOpen(false)} to="/">Home</Link>
            <Link onClick={() => setOpen(false)} to="/about">About</Link>
            <Link onClick={() => setOpen(false)} to="/contact">Contact</Link>
            <Link onClick={() => setOpen(false)} to="/components">Components</Link>
            <Link onClick={() => setOpen(false)} to="/dashboard">Dashboard</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
