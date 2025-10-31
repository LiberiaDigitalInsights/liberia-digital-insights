import React from 'react';
import Input from './ui/Input';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants/categories';

export default function Search({ placeholder = 'Search…', className, onResults }) {
  const [q, setQ] = React.useState('');
  const [results, setResults] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    const handler = (e) => {
      if (!containerRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  React.useEffect(() => {
    const id = setTimeout(() => {
      const term = q.trim();
      if (term.length < 3) {
        setResults([]);
        setOpen(false);
        onResults?.([]);
        return;
      }
      // Simple local search demo against categories and key nav items
      const pool = [
        ...CATEGORIES.map((c) => ({ label: c, to: `/category/${encodeURIComponent(c.toLowerCase())}` })),
        { label: 'Home', to: '/' },
        { label: 'About Us', to: '/about' },
        { label: 'Podcasts', to: '/podcasts' },
        { label: 'Articles', to: '/articles' },
        { label: 'Contact Us', to: '/contact' },
      ];
      const filtered = pool.filter((p) => p.label.toLowerCase().includes(term.toLowerCase())).slice(0, 8);
      setResults(filtered);
      setOpen(true);
      onResults?.(filtered);
    }, 250);
    return () => clearTimeout(id);
  }, [q, onResults]);

  return (
    <div ref={containerRef} className={className + ' relative'}>
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="w-64 md:w-72"
        aria-autocomplete="list"
        aria-expanded={open}
        role="combobox"
      />
      {open && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow">
          <ul className="max-h-72 overflow-y-auto py-1 text-sm">
            {results.map((r) => (
              <li key={r.to}>
                <Link
                  to={r.to}
                  className="block px-3 py-2 hover:bg-[color-mix(in_oklab,var(--color-surface),white_6%)]"
                  onClick={() => setOpen(false)}
                >
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

