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
      {open && (
        <div className="md:hidden border-t border-[var(--color-border)]">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 p-4">
            <Link onClick={() => setOpen(false)} to="/">Home</Link>
            <Link onClick={() => setOpen(false)} to="/about">About</Link>
            <Link onClick={() => setOpen(false)} to="/contact">Contact</Link>
            <Link onClick={() => setOpen(false)} to="/components">Components</Link>
            <Link onClick={() => setOpen(false)} to="/dashboard">Dashboard</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
