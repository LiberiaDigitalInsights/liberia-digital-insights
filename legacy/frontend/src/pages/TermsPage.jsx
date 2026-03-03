import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <div className="mx-auto max-w-4xl px-6 py-12 md:px-8 md:py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <Link to="/" className="inline-flex items-center gap-3 mb-8">
            <Logo />
          </Link>
          <h1 className="text-4xl font-bold text-[var(--color-text)] mb-4">Terms of Service</h1>
          <p className="text-lg text-[var(--color-muted)]">
            Last updated:{' '}
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="space-y-8 text-[var(--color-text)]">
            {/* Agreement */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
              <p className="text-[var(--color-muted)] leading-relaxed">
                Welcome to Liberia Digital Insights. These Terms of Service ("Terms") govern your
                access to and use of our website, services, and content (collectively, the
                "Service") operated by Liberia Digital Insights ("we," "us," or "our").
              </p>
              <p className="text-[var(--color-muted)] leading-relaxed">
                By accessing or using our Service, you agree to be bound by these Terms. If you
                disagree with any part of these terms, then you may not access the Service.
              </p>
            </section>

            {/* Description of Service */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Description of Service</h2>
              <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                Liberia Digital Insights provides digital insights, news, analysis, and educational
                content focused on Liberia's digital transformation and technology landscape. Our
                Service includes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[var(--color-muted)]">
                <li>Articles, insights, and analysis on digital trends</li>
                <li>Podcast interviews and discussions</li>
                <li>Event coverage and announcements</li>
                <li>Talent hub and professional networking</li>
                <li>Training courses and educational resources</li>
                <li>Newsletter subscription services</li>
                <li>Gallery and multimedia content</li>
              </ul>
            </section>

            {/* User Accounts */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">User Accounts</h2>
              <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                When you create an account or subscribe to our newsletter, you must provide accurate
                and complete information. You are responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[var(--color-muted)]">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>Providing accurate and up-to-date information</li>
              </ul>
              <p className="text-[var(--color-muted)] leading-relaxed mt-4">
                We reserve the right to suspend or terminate accounts that violate these Terms.
              </p>
            </section>

            {/* User Conduct */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">User Conduct</h2>
              <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                You agree not to use our Service to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[var(--color-muted)]">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon intellectual property rights</li>
                <li>Post or share false, misleading, or harmful content</li>
                <li>Engage in harassment, abuse, or threatening behavior</li>
                <li>Send unsolicited commercial messages (spam)</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the Service</li>
                <li>Use automated tools to access the Service excessively</li>
                <li>Impersonate any person or entity</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Intellectual Property Rights</h2>

              <h3 className="text-xl font-medium mb-3">Our Content</h3>
              <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                All content on our Service, including text, graphics, logos, images, audio, video,
                and software, is owned by or licensed to Liberia Digital Insights and is protected
                by copyright, trademark, and other intellectual property laws.
              </p>

              <h3 className="text-xl font-medium mb-3">Your Content</h3>
              <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                By submitting content to our Service, you grant us a worldwide, non-exclusive,
                royalty-free license to use, reproduce, modify, and distribute your content for the
                purpose of operating and promoting our Service.
              </p>
              <p className="text-[var(--color-muted)] leading-relaxed">
                You retain ownership of your content and are responsible for its legality and
                accuracy.
              </p>
            </section>

            {/* Privacy */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Privacy and Data Protection</h2>
              <p className="text-[var(--color-muted)] leading-relaxed">
                Your privacy is important to us. Please review our Privacy Policy, which also
                governs your use of the Service, to understand our practices regarding the
                collection and use of your information.
              </p>
            </section>

            {/* Disclaimers */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Disclaimers</h2>
              <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                Our Service is provided on an "as is" and "as available" basis. We make no
                representations or warranties of any kind, express or implied, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[var(--color-muted)]">
                <li>The accuracy, reliability, or completeness of our content</li>
                <li>The availability or functionality of our Service</li>
                <li>The security of our Service (though we strive to maintain it)</li>
                <li>Freedom from viruses or other harmful components</li>
              </ul>
              <p className="text-[var(--color-muted)] leading-relaxed mt-4">
                Your use of our Service is at your own risk.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
              <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                To the fullest extent permitted by law, Liberia Digital Insights shall not be liable
                for any indirect, incidental, special, consequential, or punitive damages,
                including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[var(--color-muted)]">
                <li>Loss of profits, data, or business opportunities</li>
                <li>Damage to reputation or goodwill</li>
                <li>Costs of substitute services</li>
                <li>Any other intangible losses</li>
              </ul>
              <p className="text-[var(--color-muted)] leading-relaxed mt-4">
                Our total liability shall not exceed the amount you paid for our Service, if any.
              </p>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Indemnification</h2>
              <p className="text-[var(--color-muted)] leading-relaxed">
                You agree to indemnify and hold Liberia Digital Insights harmless from any claims,
                damages, or expenses arising from your use of the Service, your violation of these
                Terms, or your violation of any rights of another party.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Termination</h2>
              <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                We may terminate or suspend your access to our Service immediately, without prior
                notice or liability, for any reason, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[var(--color-muted)]">
                <li>Breach of these Terms</li>
                <li>Violation of applicable laws</li>
                <li>Engagement in fraudulent or harmful activities</li>
                <li>At our sole discretion</li>
              </ul>
              <p className="text-[var(--color-muted)] leading-relaxed mt-4">
                Upon termination, your right to use the Service will cease immediately.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
              <p className="text-[var(--color-muted)] leading-relaxed">
                These Terms shall be interpreted and governed by the laws of Liberia, without regard
                to conflict of law principles. Any disputes arising from these Terms shall be
                resolved in the courts of Monrovia, Liberia.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Changes to Terms of Service</h2>
              <p className="text-[var(--color-muted)] leading-relaxed">
                We reserve the right to modify these Terms at any time. If we make material changes,
                we will notify you by email or by posting a prominent notice on our website. Your
                continued use of the Service after such changes constitutes acceptance of the
                modified Terms.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6 mt-4">
                <ul className="space-y-2 text-[var(--color-muted)]">
                  <li>
                    <strong>Email:</strong> legal@liberiadigitalinsights.com
                  </li>
                  <li>
                    <strong>Website:</strong> www.liberiadigitalinsights.com
                  </li>
                  <li>
                    <strong>Address:</strong> Liberia Digital Insights, Monrovia, Liberia
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-[var(--color-border)] text-center">
          <Link
            to="/"
            className="text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
