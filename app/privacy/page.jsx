import React from "react";
import LegalLayout from "@/components/LegalLayout";

export const metadata = {
  title: "Privacy Policy - Liberia Digital Insights",
  description: "How we handle your data at Liberia Digital Insights.",
};

export default function PrivacyPage() {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <LegalLayout title="Privacy Policy" lastUpdated={lastUpdated}>
      <section>
        <h2 className="text-2xl font-black uppercase tracking-tighter italic text-brand-500 mb-6">
          1. Introduction
        </h2>
        <p>
          Liberia Digital Insights ("we," "us," or "our") is committed to
          protecting your privacy. This Privacy Policy explains how we collect,
          use, disclose, and safeguard your information when you visit our
          website <strong>liberiadigitalinsights.com</strong> and use our
          services.
        </p>
        <p>
          By using our website, you consent to the collection and use of
          information in accordance with this policy. We take data protection
          seriously and implement state-of-the-art security measures to ensure
          your data remains yours.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-black uppercase tracking-tighter italic text-brand-500 mb-6">
          2. Information We Collect
        </h2>
        <h3>Personal Information</h3>
        <p>
          We may collect personally identifiable information that you
          voluntarily provide to us, including:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-8">
          <li>Name and email address (for newsletter subscription)</li>
          <li>Company and organization details</li>
          <li>Job position and professional information</li>
          <li>Contact information submitted through our forms</li>
          <li>Comments and feedback you provide</li>
        </ul>

        <h3>Automatically Collected Information</h3>
        <p>
          When you visit our website, we automatically collect certain technical
          information:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>IP address and geolocation data</li>
          <li>Browser type, operating system, and device information</li>
          <li>Pages visited and time spent on our site</li>
          <li>Referring website and search terms</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-black uppercase tracking-tighter italic text-brand-500 mb-6">
          3. Data Security & Storage
        </h2>
        <p>
          In an era of digital omnipresence, security is not an afterthought—it
          is our core priority. We implement appropriate technical and
          organizational measures to protect your personal information against
          unauthorized access, alteration, disclosure, or destruction.
        </p>
        <p>
          Your data is encrypted at rest and in transit using industry-standard
          protocols. While no method of transmission over the internet is 100%
          secure, we strive to maintain the highest level of protection
          possible.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-black uppercase tracking-tighter italic text-brand-500 mb-6">
          4. Contact Us
        </h2>
        <p>
          If you have any questions about this Privacy Policy or our data
          practices, please contact our privacy team:
        </p>
        <div className="bg-background p-6 rounded-2xl border border-border/50 not-prose">
          <ul className="space-y-3 text-sm font-bold text-muted uppercase tracking-widest">
            <li className="flex gap-4">
              <span className="text-brand-500">EMAIL:</span>{" "}
              privacy@liberiadigitalinsights.com
            </li>
            <li className="flex gap-4">
              <span className="text-brand-500">ADDRESS:</span> Monrovia, Liberia
            </li>
          </ul>
        </div>
      </section>
    </LegalLayout>
  );
}
