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
          remember information about your visit.
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
              details: [
                "Session management",
                "Security authentication",
                "Load balancing",
              ],
            },
            {
              title: "Analytics Cookies",
              desc: "Help us understand how visitors interact with our content anonymously.",
              lifetime: "Up to 2 years",
              details: [
                "Page views",
                "Time spent",
                "Device info",
                "Bounce rates",
              ],
            },
            {
              title: "Marketing Cookies",
              desc: "Used to deliver relevant advertisements and measure campaign effectiveness.",
              lifetime: "30 days to 2 years",
              details: [
                "Ad personalization",
                "Conversion tracking",
                "Remarketing",
              ],
            },
            {
              title: "Functional Cookies",
              desc: "Enable enhanced features like newsletters and theme preferences.",
              lifetime: "1 year",
              details: [
                "Newsletter prefs",
                "Language settings",
                "Social integration",
              ],
            },
          ].map((type) => (
            <div
              key={type.title}
              className="p-8 bg-background rounded-3xl border border-border/50 shadow-xl shadow-brand-500/5"
            >
              <h3 className="text-xl font-black uppercase italic tracking-tighter text-text mb-2">
                {type.title}
              </h3>
              <p className="text-sm text-muted mb-4 font-medium">{type.desc}</p>
              <ul className="grid grid-cols-2 gap-2 mb-6">
                {type.details.map((detail) => (
                  <li
                    key={detail}
                    className="text-[10px] font-bold text-muted/60 uppercase tracking-widest flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                    {detail}
                  </li>
                ))}
              </ul>
              <div className="text-[10px] font-black uppercase text-brand-500 tracking-widest border-t border-border/10 pt-4">
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
          functionality and personalization of our website.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-black uppercase tracking-tighter italic text-brand-500 mb-6">
          Contact Us
        </h2>
        <p>
          If you have any questions about our use of cookies, please contact us
          at{" "}
          <strong className="text-brand-500">
            privacy@liberiadigitalinsights.com
          </strong>
          .
        </p>
      </section>
    </LegalLayout>
  );
}
