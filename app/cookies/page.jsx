import React from "react";
import LegalLayout from "@/components/LegalLayout";

export const metadata = {
  title: "Cookie Policy - Liberia Digital Insights",
  description: "How we use cookies to improve your experience.",
};

export default function CookiesPage() {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <LegalLayout title="Cookie Policy" lastUpdated={lastUpdated}>
      <section>
        <h2 className="text-2xl font-black uppercase tracking-tighter italic text-brand-500 mb-6">
          What Are Cookies?
        </h2>
        <p>
          Cookies are small text files that are stored on your device (computer,
          tablet, or mobile) when you visit a website. They help websites
          remember information about your visit, making your experience more
          efficient and personalized.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-black uppercase tracking-tighter italic text-brand-500 mb-6">
          Types of Cookies We Use
        </h2>

        <div className="grid gap-6 not-prose">
          {[
            {
              title: "Essential Cookies",
              desc: "Required for basic website functionality, authentication, and security.",
              lifetime: "Session-based",
            },
            {
              title: "Analytics Cookies",
              desc: "Help us understand how visitors interact with our content anonymously.",
              lifetime: "Up to 2 years",
            },
            {
              title: "Functional Cookies",
              desc: "Enable enhanced features like newsletters and theme preferences.",
              lifetime: "1 year",
            },
          ].map((type) => (
            <div
              key={type.title}
              className="p-6 bg-background rounded-2xl border border-border/50 shadow-sm"
            >
              <h3 className="text-lg font-black uppercase italic tracking-tighter text-text mb-2">
                {type.title}
              </h3>
              <p className="text-sm text-muted mb-3 font-medium">{type.desc}</p>
              <div className="text-[10px] font-black uppercase text-brand-500 tracking-widest">
                LIFETIME: {type.lifetime}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-black uppercase tracking-tighter italic text-brand-500 mb-6">
          Managing Preferences
        </h2>
        <p>
          You can control cookies through your browser settings. Most browsers
          allow you to view, delete, or block cookies from specific sites.
        </p>
        <p>
          Please note that disabling certain cookies may impact the
          functionality and personalization of our website. For a more tailored
          experience, we recommend leaving cookies enabled.
        </p>
      </section>
    </LegalLayout>
  );
}
