import React from "react";
import LegalLayout from "@/components/LegalLayout";

export const metadata = {
  title: "Terms of Service - Liberia Digital Insights",
  description: "The rules of engagement for using Liberia Digital Insights.",
};

export default function TermsPage() {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <LegalLayout title="Terms of Service" lastUpdated={lastUpdated}>
      <section>
        <h2 className="text-2xl font-black uppercase tracking-tighter italic text-brand-500 mb-6">
          1. Agreement to Terms
        </h2>
        <p>
          Welcome to Liberia Digital Insights. These Terms of Service ("Terms")
          govern your access to and use of our website, services, and content
          (collectively, the "Service") operated by Liberia Digital Insights
          ("we," "us," or "our").
        </p>
        <p>
          By accessing or using our Service, you agree to be bound by these
          Terms. If you disagree with any part of these terms, then you may not
          access the Service.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-black uppercase tracking-tighter italic text-brand-500 mb-6">
          2. User Conduct
        </h2>
        <p>
          The Hub is a space for professional growth and innovation. You agree
          not to use our Service to:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-8">
          <li>Violate any applicable laws or regulations</li>
          <li>Infringe upon intellectual property rights</li>
          <li>Post or share false, misleading, or harmful content</li>
          <li>Engage in harassment, abuse, or threatening behavior</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Interfere with or disrupt the Service</li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-black uppercase tracking-tighter italic text-brand-500 mb-6">
          3. Intellectual Property
        </h2>
        <h3>Our Content</h3>
        <p>
          All content on our Service, including text, graphics, logos, images,
          audio, video, and software, is owned by or licensed to Liberia Digital
          Insights and is protected by copyright, trademark, and other
          intellectual property laws.
        </p>
        <p>
          Unauthorized use of our content is strictly prohibited without
          explicit written consent from the editorial board.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-black uppercase tracking-tighter italic text-brand-500 mb-6">
          4. Limitation of Liability
        </h2>
        <p>
          To the fullest extent permitted by law, Liberia Digital Insights shall
          not be liable for any indirect, incidental, special, consequential, or
          punitive damages arising from your use of the service.
        </p>
        <p>
          Our Service is provided on an "as is" and "as available" basis. We
          make no representations or warranties of any kind regarding its
          availability or accuracy.
        </p>
      </section>
    </LegalLayout>
  );
}
