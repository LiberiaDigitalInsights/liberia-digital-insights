import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { FaFacebookF, FaTwitter, FaYoutube, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import FooterNewsletterWidget from './FooterNewsletterWidget';

const Footer = () => {
  return (
    <footer
      className="relative mt-16 overflow-hidden bg-surface border-t border-border"
      aria-label="Site footer"
    >
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, currentColor 1px, transparent 1px),
                         radial-gradient(circle at 75% 75%, currentColor 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:py-20">
        {/* Main content grid */}
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.2fr_1fr_1.2fr] lg:gap-20">
          {/* Brand & contact */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-linear-to-br from-brand-500/10 to-brand-600/5 p-3">
                <Logo />
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-base leading-relaxed text-muted font-medium">
                Your gateway to Liberia's digital transformation. We deliver insights, stories, and
                connections that matter.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-2 w-2 rounded-full bg-brand-500" />
                  <span className="text-sm text-text font-medium">Advertise:</span>
                  <a
                    href="mailto:sales@liberiadigitalinsights.com"
                    className="text-sm text-muted transition-all duration-200 hover:text-brand-500 hover:underline"
                  >
                    sales@liberiadigitalinsights.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-2 w-2 rounded-full bg-brand-500" />
                  <span className="text-sm text-text font-medium">Newsroom:</span>
                  <a
                    href="mailto:newsroom@liberiadigitalinsights.com"
                    className="text-sm text-muted transition-all duration-200 hover:text-brand-500 hover:underline"
                  >
                    newsroom@liberiadigitalinsights.com
                  </a>
                </div>
              </div>
            </div>

            {/* Enhanced social links */}
            <div className="pt-4">
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">
                Connect With Us
              </h4>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://facebook.com/LiberiaDigitalInsights"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-all duration-200 hover:border-brand-500 hover:bg-brand-500 hover:text-white hover:shadow-lg hover:shadow-brand-500/25 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus:outline-none"
                >
                  <FaFacebookF className="h-4 w-4" />
                </a>
                <a
                  href="https://x.com/LiberiaDigitalInsights"
                  aria-label="X (Twitter)"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-all duration-200 hover:border-brand-500 hover:bg-brand-500 hover:text-white hover:shadow-lg hover:shadow-brand-500/25 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus:outline-none"
                >
                  <FaTwitter className="h-4 w-4" />
                </a>
                <a
                  href="https://youtube.com/@LiberiaDigitalInsights"
                  aria-label="YouTube"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-all duration-200 hover:border-brand-500 hover:bg-brand-500 hover:text-white hover:shadow-lg hover:shadow-brand-500/25 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus:outline-none"
                >
                  <FaYoutube className="h-4 w-4" />
                </a>
                <a
                  href="https://linkedin.com/company/LiberiaDigitalInsights"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-all duration-200 hover:border-brand-500 hover:bg-brand-500 hover:text-white hover:shadow-lg hover:shadow-brand-500/25 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus:outline-none"
                >
                  <FaLinkedinIn className="h-4 w-4" />
                </a>
                <a
                  href="https://instagram.com/LiberiaDigitalInsights"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-all duration-200 hover:border-brand-500 hover:bg-brand-500 hover:text-white hover:shadow-lg hover:shadow-brand-500/25 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus:outline-none"
                >
                  <FaInstagram className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Links grid */}
          <div className="grid grid-cols-2 gap-12 sm:grid-cols-2 lg:gap-16">
            <nav aria-labelledby="footer-discover-heading" className="space-y-6">
              <h3
                id="footer-discover-heading"
                className="text-sm font-bold uppercase tracking-wider text-text"
              >
                Discover
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/insights"
                    className="group flex items-center gap-2 text-sm text-muted transition-all duration-200 hover:text-brand-500 hover:translate-x-1"
                  >
                    <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      →
                    </span>
                    Insights
                  </Link>
                </li>
                <li>
                  <Link
                    to="/podcasts"
                    className="group flex items-center gap-2 text-sm text-muted transition-all duration-200 hover:text-brand-500 hover:translate-x-1"
                  >
                    <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      →
                    </span>
                    Podcasts
                  </Link>
                </li>
                <li>
                  <Link
                    to="/events"
                    className="group flex items-center gap-2 text-sm text-muted transition-all duration-200 hover:text-brand-500 hover:translate-x-1"
                  >
                    <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      →
                    </span>
                    Events
                  </Link>
                </li>
                <li>
                  <Link
                    to="/gallery"
                    className="group flex items-center gap-2 text-sm text-muted transition-all duration-200 hover:text-brand-500 hover:translate-x-1"
                  >
                    <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      →
                    </span>
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link
                    to="/subscribe"
                    className="group flex items-center gap-2 text-sm text-muted transition-all duration-200 hover:text-brand-500 hover:translate-x-1"
                  >
                    <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      →
                    </span>
                    Subscribe
                  </Link>
                </li>
              </ul>
            </nav>

            <nav aria-labelledby="footer-special-heading" className="space-y-6">
              <h3
                id="footer-special-heading"
                className="text-sm font-bold uppercase tracking-wider text-text"
              >
                Special
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/insights"
                    className="group flex items-center gap-2 text-sm text-muted transition-all duration-200 hover:text-brand-500 hover:translate-x-1"
                  >
                    <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      →
                    </span>
                    #TechinsightThursday
                  </Link>
                </li>
                <li>
                  <Link
                    to="/podcasts"
                    className="group flex items-center gap-2 text-sm text-muted transition-all duration-200 hover:text-brand-500 hover:translate-x-1"
                  >
                    <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      →
                    </span>
                    Podcast Interviews
                  </Link>
                </li>
                <li>
                  <Link
                    to="/talent"
                    className="group flex items-center gap-2 text-sm text-muted transition-all duration-200 hover:text-brand-500 hover:translate-x-1"
                  >
                    <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      →
                    </span>
                    Talent Hub
                  </Link>
                </li>
                <li>
                  <Link
                    to="/training-courses"
                    className="group flex items-center gap-2 text-sm text-muted transition-all duration-200 hover:text-brand-500 hover:translate-x-1"
                  >
                    <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      →
                    </span>
                    Training & Courses
                  </Link>
                </li>
              </ul>
            </nav>

            <nav aria-labelledby="footer-resources-heading" className="space-y-6">
              <h3
                id="footer-resources-heading"
                className="text-sm font-bold uppercase tracking-wider text-text"
              >
                Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/categories"
                    className="group flex items-center gap-2 text-sm text-muted transition-all duration-200 hover:text-brand-500 hover:translate-x-1"
                  >
                    <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      →
                    </span>
                    Categories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/articles"
                    className="group flex items-center gap-2 text-sm text-muted transition-all duration-200 hover:text-brand-500 hover:translate-x-1"
                  >
                    <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      →
                    </span>
                    Articles
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="group flex items-center gap-2 text-sm text-muted transition-all duration-200 hover:text-brand-500 hover:translate-x-1"
                  >
                    <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      →
                    </span>
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="group flex items-center gap-2 text-sm text-muted transition-all duration-200 hover:text-brand-500 hover:translate-x-1"
                  >
                    <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      →
                    </span>
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-brand-500/10 to-brand-600/10 px-4 py-2 border border-brand-500/20">
                <div className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
                <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
                  Newsletter
                </span>
              </div>
              <h3 className="text-xl font-bold text-text leading-tight">Stay Connected</h3>
              <p className="text-base leading-relaxed text-muted">
                Get weekly insights and exclusive updates delivered straight to your inbox. Join our
                community of digital innovators.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <FooterNewsletterWidget />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-border pt-8 md:flex-row">
          <div className="flex items-center gap-2 text-xs text-muted">
            <span>&copy; {new Date().getFullYear()} Liberia Digital Insights</span>
            <span className="text-border">•</span>
            <span>All rights reserved</span>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <Link
              to="/privacy"
              className="text-muted transition-colors hover:text-text hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-muted transition-colors hover:text-text hover:underline"
            >
              Terms of Service
            </Link>
            <Link
              to="/cookies"
              className="text-muted transition-colors hover:text-text hover:underline"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
