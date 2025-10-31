import React from "react";
import { Muted } from "./ui/Typography";

const Footer = () => {
  return (
    <footer className="border-t border-[var(--color-border)] mt-12">
      <div className="mx-auto max-w-5xl px-6 py-6">
        <Muted>© {new Date().getFullYear()} Liberia Digital Insights</Muted>
      </div>
    </footer>
  );
};

export default Footer;
