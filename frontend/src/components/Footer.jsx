import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { FaFacebookF, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="mt-12 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo & Contact */}
          <div className="space-y-4">
            <Logo />
            <div className="space-y-2 text-sm text-[var(--color-muted)]">
              <div>
                <span className="font-medium">Advertise with us:</span>{' '}
                <a
                  href="mailto:sales@liberiadigitalinsights"
                  className="hover:text-[var(--color-text)]"
                >
                  sales@liberiadigitalinsights
                </a>
              </div>
              <div>
                <span className="font-medium">Send your PR:</span>{' '}
                <a
                  href="mailto:newsroom@liberiadigitalinsights.news"
                  className="hover:text-[var(--color-text)]"
                >
                  newsroom@liberiadigitalinsights.news
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase">Focus</h4>
            <ul className="space-y-2 text-sm text-[var(--color-muted)]">
              <li>
                <Link to="/podcasts" className="hover:text-[var(--color-text)]">
                  The Podcast
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase">Special</h4>
            <ul className="space-y-2 text-sm text-[var(--color-muted)]">
              <li>
                <Link to="/insights" className="hover:text-[var(--color-text)]">
                  Our Specials
                </Link>
              </li>
              <li>
                <Link to="/insights" className="hover:text-[var(--color-text)]">
                  #TechinsightThursday
                </Link>
              </li>
              <li>
                <Link to="/podcasts" className="hover:text-[var(--color-text)]">
                  Podcast Interviews
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase">Events & Resource</h4>
            <ul className="space-y-2 text-sm text-[var(--color-muted)]">
              <li>
                <Link to="/events" className="hover:text-[var(--color-text)]">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-[var(--color-text)]">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-[var(--color-text)]">
                  Telecoms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border)] pt-6 md:flex-row">
          <p className="text-sm text-[var(--color-muted)]">
            All rights reserved || Liberia Digital Insights
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              aria-label="Facebook"
              className="text-[var(--color-muted)] transition-colors duration-200 hover:text-[var(--color-text)]"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="text-[var(--color-muted)] transition-colors duration-200 hover:text-[var(--color-text)]"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="text-[var(--color-muted)] transition-colors duration-200 hover:text-[var(--color-text)]"
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
