"use client";

import React from "react";
import Modal from "@/components/ui/Modal";
import LazyImage from "@/components/LazyImage";
import {
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaGlobe,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function GuestModal({ open, onClose, guest }) {
  if (!guest) return null;

  const socialIcons = {
    twitter: <FaTwitter />,
    linkedin: <FaLinkedin />,
    facebook: <FaFacebook />,
    website: <FaGlobe />,
  };

  const links = guest.links || {};

  return (
    <Modal open={open} onClose={onClose} title="Guest Speaker" size="lg">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Avatar & Info */}
        <div className="w-full md:w-1/3 flex flex-col items-center text-center">
          <div className="relative w-40 h-40 rounded-3xl overflow-hidden border-4 border-surface/50 shadow-xl mb-4 group">
            {guest.avatar_url ? (
              <LazyImage
                src={guest.avatar_url}
                alt={guest.name}
                className="transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-brand-500/10 text-brand-500 text-6xl font-black italic">
                {guest.name?.charAt(0)}
              </div>
            )}
          </div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-text">
            {guest.name}
          </h2>
          <p className="text-sm font-bold text-brand-500 uppercase tracking-widest mb-4">
            {guest.role || "Guest Speaker"}
          </p>

          {guest.location && (
            <div className="flex items-center gap-2 text-muted text-sm mb-6">
              <FaMapMarkerAlt className="text-brand-500" />
              <span>{guest.location}</span>
            </div>
          )}

          {/* Social Links */}
          {Object.keys(links).length > 0 && (
            <div className="flex flex-wrap justify-center gap-3">
              {Object.entries(links).map(([platform, url]) => {
                const icon = socialIcons[platform.toLowerCase()] || <FaGlobe />;
                if (!url) return null;
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface/50 border border-border/10 text-muted hover:text-brand-500 hover:border-brand-500/30 transition-all duration-300"
                    title={platform}
                  >
                    {icon}
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Bio & Details */}
        <div className="w-full md:w-2/3">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-muted mb-3">
              About the Guest
            </p>
            <div className="prose prose-invert max-w-none text-sm leading-relaxed text-text/80">
              {guest.bio ? (
                <div dangerouslySetInnerHTML={{ __html: guest.bio }} />
              ) : (
                <p>No biography available for this guest speaker.</p>
              )}
            </div>
          </div>

          {guest.skills && guest.skills.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted mb-3">
                Expertise
              </p>
              <div className="flex flex-wrap gap-2">
                {guest.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full bg-surface/80 border border-border/10 text-[10px] font-bold uppercase tracking-wider text-text/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
