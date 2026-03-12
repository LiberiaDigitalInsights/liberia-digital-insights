import React from "react";
import { FaYoutube, FaSpotify, FaApple } from "react-icons/fa";

export default function SocialBanner() {
  const socials = [
    { icon: FaYoutube, name: "YouTube", color: "text-[#FF0000]" },
    { icon: FaSpotify, name: "Spotify", color: "text-[#1DB954]" },
    { icon: FaApple, name: "Apple Podcasts", color: "text-text" },
  ];

  return (
    <div className="bg-brand-500/5 rounded-[2.5rem] py-12 px-8 md:px-12 flex flex-col md:flex-row items-center justify-between gap-12 border border-brand-500/10 shadow-2xl transition-all duration-500 hover:shadow-brand-500/10">
      <div className="text-center md:text-left">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-brand-500 mb-2">
          Follow Us Today
        </h2>
        <p className="text-sm font-medium text-muted">
          Don't miss a single story from Liberia's digital landscape.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-10 md:gap-12">
        {socials.map((social) => (
          <div
            key={social.name}
            className="flex items-center gap-4 group cursor-pointer"
          >
            <div
              className={`text-4xl ${social.color} transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(136,38,39,0.3)]`}
            >
              <social.icon />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-wider text-muted mb-1 opacity-70">
                LISTEN ON
              </span>
              <span className="text-lg font-bold tracking-tight text-text group-hover:text-brand-500 transition-colors">
                {social.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
