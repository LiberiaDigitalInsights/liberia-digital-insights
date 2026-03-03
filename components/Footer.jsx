import React from "react";
import Link from "next/link";
import Logo from "./Logo";
import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import FooterNewsletterWidget from "./FooterNewsletterWidget";

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
            backgroundSize: "40px 40px",
          }}
        />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.2fr_1fr_1.2fr] lg:gap-20">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <Logo />
            </div>
            <p className="text-base leading-relaxed text-muted font-medium">
              Your gateway to Liberia's digital transformation. We deliver
              insights, stories, and connections that matter.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                FaFacebookF,
                FaTwitter,
                FaYoutube,
                FaLinkedinIn,
                FaInstagram,
              ].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="group inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-all hover:bg-brand-500 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 sm:grid-cols-2 lg:gap-16">
            <nav className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text">
                Discover
              </h3>
              <ul className="space-y-3">
                {["Insights", "Podcasts", "Events", "Gallery", "Subscribe"].map(
                  (label) => (
                    <li key={label}>
                      <Link
                        href={`/${label.toLowerCase()}`}
                        className="text-sm text-muted hover:text-brand-500 transition-colors"
                      >
                        {label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>
            <nav className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text">
                Resources
              </h3>
              <ul className="space-y-3">
                {["Categories", "Articles", "About", "Contact"].map((label) => (
                  <li key={label}>
                    <Link
                      href={`/${label.toLowerCase()}`}
                      className="text-sm text-muted hover:text-brand-500 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-text">Stay Connected</h3>
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <FooterNewsletterWidget />
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-border pt-8 md:flex-row text-xs text-muted">
          <div>
            &copy; {new Date().getFullYear()} Liberia Digital Insights. All
            rights reserved.
          </div>
          <div className="flex gap-6">
            <Link href="/cookies" className="hover:underline">
              Cookies
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
