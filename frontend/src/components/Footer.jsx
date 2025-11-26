import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { FaFacebookF, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer
      className="mt-12 border-t border-[var(--color-border)] bg-[linear-gradient(to_bottom,var(--color-surface),color-mix(in_oklab,var(--color-surface),black_4%))]"
      aria-label="Site footer"
    >
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Logo & Contact */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Logo />
            </div>
            <div className="space-y-2 text-sm text-[var(--color-muted)]">
              <div>
                <span className="font-medium">Advertise with us:</span>{' '}
                <a
                  href="mailto:sales@liberiadigitalinsights.com"
                  className="transition-colors hover:text-[var(--color-text)]"
                >
                  sales@liberiadigitalinsights.com
                </a>
              </div>
              <div>
                <span className="font-medium">Send your PR:</span>{' '}
                <a
                  href="mailto:newsroom@liberiadigitalinsights.com"
                  className="transition-colors hover:text-[var(--color-text)]"
                >
                  newsroom@liberiadigitalinsights.com
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav aria-labelledby="footer-focus-heading">
            <h2
              id="footer-focus-heading"
              className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]"
            >
              Focus
            </h2>
            <ul className="space-y-2 text-sm text-[var(--color-muted)]">
              <li>
                <Link
                  to="/podcasts"
                  className="rounded-[var(--radius-sm)] underline-offset-4 transition-colors hover:text-[var(--color-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
                >
                  The Podcast
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-special-heading">
            <h2
              id="footer-special-heading"
              className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]"
            >
              Special
            </h2>
            <ul className="space-y-2 text-sm text-[var(--color-muted)]">
              <li>
                <Link
                  to="/insights"
                  className="rounded-[var(--radius-sm)] underline-offset-4 transition-colors hover:text-[var(--color-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
                >
                  Our Specials
                </Link>
              </li>
              <li>
                <Link
                  to="/tag/insighttechthursdays"
                  className="rounded-[var(--radius-sm)] underline-offset-4 transition-colors hover:text-[var(--color-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
                >
                  #InsightTechThursday
                </Link>
              </li>
              <li>
                <Link
                  to="/podcasts"
                  className="rounded-[var(--radius-sm)] underline-offset-4 transition-colors hover:text-[var(--color-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
                >
                  Podcast Interviews
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-events-heading">
            <h2
              id="footer-events-heading"
              className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]"
            >
              Events & Resource
            </h2>
            <ul className="space-y-2 text-sm text-[var(--color-muted)]">
              <li>
                <Link
                  to="/events"
                  className="rounded-[var(--radius-sm)] underline-offset-4 transition-colors hover:text-[var(--color-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className="rounded-[var(--radius-sm)] underline-offset-4 transition-colors hover:text-[var(--color-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="rounded-[var(--radius-sm)] underline-offset-4 transition-colors hover:text-[var(--color-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="rounded-[var(--radius-sm)] underline-offset-4 transition-colors hover:text-[var(--color-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
                >
                  Telecoms
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border)] pt-6 md:flex-row">
          <p className="text-sm text-[var(--color-muted)]">
            © {new Date().getFullYear()} Liberia Digital Insights — All rights reserved
          </p>
          <div className="flex items-center gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-muted)] transition-colors hover:bg-[color-mix(in_oklab,var(--color-surface),white_6%)] hover:text-[var(--color-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-muted)] transition-colors hover:bg-[color-mix(in_oklab,var(--color-surface),white_6%)] hover:text-[var(--color-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-muted)] transition-colors hover:bg-[color-mix(in_oklab,var(--color-surface),white_6%)] hover:text-[var(--color-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
            >
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
