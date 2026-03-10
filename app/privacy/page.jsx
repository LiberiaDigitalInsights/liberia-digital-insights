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
        <ul className="list-disc list-inside space-y-2 mb-8 text-muted font-medium">
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
        <ul className="list-disc list-inside space-y-2 text-muted font-medium">
          <li>IP address and geolocation data</li>
          <li>Browser type, operating system, and device information</li>
          <li>Pages visited and time spent on our site</li>
          <li>Referring website and search terms</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-black uppercase tracking-tighter italic text-brand-500 mb-6">
          3. How We Use Your Information
        </h2>
        <p>
          We use the information we collect for various purposes, including:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted font-medium">
          <li>To provide and maintain our website and services</li>
          <li>To send you our newsletter with insights and updates</li>
          <li>To respond to your inquiries and provide customer support</li>
          <li>To improve our website based on user feedback and analytics</li>
          <li>To monitor usage patterns and analyze website performance</li>
          <li>To detect, prevent, and address technical issues</li>
          <li>To comply with legal obligations and protect our rights</li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-black uppercase tracking-tighter italic text-brand-500 mb-6">
          4. Information Sharing and Disclosure
        </h2>
        <p>
          We do not sell, trade, or otherwise transfer your personal information
          to third parties without your consent, except as described in this
          policy:
        </p>
        <h3 className="mt-6">Service Providers</h3>
        <p>
          We may share information with trusted third-party service providers
          who assist us in operating our website, such as email marketing
          services and analytics providers.
        </p>
        <h3 className="mt-6">Legal Requirements</h3>
        <p>
          We may disclose your information if required by law or in good faith
          belief that such action is necessary to comply with legal obligations.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-black uppercase tracking-tighter italic text-brand-500 mb-6">
          5. Data Security & Storage
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
          6. Your Privacy Rights
        </h2>
        <p>
          You have the following rights regarding your personal information:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted font-medium">
          <li>Access and review your personal information</li>
          <li>Correct inaccurate or incomplete information</li>
          <li>Request deletion of your personal information</li>
          <li>Opt-out of marketing communications</li>
          <li>Request a copy of your data (data portability)</li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-black uppercase tracking-tighter italic text-brand-500 mb-6">
          7. Contact Us
        </h2>
        <p>
          If you have any questions about this Privacy Policy or our data
          practices, please contact our privacy team:
        </p>
        <div className="bg-background p-8 rounded-4xl border border-border/50 not-prose shadow-xl shadow-brand-500/5">
          <ul className="space-y-4 text-sm font-black text-muted uppercase tracking-widest">
            <li className="flex gap-4">
              <span className="text-brand-500 italic">EMAIL:</span>{" "}
              privacy@liberiadigitalinsights.com
            </li>
            <li className="flex gap-4">
              <span className="text-brand-500 italic">ADDRESS:</span> Monrovia,
              Liberia
            </li>
          </ul>
        </div>
      </section>
    </LegalLayout>
  );
}
