import { useState, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/inputs/Button';
import DashboardChart from '@/components/graphs/DashboardChart';

// Lazy-loaded so it never blocks LCP
const HeroVisual = lazy(() => import('@/components/landing/HeroVisual'));

// ── sample chart data ────────────────────────────────────────────────────────
const sampleChartData = [
  { month: 'Aug', value: 1200 },
  { month: 'Sep', value: 2100 },
  { month: 'Oct', value: 1800 },
  { month: 'Nov', value: 3200 },
  { month: 'Dec', value: 2700 },
  { month: 'Jan', value: 4100 },
  { month: 'Feb', value: 3800 },
];

// ── nav ───────────────────────────────────────────────────────────────────────
export const PublicNavbar = ({ scrolled }: { scrolled?: boolean }) => {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-sm border-b border-[color:var(--lens-sand)] shadow-sm'
          : 'bg-transparent'
      }`}
      style={{ height: '64px' }}
    >
      <nav
        className="max-w-6xl mx-auto h-full flex items-center justify-between px-6"
        aria-label="Main navigation"
      >
        {/* Wordmark */}
        <Link
          to="/"
          aria-label="Lens Music home"
          className="flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--lens-blue)] rounded"
        >
          {/* minimal mark */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="10" stroke="rgb(31,98,142)" strokeWidth="1.6" />
            <circle cx="11" cy="11" r="5"  fill="rgb(31,98,142)" opacity="0.85" />
            <circle cx="11" cy="11" r="1.8" fill="white" />
          </svg>
          <span
            className="text-[color:var(--lens-ink)] tracking-tight"
            style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', fontWeight: 700 }}
          >
            Lens Music
          </span>
        </Link>

        {/* Desktop nav + CTA */}
        <ul
          className="hidden md:flex items-center gap-8 list-none m-0 p-0"
          role="list"
        >
          <li>
            <a
              href="#about"
              className="text-[color:var(--lens-ink)] opacity-70 hover:opacity-100 transition-opacity text-[13px] tracking-wide focus-visible:outline-2 focus-visible:outline-[color:var(--lens-blue)] rounded"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="text-[color:var(--lens-ink)] opacity-70 hover:opacity-100 transition-opacity text-[13px] tracking-wide focus-visible:outline-2 focus-visible:outline-[color:var(--lens-blue)] rounded"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Contact
            </a>
          </li>
          <li>
            <Button route="/auth/login" primary className="px-5 py-2 text-[13px] tracking-wide">
              Start uploading
            </Button>
          </li>
        </ul>

        {/* Mobile menu — details/summary, no div drawers */}
        <details className="md:hidden relative group" id="mobile-nav">
          <summary
            className="list-none cursor-pointer p-2 rounded focus-visible:outline-2 focus-visible:outline-[color:var(--lens-blue)]"
            aria-label="Open navigation menu"
          >
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true">
              <rect y="0"  width="22" height="1.8" rx="1" fill="rgb(16,14,9)" />
              <rect y="7"  width="22" height="1.8" rx="1" fill="rgb(16,14,9)" />
              <rect y="14" width="22" height="1.8" rx="1" fill="rgb(16,14,9)" />
            </svg>
          </summary>
          <nav
            className="absolute top-full right-0 mt-2 w-48 bg-white border border-[color:var(--lens-sand)] rounded-lg shadow-lg p-3"
            aria-label="Mobile navigation"
          >
            <ul className="flex flex-col gap-1 list-none m-0 p-0" role="list">
              <li>
                <a
                  href="#about"
                  className="block px-3 py-2 rounded text-[13px] text-[color:var(--lens-ink)] hover:bg-[color:var(--lens-sand)] transition-colors"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="block px-3 py-2 rounded text-[13px] text-[color:var(--lens-ink)] hover:bg-[color:var(--lens-sand)] transition-colors"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Contact
                </a>
              </li>
              <li className="pt-1 border-t border-[color:var(--lens-sand)]">
                <Button route="/auth/login" primary className="w-full text-center text-[13px] mt-1">
                  Start uploading
                </Button>
              </li>
            </ul>
          </nav>
        </details>
      </nav>
    </header>
  );
};

// ── page ──────────────────────────────────────────────────────────────────────
const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main
      className="min-h-screen bg-white text-[color:var(--lens-ink)]"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      <PublicNavbar scrolled={scrolled} />

      {/* ── 1. HERO ── */}
      <section
        id="hero"
        className="min-h-screen pt-16 flex items-center"
        aria-labelledby="hero-headline"
      >
        <article className="max-w-6xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 items-center py-20">
          {/* text column — renders first for LCP */}
          <section className="flex flex-col items-start gap-6">
            <p
              className="text-[12px] uppercase tracking-[0.18em] text-[color:var(--lens-blue)] font-semibold"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Music Distribution
            </p>

            <h1
              id="hero-headline"
              className="text-4xl md:text-5xl lg:text-[56px] leading-[1.08] tracking-[-0.02em] text-[color:var(--lens-ink)]"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              The future of music distribution—free, fast, and global.
            </h1>

            <p
              className="text-[15px] leading-relaxed text-[color:var(--lens-ink)] opacity-65 max-w-md"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Whether you're an independent artist or running a label, Lens distributes your music to 150+ stores worldwide—including Spotify, Apple Music, Audiomack, and Deezer—at no upfront cost.
            </p>

            {/* CTA row */}
            <nav
              aria-label="Primary actions"
              className="flex flex-wrap items-center gap-3 mt-2"
            >
              <Button route="/auth/login" primary className="px-6 py-2.5 text-[13px] tracking-wide">
                Start uploading
              </Button>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 border border-[color:var(--lens-blue)] text-[color:var(--lens-blue)] text-[13px] rounded-md tracking-wide hover:bg-[color:var(--lens-blue)] hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-[color:var(--lens-blue)]"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Learn how it works
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </nav>

            {/* Social-proof chips */}
            <ul
              className="flex flex-wrap gap-2 mt-1 list-none p-0 m-0"
              aria-label="Key features"
              role="list"
            >
              {['150+ stores', 'Free distribution', 'Split payouts', 'Catalog-ready for labels'].map((chip) => (
                <li
                  key={chip}
                  className="px-3 py-1 bg-[color:var(--lens-sand)] text-[color:var(--lens-ink)] text-[11px] rounded-full tracking-wide opacity-80"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {chip}
                </li>
              ))}
            </ul>
          </section>

          {/* visual column — lazy-loaded, never blocks LCP */}
          <aside
            aria-label="Distribution network visualization"
            className="hidden md:flex items-center justify-center h-[420px] lg:h-[480px]"
          >
            <Suspense
              fallback={
                <figure
                  aria-busy="true"
                  aria-label="Loading visualization"
                  className="w-full h-full flex items-center justify-center"
                >
                  <span className="sr-only">Loading…</span>
                </figure>
              }
            >
              <HeroVisual />
            </Suspense>
          </aside>
        </article>
      </section>

      {/* ── 2. HOW IT WORKS ── */}
      <section
        id="how-it-works"
        className="py-24 bg-[color:var(--lens-sand)]"
        aria-labelledby="how-heading"
      >
        <article className="max-w-5xl mx-auto px-6">
          <header className="mb-14">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--lens-blue)] font-semibold mb-3" style={{ fontFamily: 'var(--font-sans)' }}>
              How it works
            </p>
            <h2
              id="how-heading"
              className="text-3xl md:text-4xl tracking-tight text-[color:var(--lens-ink)]"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              Three steps to global reach
            </h2>
          </header>

          <ol className="grid md:grid-cols-3 gap-10 list-none p-0 m-0" role="list">
            {[
              {
                n: '01',
                title: 'Upload your release',
                body: 'Add your track or album, cover art, and release details in minutes. Supports all major audio formats.',
              },
              {
                n: '02',
                title: 'Set credits & splits',
                body: 'Define collaborators, assign revenue splits, and attach ISRC/UPC codes before you go live.',
              },
              {
                n: '03',
                title: 'Distribute & track revenue',
                body: 'We deliver to 150+ stores globally. Monitor streams, downloads, and earnings from your dashboard.',
              },
            ].map(({ n, title, body }) => (
              <li key={n}>
                <article>
                  <p
                    className="text-5xl mb-5 select-none"
                    aria-hidden="true"
                    style={{ fontFamily: 'var(--font-serif)', color: 'rgba(31,98,142,0.18)', fontWeight: 700 }}
                  >
                    {n}
                  </p>
                  <h3
                    className="text-[17px] font-semibold mb-2 text-[color:var(--lens-ink)]"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {title}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-[color:var(--lens-ink)] opacity-60" style={{ fontFamily: 'var(--font-sans)' }}>
                    {body}
                  </p>
                </article>
              </li>
            ))}
          </ol>
        </article>
      </section>

      {/* ── 3. FEATURES ── */}
      <section
        id="features"
        className="py-24 bg-white"
        aria-labelledby="features-heading"
      >
        <article className="max-w-5xl mx-auto px-6">
          <header className="mb-14">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--lens-blue)] font-semibold mb-3" style={{ fontFamily: 'var(--font-sans)' }}>
              Built for everyone
            </p>
            <h2
              id="features-heading"
              className="text-3xl md:text-4xl tracking-tight text-[color:var(--lens-ink)]"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              For artists. For labels.
            </h2>
          </header>

          <section className="grid md:grid-cols-2 gap-8">
            {/* Artists */}
            <article className="border border-[color:var(--lens-sand)] rounded-xl p-8">
              <header className="flex items-center gap-3 mb-6">
                <span className="w-9 h-9 rounded-full bg-[color:var(--lens-sand)] flex items-center justify-center" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="6" r="3.5" stroke="rgb(31,98,142)" strokeWidth="1.4" />
                    <path d="M2.5 16c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5" stroke="rgb(31,98,142)" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </span>
                <h3 className="text-[16px] font-semibold text-[color:var(--lens-ink)]" style={{ fontFamily: 'var(--font-sans)' }}>
                  For Artists
                </h3>
              </header>
              <ul className="flex flex-col gap-4 list-none p-0 m-0" role="list">
                {[
                  { label: 'Fast release setup', desc: 'Go from upload to live in under 10 minutes.' },
                  { label: 'Splits & credits', desc: 'Divide earnings fairly among collaborators automatically.' },
                  { label: 'Smart links & pre-save', desc: 'Coming soon.', soon: true },
                ].map(({ label, desc, soon }) => (
                  <li key={label} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-0.5 flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8l3.5 3.5L13 4" stroke="rgb(31,98,142)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <section>
                      <p className="text-[13px] font-semibold text-[color:var(--lens-ink)]" style={{ fontFamily: 'var(--font-sans)' }}>
                        {label}
                        {soon && (
                          <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-[color:var(--lens-sand)] rounded-full text-[color:var(--lens-ink)] opacity-70 align-middle">
                            Coming soon
                          </span>
                        )}
                      </p>
                      <p className="text-[12px] text-[color:var(--lens-ink)] opacity-55 mt-0.5 leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
                        {desc}
                      </p>
                    </section>
                  </li>
                ))}
              </ul>
            </article>

            {/* Labels */}
            <article className="border border-[color:var(--lens-sand)] rounded-xl p-8">
              <header className="flex items-center gap-3 mb-6">
                <span className="w-9 h-9 rounded-full bg-[color:var(--lens-sand)] flex items-center justify-center" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="2" y="5" width="14" height="10" rx="1.5" stroke="rgb(31,98,142)" strokeWidth="1.4" />
                    <path d="M6 5V4a3 3 0 016 0v1" stroke="rgb(31,98,142)" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </span>
                <h3 className="text-[16px] font-semibold text-[color:var(--lens-ink)]" style={{ fontFamily: 'var(--font-sans)' }}>
                  For Labels
                </h3>
              </header>
              <ul className="flex flex-col gap-4 list-none p-0 m-0" role="list">
                {[
                  { label: 'Multi-artist catalog management', desc: 'Manage all your artists and releases from a single account.' },
                  { label: 'Analytics per territory', desc: 'Break down performance by region, platform, and time period.' },
                  { label: 'Team roles & permissions', desc: 'Coming soon.', soon: true },
                ].map(({ label, desc, soon }) => (
                  <li key={label} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-0.5 flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8l3.5 3.5L13 4" stroke="rgb(31,98,142)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <section>
                      <p className="text-[13px] font-semibold text-[color:var(--lens-ink)]" style={{ fontFamily: 'var(--font-sans)' }}>
                        {label}
                        {soon && (
                          <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-[color:var(--lens-sand)] rounded-full text-[color:var(--lens-ink)] opacity-70 align-middle">
                            Coming soon
                          </span>
                        )}
                      </p>
                      <p className="text-[12px] text-[color:var(--lens-ink)] opacity-55 mt-0.5 leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
                        {desc}
                      </p>
                    </section>
                  </li>
                ))}
              </ul>
            </article>
          </section>
        </article>
      </section>

      {/* ── 4. ANALYTICS PREVIEW ── */}
      <section
        id="analytics"
        className="py-24 bg-[color:var(--lens-sand)]"
        aria-labelledby="analytics-heading"
      >
        <article className="max-w-5xl mx-auto px-6">
          <header className="mb-10">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--lens-blue)] font-semibold mb-3" style={{ fontFamily: 'var(--font-sans)' }}>
              Analytics
            </p>
            <h2
              id="analytics-heading"
              className="text-3xl md:text-4xl tracking-tight text-[color:var(--lens-ink)] mb-3"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              See performance by region, platform, and time.
            </h2>
            <p className="text-[14px] text-[color:var(--lens-ink)] opacity-60 max-w-lg" style={{ fontFamily: 'var(--font-sans)' }}>
              Understand where your audience is growing and which platforms drive the most revenue—all in one place.
            </p>
          </header>

          <figure className="bg-white rounded-xl border border-white/50 p-6 h-64" aria-label="Revenue performance chart preview">
            <DashboardChart
              data={sampleChartData}
              dataKey="month"
              height="100%"
              width="100%"
              fill="rgb(31,98,142)"
            />
          </figure>
        </article>
      </section>

      {/* ── 5. PRICING ── */}
      <section
        id="pricing"
        className="py-24 bg-white"
        aria-labelledby="pricing-heading"
      >
        <article className="max-w-5xl mx-auto px-6">
          <header className="mb-14">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--lens-blue)] font-semibold mb-3" style={{ fontFamily: 'var(--font-sans)' }}>
              Pricing
            </p>
            <h2
              id="pricing-heading"
              className="text-3xl md:text-4xl tracking-tight text-[color:var(--lens-ink)]"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              Simple, transparent pricing.
            </h2>
          </header>

          <section className="max-w-md">
            <dl className="flex flex-col gap-0 border border-[color:var(--lens-sand)] rounded-xl overflow-hidden">
              {[
                { term: 'Distribution', detail: 'Free', sub: 'No upfront cost, ever.' },
                { term: 'Revenue share', detail: '15%', sub: 'Only on earnings generated.' },
                { term: 'Store reach', detail: '150+ stores', sub: 'Spotify, Apple Music, Audiomack, Deezer, and more.' },
              ].map(({ term, detail, sub }, i) => (
                <section
                  key={term}
                  className={`flex items-start justify-between px-6 py-5 ${i < 2 ? 'border-b border-[color:var(--lens-sand)]' : ''}`}
                >
                  <section>
                    <dt className="text-[12px] uppercase tracking-wide text-[color:var(--lens-ink)] opacity-50 mb-0.5" style={{ fontFamily: 'var(--font-sans)' }}>
                      {term}
                    </dt>
                    <dd className="text-[13px] text-[color:var(--lens-ink)] opacity-60 leading-snug" style={{ fontFamily: 'var(--font-sans)' }}>
                      {sub}
                    </dd>
                  </section>
                  <dd
                    className="text-[20px] font-bold text-[color:var(--lens-blue)] ml-4 flex-shrink-0"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {detail}
                  </dd>
                </section>
              ))}
            </dl>
          </section>
        </article>
      </section>

      {/* ── 6. FAQ ── */}
      <section
        id="faq"
        className="py-24 bg-[color:var(--lens-sand)]"
        aria-labelledby="faq-heading"
      >
        <article className="max-w-3xl mx-auto px-6">
          <header className="mb-12">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--lens-blue)] font-semibold mb-3" style={{ fontFamily: 'var(--font-sans)' }}>
              FAQ
            </p>
            <h2
              id="faq-heading"
              className="text-3xl md:text-4xl tracking-tight text-[color:var(--lens-ink)]"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              Common questions
            </h2>
          </header>

          <ul className="flex flex-col gap-0 list-none p-0 m-0 border border-[color:var(--lens-sand)] rounded-xl overflow-hidden bg-white" role="list">
            {[
              {
                q: 'How is distribution free?',
                a: 'Lens covers the cost of delivering your music to stores. We only earn when you do—through a 15% revenue share on earnings generated.',
              },
              {
                q: 'What does the 15% apply to?',
                a: 'The 15% applies to net revenue generated from your releases on stores distributed through Lens. It does not apply to earnings you generate outside the platform.',
              },
              {
                q: 'Which stores do you deliver to?',
                a: 'We deliver to 150+ stores including Spotify, Apple Music, Audiomack, Deezer, Tidal, Amazon Music, and YouTube Music, among others.',
              },
              {
                q: 'Can labels manage multiple artists?',
                a: 'Yes. Label accounts can manage releases across multiple artists and access consolidated analytics for your full roster.',
              },
              {
                q: 'Do you support revenue splits?',
                a: 'Yes. You can assign revenue splits to collaborators when setting up a release. Lens handles the distribution of earnings accordingly.',
              },
            ].map(({ q, a }, i) => (
              <li
                key={q}
                className={i < 4 ? 'border-b border-[color:var(--lens-sand)]' : ''}
              >
                <details className="group px-6 py-5">
                  <summary
                    className="flex items-center justify-between cursor-pointer list-none text-[14px] font-semibold text-[color:var(--lens-ink)] select-none focus-visible:outline-2 focus-visible:outline-[color:var(--lens-blue)] rounded"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {q}
                    <span aria-hidden="true" className="ml-4 flex-shrink-0 transition-transform duration-200 group-open:rotate-45">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 1v12M1 7h12" stroke="rgb(31,98,142)" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </span>
                  </summary>
                  <p
                    className="mt-3 text-[13px] text-[color:var(--lens-ink)] opacity-60 leading-relaxed max-w-2xl"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {a}
                  </p>
                </details>
              </li>
            ))}
          </ul>
        </article>
      </section>

      {/* ── 7. CLOSING CTA ── */}
      <section
        id="about"
        className="py-24 bg-[color:var(--lens-blue)]"
        aria-labelledby="cta-heading"
      >
        <article className="max-w-3xl mx-auto px-6 text-center">
          <h2
            id="cta-heading"
            className="text-3xl md:text-4xl text-white mb-5 tracking-tight"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
          >
            Your music deserves a global audience.
          </h2>
          <p
            className="text-[15px] text-white opacity-75 mb-8 leading-relaxed"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Start distributing to 150+ stores today—free to upload, we only earn when you do.
          </p>
          <Button
            route="/auth/login"
            primary
            className="px-8 py-3 text-[13px] tracking-wide bg-white! text-[color:var(--lens-blue)]! border-white! hover:bg-[color:var(--lens-sand)]! hover:text-[color:var(--lens-blue)]!"
          >
            Start uploading
          </Button>
        </article>
      </section>

      {/* ── FOOTER ── */}
      <footer
        id="contact"
        className="bg-[color:var(--lens-ink)] text-white"
        role="contentinfo"
      >
        <section className="max-w-6xl mx-auto px-6 pt-14 pb-6">
          {/* top row */}
          <section className="flex flex-col md:flex-row justify-between gap-8 pb-10 border-b border-white/10">
            {/* brand */}
            <section>
              <Link
                to="/"
                aria-label="Lens Music home"
                className="flex items-center gap-2.5 mb-3 focus-visible:outline-2 focus-visible:outline-white rounded w-fit"
              >
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                  <circle cx="11" cy="11" r="10" stroke="white" strokeWidth="1.6" />
                  <circle cx="11" cy="11" r="5"  fill="white" opacity="0.85" />
                  <circle cx="11" cy="11" r="1.8" fill="rgb(16,14,9)" />
                </svg>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', fontWeight: 700 }}>
                  Lens Music
                </span>
              </Link>
              <p className="text-[12px] text-white/50 leading-relaxed max-w-xs" style={{ fontFamily: 'var(--font-sans)' }}>
                Free music distribution for independent artists and labels.
              </p>
            </section>

            {/* nav links */}
            <nav aria-label="Footer navigation">
              <ul className="flex flex-col sm:flex-row gap-4 sm:gap-8 list-none p-0 m-0" role="list">
                {[
                  { label: 'About',   href: '#about' },
                  { label: 'Contact', href: '#contact' },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-[13px] text-white/60 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-white rounded"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </section>

          {/* bottom row */}
          <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-6">
            <p className="text-[11px] text-white/40 leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
              Distribution is free. Lens charges a 15% revenue share on earnings generated.
            </p>
            <p className="text-[11px] text-white/40" style={{ fontFamily: 'var(--font-sans)' }}>
              © Lens Music, {new Date().getFullYear()}. All rights reserved.
            </p>
          </section>
        </section>
      </footer>
    </main>
  );
};

export default LandingPage;
