import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicFooter from '@/components/layout/PublicFooter';
import PublicNavbar from '@/components/layout/PublicNavbar';
import { LandingPageStyles } from '@/pages/landing/landingShared';

export default function PrivacyPolicy() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const onScroll = () => setScrolled(window.scrollY > 64);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main
      className="min-h-screen bg-white text-[color:var(--lens-ink)]"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      <LandingPageStyles />
      <PublicNavbar scrolled={scrolled} variant="landing" />
      
      <article className="max-w-4xl mx-auto px-6 py-24">
        {/* Header */}
        <header className="mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[color:var(--lens-blue)] hover:underline mb-6"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--lens-ink)' }}>
            Privacy Policy
          </h1>
          <p className="text-sm" style={{ color: 'rgba(0,0,0,0.5)' }}>
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              1. Introduction
            </h2>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              Lens Music ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our music distribution platform and services.
            </p>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              By accessing or using Lens Music, you agree to the terms of this Privacy Policy. If you do not agree with the terms, please do not access or use our services.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              2. Information We Collect
            </h2>
            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              2.1 Personal Information
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              We collect personal information that you voluntarily provide when registering for an account, including:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
              <li>Name and contact information (email address, phone number)</li>
              <li>Payment and billing information</li>
              <li>Artist or label profile information</li>
              <li>Tax identification information (as required for royalty payments)</li>
              <li>Authentication credentials</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              2.2 Content and Metadata
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              When you upload music and related content, we collect:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
              <li>Audio files and associated metadata</li>
              <li>Album artwork and promotional materials</li>
              <li>Lyrics and liner notes</li>
              <li>Contributor and rights holder information</li>
              <li>Release and distribution preferences</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              2.3 Usage and Analytics Data
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              We automatically collect certain information about your device and usage patterns:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage statistics and interaction data</li>
              <li>Performance metrics and error logs</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              3. How We Use Your Information
            </h2>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
              <li>Providing and maintaining our music distribution services</li>
              <li>Processing and delivering your music to streaming platforms and stores</li>
              <li>Managing royalty payments and financial transactions</li>
              <li>Communicating with you about your account and releases</li>
              <li>Providing analytics and performance insights</li>
              <li>Improving our platform and developing new features</li>
              <li>Detecting and preventing fraud or unauthorized access</li>
              <li>Complying with legal obligations and industry standards</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              4. Information Sharing and Disclosure
            </h2>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              We may share your information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
              <li><strong>Distribution Partners:</strong> We share your music and metadata with streaming platforms, digital stores, and other distribution partners as necessary to fulfill our services.</li>
              <li><strong>Service Providers:</strong> We work with third-party service providers for payment processing, cloud storage, analytics, and customer support.</li>
              <li><strong>Rights Organizations:</strong> We may share information with performing rights organizations (PROs) and collection societies for royalty administration.</li>
              <li><strong>Legal Requirements:</strong> We may disclose information when required by law, court order, or government request.</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.</li>
            </ul>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              We do not sell your personal information to third parties for marketing purposes.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              5. Data Security
            </h2>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              We implement industry-standard security measures to protect your information, including:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
              <li>Encryption of data in transit and at rest</li>
              <li>Secure authentication and access controls</li>
              <li>Regular security audits and monitoring</li>
              <li>Employee training on data protection practices</li>
            </ul>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              6. Your Rights and Choices
            </h2>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
              <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
              <li><strong>Data Portability:</strong> Request a copy of your data in a structured, machine-readable format</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
            </ul>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              To exercise these rights, please contact us at privacy@lensmusic.rw.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              7. Data Retention
            </h2>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              We retain your personal information for as long as necessary to provide our services and comply with legal obligations. When you close your account, we will delete or anonymize your personal information within a reasonable timeframe, except where we are required to retain it for legal, tax, or regulatory purposes.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              8. International Data Transfers
            </h2>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              Lens Music operates from Rwanda and may transfer your information to countries outside your jurisdiction. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy and applicable data protection laws.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              9. Children's Privacy
            </h2>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              10. Changes to This Privacy Policy
            </h2>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              11. Contact Us
            </h2>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="mb-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
                <strong>Lens Music</strong>
              </p>
              <p className="mb-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
                Email: privacy@lensmusic.rw
              </p>
              <p className="mb-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
                Address: Kigali, Rwanda
              </p>
            </div>
          </section>
        </div>
      </article>

      <PublicFooter />
    </main>
  );
}
