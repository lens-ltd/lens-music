import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/inputs/Button';
import DashboardChart from '@/components/graphs/DashboardChart';

// Lazy-loaded so it never blocks LCP
const HeroVisual = lazy(() => import('@/components/landing/HeroVisual'));

// ── chart data ────────────────────────────────────────────────────────────────
const sampleChartData = [
  { month: 'Aug', value: 1200 },
  { month: 'Sep', value: 2100 },
  { month: 'Oct', value: 1800 },
  { month: 'Nov', value: 3200 },
  { month: 'Dec', value: 2700 },
  { month: 'Jan', value: 4100 },
  { month: 'Feb', value: 3800 },
];

// ── useInView hook ────────────────────────────────────────────────────────────
function useInView() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, inView };
}

// ── useStatCounter hook ───────────────────────────────────────────────────────
function useStatCounter(target: number, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
}

// ── nav ───────────────────────────────────────────────────────────────────────
export const PublicNavbar = ({ scrolled }: { scrolled?: boolean }) => (
  <header
    className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-white/96 backdrop-blur-md border-b border-[color:var(--lens-sand)] shadow-[0_1px_0_rgba(16,14,9,0.06)]'
        : 'bg-transparent'
    }`}
    style={{ height: '64px' }}
  >
    <nav
      className="max-w-6xl mx-auto h-full flex items-center justify-between px-6"
      aria-label="Main navigation"
    >
      <Link
        to="/"
        aria-label="Lens Music home"
        className="flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--lens-blue)] rounded"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="2" stroke="rgb(31,98,142)" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="5.5" stroke="rgb(31,98,142)" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="2" fill="rgb(31,98,142)" />
        </svg>
        <span
          className="text-[color:var(--lens-ink)] tracking-tight"
          style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', fontWeight: 700 }}
        >
          Lens Music
        </span>
      </Link>

      <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0" role="list">
        {[
          { label: 'How it works', href: '#how-it-works' },
          { label: 'Pricing', href: '#pricing' },
          { label: 'FAQ', href: '#faq' },
        ].map(({ label, href }) => (
          <li key={label}>
            <a
              href={href}
              className="nav-link text-[color:var(--lens-ink)] opacity-60 hover:opacity-100 text-[12px] tracking-[0.06em] font-medium"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {label}
            </a>
          </li>
        ))}
        <li>
          <Link
            to="/auth/login"
            className="nav-link text-[color:var(--lens-ink)] opacity-60 hover:opacity-100 text-[12px] tracking-[0.06em] font-medium"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Sign in
          </Link>
        </li>
        <li>
          <Button route="/auth/login" primary className="px-5 py-2 text-[12px] tracking-[0.04em] font-semibold">
            Start uploading
          </Button>
        </li>
      </ul>

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
          className="absolute top-full right-0 mt-2 w-52 bg-white border border-[color:var(--lens-sand)] rounded-lg shadow-lg p-3"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-1 list-none m-0 p-0" role="list">
            {['How it works', 'Pricing', 'FAQ'].map((label) => (
              <li key={label}>
                <a
                  href={`#${label.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block px-3 py-2 rounded text-[13px] text-[color:var(--lens-ink)] hover:bg-[color:var(--lens-sand)] transition-colors"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {label}
                </a>
              </li>
            ))}
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

// ── inline animation styles ───────────────────────────────────────────────────
const fadeUp = (inView: boolean, delay = 0): React.CSSProperties => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translateY(0)' : 'translateY(22px)',
  transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
});

// ── SectionLabel ──────────────────────────────────────────────────────────────
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p
    className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--lens-blue)] font-semibold mb-4"
    style={{ fontFamily: 'var(--font-sans)' }}
  >
    {children}
  </p>
);

// ── CheckIcon ─────────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true" className="flex-shrink-0 mt-0.5">
    <circle cx="7.5" cy="7.5" r="7" fill="rgb(31,98,142)" fillOpacity="0.1" />
    <path d="M4.5 7.5l2 2L10.5 5.5" stroke="rgb(31,98,142)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── StoreIcon ─────────────────────────────────────────────────────────────────
const StoreIcon = ({ name }: { name: string }) => {
  const icons: Record<string, React.ReactNode> = {
    'Spotify': (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-label="Spotify">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
    'Apple Music': (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-label="Apple Music">
        <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026C4.786.07 4.043.15 3.34.428 2.004.958 1.04 1.88.475 3.208a4.98 4.98 0 00-.32 1.235c-.063.5-.095 1-.103 1.502-.004.083-.01.166-.015.249v14.604c.01.15.017.302.026.453.058.905.201 1.793.608 2.621.48.977 1.24 1.684 2.24 2.147.866.406 1.782.569 2.72.594.285.007.57.012.856.013H18.31c.09-.003.18-.007.27-.01.67-.024 1.34-.093 1.985-.282 1.15-.339 2.03-1.002 2.645-2.026.35-.573.538-1.205.633-1.86.09-.62.13-1.243.135-1.868.002-.063.004-.126.006-.19V6.124zm-5.647 9.674l-1.41.81c-.494.284-1.013.424-1.553.41a2.97 2.97 0 01-.744-.1c-.48-.137-.898-.4-1.24-.77-.344-.374-.558-.824-.61-1.316-.074-.706.167-1.315.673-1.815.375-.367.833-.584 1.38-.645.443-.05.874.013 1.29.176l.14.054V8.69l-5.46 1.57v6.044l-.001.032c0 .44-.098.854-.31 1.237-.283.513-.715.862-1.287 1.016-.34.093-.687.124-1.038.1-.35-.024-.688-.106-1.003-.26-.482-.235-.812-.6-.94-1.112-.13-.515-.053-1.006.228-1.463.28-.456.7-.745 1.216-.884.36-.097.724-.122 1.09-.087.237.023.466.077.682.163l.14.055V7.57l.017-.005 6.74-1.94v7.22l-.002.013c.01.387-.072.754-.27 1.093-.255.44-.64.741-1.138.884zM18.35 15.8v-1.5l1.41-.81V15l-1.41.8z"/>
      </svg>
    ),
    'Deezer': (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-label="Deezer">
        <path d="M18.944 18.95h4.498v.87h-4.498zm-6.172 0h4.498v.87h-4.498zm-6.172 0H11.1v.87H6.6zm-6.172 0H4.93v.87H.428zM18.944 17.2h4.498v.87h-4.498zM12.772 17.2h4.498v.87h-4.498zM6.6 17.2H11.1v.87H6.6zM18.944 15.45h4.498v.87h-4.498zm-6.172 0h4.498v.87h-4.498zm-6.172 0H11.1v.87H6.6zM18.944 13.7h4.498v.87h-4.498zm-6.172 0h4.498v.87h-4.498zM18.944 11.95h4.498v.87h-4.498z"/>
      </svg>
    ),
    'Tidal': (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-label="Tidal">
        <path d="M12.012 3.992L8.008 7.996 4.004 3.992 0 7.996l4.004 4.004 4.004-4.004 4.004 4.004 4.004-4.004-4.004-4zm4.004 4.004l-4.004 4.004 4.004 4.004L20.016 12l-4-4.004zM8.008 12l-4.004 4.004L8.008 20.008l4.004-4.004L8.008 12z"/>
      </svg>
    ),
    'YouTube Music': (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-label="YouTube Music">
        <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L16.2 12l-6.516 3.54z"/>
      </svg>
    ),
    'Audiomack': (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-label="Audiomack">
        <path d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12zm8-10C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 6v8l6-4-6-4z"/>
      </svg>
    ),
    'Amazon Music': (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-label="Amazon Music">
        <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.685zm3.186 7.705c-.209.189-.512.201-.745.074-1.047-.872-1.234-1.276-1.814-2.106-1.734 1.767-2.962 2.297-5.209 2.297-2.66 0-4.731-1.641-4.731-4.925 0-2.565 1.391-4.309 3.37-5.164 1.715-.754 4.11-.891 5.942-1.099v-.41c0-.753.06-1.642-.383-2.294-.385-.579-1.124-.82-1.775-.82-1.205 0-2.277.618-2.54 1.897-.054.285-.261.567-.549.582l-3.061-.333c-.259-.056-.548-.266-.472-.66C5.86 2.957 8.637 2 11.135 2c1.279 0 2.95.34 3.956 1.307C16.29 4.43 16.19 5.96 16.19 7.621v4.247c0 1.276.529 1.837 1.026 2.527.175.246.213.54-.01.72l-2.062 1.68zM21.485 19.035c-3.649 2.693-8.944 4.123-13.503 2.177-3.987-1.69-6.74-5.207-7.7-9.09a.486.486 0 01.484-.612c.241 0 .461.157.524.394.857 3.51 3.322 6.643 6.964 8.168 4.117 1.74 8.856.467 12.212-2.054.281-.207.673.024.527.354-.06.137-.19.237-.33.265-.064.013-.124.019-.178.019l.001.001c-.003-.002.001-.421.001-.421l-.002-.001zM22 17.5c0 .36-.086.713-.251 1.021-.145.275-.429.479-.763.479h-.003a.943.943 0 01-.755-.385 1.888 1.888 0 01-.369-.918.493.493 0 01-.001-.08c0-.285.119-.54.309-.717l1.246-1.172c.232-.218.587-.053.587.271v1.501z"/>
      </svg>
    ),
  };

  return (
    <figure
      className="flex flex-col items-center gap-2 opacity-40 grayscale hover:opacity-70 hover:grayscale-0 transition-all duration-300"
      aria-label={name}
    >
      <span className="text-[color:var(--lens-ink)]">{icons[name]}</span>
      <figcaption className="text-[10px] font-medium text-[color:var(--lens-ink)]" style={{ fontFamily: 'var(--font-sans)' }}>
        {name}
      </figcaption>
    </figure>
  );
};

// ── LandingPage ───────────────────────────────────────────────────────────────
const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Section animation refs
  const storesSection    = useInView();
  const howSection       = useInView();
  const featuresSection  = useInView();
  const compareSection   = useInView();
  const dashSection      = useInView();
  const analyticsSection = useInView();
  const testimonials     = useInView();
  const pricingSection   = useInView();
  const faqSection       = useInView();
  const ctaSection       = useInView();

  // Hero stat counters
  const heroStats        = useInView();
  const countStores      = useStatCounter(150, 1600, heroStats.inView);
  const countArtists     = useStatCounter(2400, 1800, heroStats.inView);
  const countCountries   = useStatCounter(38,   1400, heroStats.inView);

  const stores = ['Spotify','Apple Music','Deezer','Tidal','YouTube Music','Audiomack','Amazon Music'];

  return (
    <main
      className="min-h-screen bg-white text-[color:var(--lens-ink)] overflow-x-hidden"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      {/* ── scroll-animation keyframes + trust bar animation ──────────────── */}
      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track { animation: ticker 28s linear infinite; }
        .ticker-track:hover { animation-play-state: paused; }

        @keyframes countUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .ticker-track { animation: none !important; }
        }

        /* decorative grain overlay */
        .grain::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 200px 200px;
          pointer-events: none;
          z-index: 0;
        }

        .grain > * { position: relative; z-index: 1; }

        details[open] > summary .faq-icon { transform: rotate(45deg); }
        .faq-icon { transition: transform 0.25s ease; }

        /* ── underline-slide hover ── */
        .nav-link {
          position: relative;
          transition: opacity 0.2s ease;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: currentColor;
          transition: width 0.25s ease;
        }
        .nav-link:hover::after { width: 100%; }

        .footer-link {
          position: relative;
          color: rgba(255,255,255,0.5);
          transition: color 0.2s ease;
        }
        .footer-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: rgba(255,255,255,0.6);
          transition: width 0.25s ease;
        }
        .footer-link:hover { color: white; }
        .footer-link:hover::after { width: 100%; }
      `}</style>

      <PublicNavbar scrolled={scrolled} />

      {/* ═══════════════════════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════════════════════ */}
      <section
        id="hero"
        className="min-h-screen pt-16 flex items-center bg-white relative"
        aria-labelledby="hero-headline"
      >
        {/* subtle geometric decoration */}
        <span
          aria-hidden="true"
          className="absolute top-24 right-0 opacity-[0.04] pointer-events-none select-none"
          style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(200px, 30vw, 400px)', fontWeight: 700, color: 'var(--lens-blue)', lineHeight: 1 }}
        >
          L
        </span>

        <article className="max-w-6xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 items-center py-20">
          {/* text column */}
          <section className="flex flex-col items-start gap-7">
            <p
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[color:var(--lens-blue)] font-semibold"
              style={{ fontFamily: 'var(--font-sans)', animationFillMode: 'forwards' }}
            >
              <span aria-hidden="true" className="w-6 h-px bg-[color:var(--lens-blue)] inline-block" />
              Free Music Distribution
            </p>

            <h1
              id="hero-headline"
              className="text-[clamp(40px,6vw,64px)] leading-[1.04] tracking-[-0.025em] text-[color:var(--lens-ink)]"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              Your music,{' '}
              <em
                className="not-italic text-[color:var(--lens-blue)]"
                style={{ fontStyle: 'italic' }}
              >
                everywhere
              </em>
              .<br />
              No upfront cost.
            </h1>

            <p
              className="text-[15px] leading-[1.75] text-[color:var(--lens-ink)] max-w-md"
              style={{ color: 'rgba(16,14,9,0.62)' }}
            >
              Whether you're an independent artist uploading your first track or a label managing a full roster — Lens distributes your music to 150+ stores globally, free.
            </p>

            <nav aria-label="Primary actions" className="flex flex-wrap items-center gap-3 mt-1">
              <Button route="/auth/login" primary className="px-6 py-2.5 text-[12px] tracking-[0.05em] font-semibold">
                Start uploading — it's free
              </Button>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 text-[12px] tracking-[0.05em] font-medium text-[color:var(--lens-ink)] opacity-60 hover:opacity-100 transition-opacity"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                See how it works
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                  <path d="M2 6.5h9M8 3l3.5 3.5L8 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </nav>

            {/* stat counters */}
            <section
              ref={heroStats.ref as React.RefObject<HTMLElement>}
              className="flex items-center gap-8 pt-4 border-t border-[color:var(--lens-sand)] w-full"
              aria-label="Platform statistics"
            >
              {[
                { count: countStores,  suffix: '+', label: 'Stores' },
                { count: countArtists, suffix: '+', label: 'Artists' },
                { count: countCountries, suffix: '', label: 'Countries' },
              ].map(({ count, suffix, label }) => (
                <section key={label}>
                  <p
                    className="text-[28px] font-bold text-[color:var(--lens-ink)] leading-none tracking-tight"
                    style={{ fontFamily: 'var(--font-serif)' }}
                    aria-live="polite"
                  >
                    {count}{suffix}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.12em] mt-1" style={{ color: 'rgba(16,14,9,0.45)' }}>
                    {label}
                  </p>
                </section>
              ))}
            </section>
          </section>

          {/* visual column */}
          <aside
            aria-label="Distribution network visualization"
            className="hidden md:flex items-center justify-center h-[440px] lg:h-[500px]"
          >
            <Suspense
              fallback={
                <figure aria-busy="true" aria-label="Loading visualization" className="w-full h-full" />
              }
            >
              <HeroVisual />
            </Suspense>
          </aside>
        </article>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          2. STORE LOGOS BAR
      ═══════════════════════════════════════════════════════════════ */}
      <section
        id="stores"
        ref={storesSection.ref as React.RefObject<HTMLElement>}
        className="py-14 border-y border-[color:var(--lens-sand)] bg-white overflow-hidden"
        aria-label="Distribution store partners"
        style={fadeUp(storesSection.inView)}
      >
        <p
          className="text-center text-[10px] uppercase tracking-[0.22em] font-semibold mb-8"
          style={{ fontFamily: 'var(--font-sans)', color: 'rgba(16,14,9,0.38)' }}
        >
          Distributed to 150+ stores worldwide
        </p>
        <section className="relative" aria-hidden="true">
          <section className="ticker-track flex items-center gap-14 whitespace-nowrap w-max">
            {[...stores, ...stores].map((name, i) => (
              <StoreIcon key={`${name}-${i}`} name={name} />
            ))}
          </section>
        </section>
        {/* Visible accessible list */}
        <ul className="sr-only" role="list">
          {stores.map(s => <li key={s}>{s}</li>)}
        </ul>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          3. HOW IT WORKS
      ═══════════════════════════════════════════════════════════════ */}
      <section
        id="how-it-works"
        ref={howSection.ref as React.RefObject<HTMLElement>}
        className="py-28 bg-[color:var(--lens-sand)]"
        aria-labelledby="how-heading"
      >
        <article className="max-w-5xl mx-auto px-6">
          <header className="mb-16" style={fadeUp(howSection.inView)}>
            <SectionLabel>How it works</SectionLabel>
            <h2
              id="how-heading"
              className="text-[clamp(28px,4vw,42px)] leading-tight tracking-[-0.02em] text-[color:var(--lens-ink)]"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              Three steps to global reach
            </h2>
          </header>

          <ol className="grid md:grid-cols-3 gap-10 list-none p-0 m-0 relative" role="list">
            {/* connecting line — desktop only */}
            <li aria-hidden="true" className="hidden md:block absolute top-8 left-[16.66%] right-[16.66%] h-px bg-[color:var(--lens-blue)] opacity-10 pointer-events-none" />

            {[
              {
                n: '01',
                title: 'Upload your release',
                body: 'Add your track or album, cover art, and release details in minutes. Supports all major audio formats.',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M11 14V4M7 7.5L11 4l4 3.5" stroke="rgb(31,98,142)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 17h14" stroke="rgb(31,98,142)" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ),
              },
              {
                n: '02',
                title: 'Set credits & splits',
                body: 'Define collaborators, assign revenue splits, and attach ISRC/UPC codes before you go live.',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <circle cx="8" cy="6" r="3" stroke="rgb(31,98,142)" strokeWidth="1.5"/>
                    <circle cx="14" cy="16" r="3" stroke="rgb(31,98,142)" strokeWidth="1.5"/>
                    <path d="M8 9v2a3 3 0 003 3h3" stroke="rgb(31,98,142)" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ),
              },
              {
                n: '03',
                title: 'Distribute & track',
                body: 'We deliver to 150+ stores globally. Monitor streams, downloads, and earnings from your dashboard.',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M3 16l5-6 4 4 5-8" stroke="rgb(31,98,142)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="17" cy="5" r="2" stroke="rgb(31,98,142)" strokeWidth="1.5"/>
                  </svg>
                ),
              },
            ].map(({ n, title, body, icon }, i) => (
              <li key={n} style={fadeUp(howSection.inView, 0.1 + i * 0.12)}>
                <article className="relative">
                  <header className="flex items-start gap-4 mb-5">
                    <span
                      className="text-[56px] leading-none select-none flex-shrink-0 font-bold"
                      aria-hidden="true"
                      style={{ fontFamily: 'var(--font-serif)', color: 'rgba(31,98,142,0.13)' }}
                    >
                      {n}
                    </span>
                    <span
                      className="w-10 h-10 rounded-lg bg-white border border-[color:var(--lens-sand)] flex items-center justify-center flex-shrink-0 mt-1"
                      aria-hidden="true"
                    >
                      {icon}
                    </span>
                  </header>
                  <h3
                    className="text-[16px] font-semibold mb-2.5 text-[color:var(--lens-ink)] tracking-tight"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {title}
                  </h3>
                  <p className="text-[13px] leading-[1.7]" style={{ color: 'rgba(16,14,9,0.58)', fontFamily: 'var(--font-sans)' }}>
                    {body}
                  </p>
                </article>
              </li>
            ))}
          </ol>
        </article>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          4. FOR ARTISTS / FOR LABELS
      ═══════════════════════════════════════════════════════════════ */}
      <section
        id="features"
        ref={featuresSection.ref as React.RefObject<HTMLElement>}
        className="py-28 bg-white"
        aria-labelledby="features-heading"
      >
        <article className="max-w-5xl mx-auto px-6">
          <header className="mb-16" style={fadeUp(featuresSection.inView)}>
            <SectionLabel>Built for everyone</SectionLabel>
            <h2
              id="features-heading"
              className="text-[clamp(28px,4vw,42px)] leading-tight tracking-[-0.02em] text-[color:var(--lens-ink)]"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              For artists. For labels.
            </h2>
            <p className="text-[14px] mt-4 max-w-lg leading-relaxed" style={{ color: 'rgba(16,14,9,0.58)', fontFamily: 'var(--font-sans)' }}>
              One platform built for the full spectrum — from the bedroom producer uploading their first single to the label managing a 50-artist roster.
            </p>
          </header>

          <section className="grid md:grid-cols-2 gap-6">
            {/* Artists */}
            <article
              className="rounded-2xl p-8 border border-[color:var(--lens-sand)]"
              style={{ ...fadeUp(featuresSection.inView, 0.1), background: 'white' }}
            >
              <header className="flex items-center gap-3 mb-7">
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(31,98,142,0.08)' }}
                  aria-hidden="true"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="6.5" r="3.5" stroke="rgb(31,98,142)" strokeWidth="1.5"/>
                    <path d="M3 17.5c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="rgb(31,98,142)" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </span>
                <h3 className="text-[15px] font-semibold text-[color:var(--lens-ink)]" style={{ fontFamily: 'var(--font-sans)' }}>
                  For Artists
                </h3>
              </header>
              <ul className="flex flex-col gap-5 list-none p-0 m-0" role="list">
                {[
                  { label: 'Fast release setup', desc: 'Go from upload to live in under 10 minutes. No paperwork, no waiting.' },
                  { label: 'Revenue splits', desc: 'Divide earnings fairly among collaborators — automatically, every payout.' },
                  { label: 'ISRC & UPC codes', desc: 'We generate and assign industry-standard codes to every release.' },
                  { label: 'Smart links & pre-save', desc: 'Coming soon', soon: true },
                ].map(({ label, desc, soon }) => (
                  <li key={label} className="flex items-start gap-3">
                    <CheckIcon />
                    <section>
                      <p className="text-[13px] font-semibold text-[color:var(--lens-ink)] leading-snug" style={{ fontFamily: 'var(--font-sans)' }}>
                        {label}
                        {soon && (
                          <span
                            className="ml-2 text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-[0.1em] align-middle"
                            style={{ background: 'rgba(31,98,142,0.1)', color: 'rgb(31,98,142)' }}
                          >
                            Soon
                          </span>
                        )}
                      </p>
                      <p className="text-[12px] mt-0.5 leading-relaxed" style={{ color: 'rgba(16,14,9,0.5)', fontFamily: 'var(--font-sans)' }}>
                        {desc}
                      </p>
                    </section>
                  </li>
                ))}
              </ul>
            </article>

            {/* Labels */}
            <article
              className="rounded-2xl p-8 border border-[color:var(--lens-blue)]"
              style={{ ...fadeUp(featuresSection.inView, 0.2), background: 'rgba(31,98,142,0.03)' }}
            >
              <header className="flex items-center gap-3 mb-7">
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(31,98,142,0.1)' }}
                  aria-hidden="true"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="2" y="6" width="16" height="11" rx="1.5" stroke="rgb(31,98,142)" strokeWidth="1.5"/>
                    <path d="M7 6V5a3 3 0 016 0v1" stroke="rgb(31,98,142)" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M7 11h6M7 14h4" stroke="rgb(31,98,142)" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </span>
                <h3 className="text-[15px] font-semibold text-[color:var(--lens-ink)]" style={{ fontFamily: 'var(--font-sans)' }}>
                  For Labels
                </h3>
              </header>
              <ul className="flex flex-col gap-5 list-none p-0 m-0" role="list">
                {[
                  { label: 'Multi-artist catalog', desc: 'Manage all your artists and releases from a single label account.' },
                  { label: 'Territory analytics', desc: 'Break down performance by region, platform, and time period.' },
                  { label: 'Consolidated payouts', desc: 'Track earnings across your entire roster in one place.' },
                  { label: 'Team roles & permissions', desc: 'Coming soon', soon: true },
                ].map(({ label, desc, soon }) => (
                  <li key={label} className="flex items-start gap-3">
                    <CheckIcon />
                    <section>
                      <p className="text-[13px] font-semibold text-[color:var(--lens-ink)] leading-snug" style={{ fontFamily: 'var(--font-sans)' }}>
                        {label}
                        {soon && (
                          <span
                            className="ml-2 text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-[0.1em] align-middle"
                            style={{ background: 'rgba(31,98,142,0.1)', color: 'rgb(31,98,142)' }}
                          >
                            Soon
                          </span>
                        )}
                      </p>
                      <p className="text-[12px] mt-0.5 leading-relaxed" style={{ color: 'rgba(16,14,9,0.5)', fontFamily: 'var(--font-sans)' }}>
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

      {/* ═══════════════════════════════════════════════════════════════
          5. DASHBOARD SHOWCASE
      ═══════════════════════════════════════════════════════════════ */}
      <section
        id="dashboard"
        ref={dashSection.ref as React.RefObject<HTMLElement>}
        className="py-28 bg-[color:var(--lens-sand)]"
        aria-labelledby="dash-heading"
      >
        <article className="max-w-5xl mx-auto px-6">
          <header className="mb-12 max-w-xl" style={fadeUp(dashSection.inView)}>
            <SectionLabel>Platform preview</SectionLabel>
            <h2
              id="dash-heading"
              className="text-[clamp(28px,4vw,42px)] leading-tight tracking-[-0.02em] text-[color:var(--lens-ink)]"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              Your releases, analytics, and earnings — all in one place.
            </h2>
          </header>

          <figure
            className="rounded-2xl overflow-hidden border border-[color:var(--lens-sand)] bg-white shadow-[0_4px_24px_rgba(16,14,9,0.07)]"
            style={fadeUp(dashSection.inView, 0.15)}
            aria-label="Dashboard interface preview"
          >
            {/* browser chrome */}
            <header className="px-4 py-3 border-b border-[color:var(--lens-sand)] flex items-center gap-3 bg-[color:var(--lens-sand)]">
              <span aria-hidden="true" className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[color:var(--lens-ink)] opacity-20" />
                <span className="w-2.5 h-2.5 rounded-full bg-[color:var(--lens-ink)] opacity-20" />
                <span className="w-2.5 h-2.5 rounded-full bg-[color:var(--lens-ink)] opacity-20" />
              </span>
              <span
                className="flex-1 text-center text-[11px] font-medium rounded-md px-3 py-0.5 bg-white"
                style={{ color: 'rgba(16,14,9,0.4)', fontFamily: 'var(--font-sans)', maxWidth: '240px', margin: '0 auto' }}
              >
                app.lensmusic.io/dashboard
              </span>
            </header>

            {/* mock dashboard content */}
            <section className="p-6 grid md:grid-cols-4 gap-4">
              {[
                { label: 'Total Streams', value: '124,891', change: '+12%' },
                { label: 'Revenue (MTD)',  value: '$1,204',  change: '+8%'  },
                { label: 'Active Releases',value: '14',      change: null   },
                { label: 'Stores Live',    value: '150+',    change: null   },
              ].map(({ label, value, change }) => (
                <article
                  key={label}
                  className="rounded-xl p-4 border border-[color:var(--lens-sand)]"
                >
                  <p className="text-[11px] uppercase tracking-[0.12em] mb-2 font-semibold" style={{ color: 'rgba(16,14,9,0.45)', fontFamily: 'var(--font-sans)' }}>
                    {label}
                  </p>
                  <p className="text-[22px] font-bold text-[color:var(--lens-ink)] leading-none" style={{ fontFamily: 'var(--font-serif)' }}>
                    {value}
                  </p>
                  {change && (
                    <p className="text-[11px] font-semibold mt-1.5" style={{ color: 'rgb(31,98,142)', fontFamily: 'var(--font-sans)' }}>
                      {change} this month
                    </p>
                  )}
                </article>
              ))}
            </section>

            <section className="px-6 pb-6">
              <figure className="bg-white rounded-xl border border-[color:var(--lens-sand)] p-4 h-52" aria-label="Revenue chart">
                <DashboardChart
                  data={sampleChartData}
                  dataKey="month"
                  height="100%"
                  width="100%"
                  fill="rgb(31,98,142)"
                />
              </figure>
            </section>
          </figure>
        </article>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          6. ANALYTICS PREVIEW
      ═══════════════════════════════════════════════════════════════ */}
      <section
        id="analytics"
        ref={analyticsSection.ref as React.RefObject<HTMLElement>}
        className="py-28 bg-white"
        aria-labelledby="analytics-heading"
      >
        <article className="max-w-5xl mx-auto px-6">
          <section className="grid md:grid-cols-2 gap-16 items-center">
            <header style={fadeUp(analyticsSection.inView)}>
              <SectionLabel>Analytics</SectionLabel>
              <h2
                id="analytics-heading"
                className="text-[clamp(26px,4vw,40px)] leading-tight tracking-[-0.02em] text-[color:var(--lens-ink)] mb-5"
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
              >
                Know where your audience lives. And grows.
              </h2>
              <p className="text-[13px] leading-[1.75]" style={{ color: 'rgba(16,14,9,0.58)', fontFamily: 'var(--font-sans)' }}>
                Understand which platforms drive the most revenue, which territories are emerging, and how each release performs over time — all surfaced in a clear, actionable dashboard.
              </p>
              <ul className="mt-7 flex flex-col gap-3 list-none p-0 m-0" role="list">
                {['Revenue by platform', 'Streams by territory', 'Monthly trend reports', 'Release-level breakdown'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-[13px] font-medium text-[color:var(--lens-ink)]" style={{ fontFamily: 'var(--font-sans)' }}>
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>
            </header>

            <figure
              className="bg-white rounded-2xl border border-[color:var(--lens-sand)] p-6 h-64 shadow-[0_2px_16px_rgba(16,14,9,0.06)]"
              style={fadeUp(analyticsSection.inView, 0.15)}
              aria-label="Revenue performance chart preview"
            >
              <DashboardChart
                data={sampleChartData}
                dataKey="month"
                height="100%"
                width="100%"
                fill="rgb(31,98,142)"
              />
            </figure>
          </section>
        </article>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          7. COMPARISON TABLE
      ═══════════════════════════════════════════════════════════════ */}
      <section
        id="compare"
        ref={compareSection.ref as React.RefObject<HTMLElement>}
        className="py-28 bg-[color:var(--lens-sand)]"
        aria-labelledby="compare-heading"
      >
        <article className="max-w-3xl mx-auto px-6">
          <header className="mb-12" style={fadeUp(compareSection.inView)}>
            <SectionLabel>Why Lens</SectionLabel>
            <h2
              id="compare-heading"
              className="text-[clamp(28px,4vw,42px)] leading-tight tracking-[-0.02em] text-[color:var(--lens-ink)]"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              The honest comparison.
            </h2>
          </header>

          <figure style={fadeUp(compareSection.inView, 0.1)} aria-label="Feature comparison table">
            <table className="w-full border-collapse bg-white rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(16,14,9,0.06)]" style={{ fontFamily: 'var(--font-sans)' }}>
              <thead>
                <tr className="border-b border-[color:var(--lens-sand)]">
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-[0.16em] font-semibold" style={{ color: 'rgba(16,14,9,0.45)', width: '42%' }}>Feature</th>
                  <th className="px-6 py-4 text-[11px] uppercase tracking-[0.16em] font-semibold text-center" style={{ color: 'rgb(31,98,142)', background: 'rgba(31,98,142,0.05)' }}>Lens Music</th>
                  <th className="px-6 py-4 text-[11px] uppercase tracking-[0.16em] font-semibold text-center" style={{ color: 'rgba(16,14,9,0.35)' }}>Typical distributor</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Upfront cost',       lens: 'Free',           others: '$20 – 50/year' },
                  { feature: 'Revenue share',       lens: '15% on earnings',others: '0 – 20% varies' },
                  { feature: 'Store reach',         lens: '150+ stores',    others: 'Varies' },
                  { feature: 'Revenue splits',      lens: '✓ Built in',     others: 'Limited / extra cost' },
                  { feature: 'Label tools',         lens: '✓ Included',     others: 'Extra cost' },
                  { feature: 'ISRC / UPC codes',    lens: '✓ Auto-assigned',others: 'Manual / extra' },
                ].map(({ feature, lens, others }, i) => (
                  <tr
                    key={feature}
                    className={i % 2 === 0 ? '' : 'bg-[color:var(--lens-sand)] bg-opacity-30'}
                    style={{ borderBottom: i < 5 ? '1px solid rgba(228,226,221,0.8)' : 'none' }}
                  >
                    <td className="px-6 py-4 text-[13px] font-medium text-[color:var(--lens-ink)]">{feature}</td>
                    <td className="px-6 py-4 text-[13px] font-semibold text-center text-[color:var(--lens-blue)]" style={{ background: 'rgba(31,98,142,0.03)' }}>{lens}</td>
                    <td className="px-6 py-4 text-[13px] text-center" style={{ color: 'rgba(16,14,9,0.45)' }}>{others}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </figure>
        </article>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          8. TESTIMONIALS
      ═══════════════════════════════════════════════════════════════ */}
      <section
        id="testimonials"
        ref={testimonials.ref as React.RefObject<HTMLElement>}
        className="py-28 bg-white"
        aria-labelledby="testimonials-heading"
      >
        <article className="max-w-5xl mx-auto px-6">
          <header className="mb-14" style={fadeUp(testimonials.inView)}>
            <SectionLabel>Artist voices</SectionLabel>
            <h2
              id="testimonials-heading"
              className="text-[clamp(28px,4vw,42px)] leading-tight tracking-[-0.02em] text-[color:var(--lens-ink)]"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              From the artists themselves.
            </h2>
          </header>

          <section className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "I uploaded my debut EP on a Friday and it was live on Spotify by Monday. No fees, no friction — just my music where it needs to be.",
                name: "Kaneza M.",
                role: "Independent Artist, Kigali",
              },
              {
                quote: "Managing five artists used to be a spreadsheet nightmare. Lens gave us one place for everything — catalog, splits, analytics. It's what we needed.",
                name: "Trésor Ndiaye",
                role: "Label Manager, Dakar",
              },
              {
                quote: "The revenue split feature alone saved my working relationship with my producer. Everything's transparent, automatic, and fair.",
                name: "Amara Diallo",
                role: "Producer & Artist, Abidjan",
              },
            ].map(({ quote, name, role }, i) => (
              <article
                key={name}
                className="rounded-2xl p-7 border border-[color:var(--lens-sand)] flex flex-col gap-5"
                style={fadeUp(testimonials.inView, 0.1 + i * 0.1)}
              >
                <span
                  aria-hidden="true"
                  className="text-[56px] leading-none font-bold select-none"
                  style={{ fontFamily: 'var(--font-serif)', color: 'rgba(31,98,142,0.15)', marginTop: '-8px' }}
                >
                  "
                </span>
                <blockquote
                  className="text-[14px] leading-[1.75] flex-1"
                  style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'rgba(16,14,9,0.75)' }}
                >
                  {quote}
                </blockquote>
                <footer className="flex items-center gap-3 pt-4 border-t border-[color:var(--lens-sand)]">
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0"
                    style={{ background: 'rgb(31,98,142)', fontFamily: 'var(--font-sans)' }}
                    aria-hidden="true"
                  >
                    {name.charAt(0)}
                  </span>
                  <section>
                    <p className="text-[12px] font-semibold text-[color:var(--lens-ink)]" style={{ fontFamily: 'var(--font-sans)' }}>
                      {name}
                    </p>
                    <p className="text-[11px]" style={{ color: 'rgba(16,14,9,0.45)', fontFamily: 'var(--font-sans)' }}>
                      {role}
                    </p>
                  </section>
                </footer>
              </article>
            ))}
          </section>
        </article>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          9. PRICING
      ═══════════════════════════════════════════════════════════════ */}
      <section
        id="pricing"
        ref={pricingSection.ref as React.RefObject<HTMLElement>}
        className="py-28 bg-[color:var(--lens-sand)]"
        aria-labelledby="pricing-heading"
      >
        <article className="max-w-5xl mx-auto px-6">
          <header className="mb-16" style={fadeUp(pricingSection.inView)}>
            <SectionLabel>Pricing</SectionLabel>
            <h2
              id="pricing-heading"
              className="text-[clamp(28px,4vw,42px)] leading-tight tracking-[-0.02em] text-[color:var(--lens-ink)]"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              Simple. Transparent. Honest.
            </h2>
          </header>

          <section
            className="grid md:grid-cols-3 gap-6"
            style={fadeUp(pricingSection.inView, 0.1)}
          >
            {[
              {
                term: 'Upfront cost',
                value: 'Free',
                sub: 'No subscription, no setup fee. Ever.',
                highlight: true,
              },
              {
                term: 'Revenue share',
                value: '15%',
                sub: 'Only on earnings we help you generate.',
                highlight: false,
              },
              {
                term: 'Store reach',
                value: '150+',
                sub: 'Spotify, Apple Music, Audiomack, Deezer, and more.',
                highlight: false,
              },
            ].map(({ term, value, sub, highlight }) => (
              <article
                key={term}
                className="rounded-2xl p-7 flex flex-col gap-2 border"
                style={{
                  background: highlight ? 'rgb(31,98,142)' : 'white',
                  borderColor: highlight ? 'rgb(31,98,142)' : 'rgb(228,226,221)',
                }}
              >
                <p
                  className="text-[11px] uppercase tracking-[0.16em] font-semibold mb-1"
                  style={{ color: highlight ? 'rgba(255,255,255,0.6)' : 'rgba(16,14,9,0.45)', fontFamily: 'var(--font-sans)' }}
                >
                  {term}
                </p>
                <p
                  className="text-[44px] leading-none font-bold tracking-tight"
                  style={{ fontFamily: 'var(--font-serif)', color: highlight ? 'white' : 'var(--lens-ink)' }}
                >
                  {value}
                </p>
                <p
                  className="text-[13px] leading-relaxed mt-1"
                  style={{ color: highlight ? 'rgba(255,255,255,0.72)' : 'rgba(16,14,9,0.55)', fontFamily: 'var(--font-sans)' }}
                >
                  {sub}
                </p>
              </article>
            ))}
          </section>

          <p
            className="mt-8 text-[12px]"
            style={{ color: 'rgba(16,14,9,0.45)', fontFamily: 'var(--font-sans)', ...fadeUp(pricingSection.inView, 0.2) }}
          >
            The 15% revenue share applies to net earnings generated from stores distributed through Lens. It does not apply to earnings generated outside the platform.
          </p>
        </article>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          10. FAQ
      ═══════════════════════════════════════════════════════════════ */}
      <section
        id="faq"
        ref={faqSection.ref as React.RefObject<HTMLElement>}
        className="py-28 bg-white"
        aria-labelledby="faq-heading"
      >
        <article className="max-w-3xl mx-auto px-6">
          <header className="mb-12" style={fadeUp(faqSection.inView)}>
            <SectionLabel>FAQ</SectionLabel>
            <h2
              id="faq-heading"
              className="text-[clamp(28px,4vw,42px)] leading-tight tracking-[-0.02em] text-[color:var(--lens-ink)]"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              Common questions
            </h2>
          </header>

          <ul
            className="flex flex-col gap-0 list-none p-0 m-0 rounded-2xl overflow-hidden border border-[color:var(--lens-sand)]"
            role="list"
            style={fadeUp(faqSection.inView, 0.1)}
          >
            {[
              {
                q: 'How is distribution free?',
                a: 'Lens covers the cost of delivering your music to stores. We only earn when you do — through a 15% revenue share on earnings generated through the platform.',
              },
              {
                q: 'What does the 15% apply to?',
                a: 'The 15% applies to net revenue from stores distributed through Lens. It does not apply to earnings you generate outside the platform, such as live performances or sync licensing.',
              },
              {
                q: 'Which stores do you deliver to?',
                a: 'We deliver to 150+ stores including Spotify, Apple Music, Audiomack, Deezer, Tidal, Amazon Music, YouTube Music, and many more across Africa and internationally.',
              },
              {
                q: 'Can labels manage multiple artists?',
                a: 'Yes. Label accounts can manage releases across multiple artists and access consolidated analytics for your full roster from a single dashboard.',
              },
              {
                q: 'Do you support revenue splits?',
                a: 'Yes. You can define revenue splits for collaborators when setting up a release. Lens handles the distribution of earnings to each party automatically.',
              },
              {
                q: 'How long does distribution take?',
                a: 'Most releases go live on stores within 2–5 business days after you submit. Timing varies slightly by store — Spotify and Apple Music are typically fastest.',
              },
            ].map(({ q, a }, i) => (
              <li
                key={q}
                className={i < 5 ? 'border-b border-[color:var(--lens-sand)]' : ''}
              >
                <details className="group">
                  <summary
                    className="flex items-center justify-between cursor-pointer px-6 py-5 text-[13px] font-semibold text-[color:var(--lens-ink)] select-none focus-visible:outline-2 focus-visible:outline-[color:var(--lens-blue)] rounded"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {q}
                    <span aria-hidden="true" className="ml-4 flex-shrink-0 faq-icon">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 1v12M1 7h12" stroke="rgb(31,98,142)" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </span>
                  </summary>
                  <p
                    className="px-6 pb-5 text-[13px] leading-[1.75]"
                    style={{ color: 'rgba(16,14,9,0.58)', fontFamily: 'var(--font-sans)' }}
                  >
                    {a}
                  </p>
                </details>
              </li>
            ))}
          </ul>
        </article>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          11. FINAL CTA
      ═══════════════════════════════════════════════════════════════ */}
      <section
        id="about"
        ref={ctaSection.ref as React.RefObject<HTMLElement>}
        className="py-28 grain relative overflow-hidden"
        style={{ background: 'rgb(31,98,142)' }}
        aria-labelledby="cta-heading"
      >
        {/* decorative geometric shapes */}
        <span
          aria-hidden="true"
          className="absolute -top-12 -right-12 w-64 h-64 rounded-full pointer-events-none"
          style={{ border: '1px solid rgba(255,255,255,0.08)' }}
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full pointer-events-none"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}
        />
        <span
          aria-hidden="true"
          className="absolute top-10 left-1/4 w-1 h-24 pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.07)' }}
        />

        <article className="max-w-3xl mx-auto px-6 text-center relative" style={fadeUp(ctaSection.inView)}>
          <p className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-5" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-sans)' }}>
            Get started today
          </p>
          <h2
            id="cta-heading"
            className="text-[clamp(30px,5vw,52px)] text-white mb-5 tracking-[-0.02em] leading-tight"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
          >
            Your music deserves a global audience.
          </h2>
          <p
            className="text-[15px] leading-[1.75] mb-10 max-w-lg mx-auto"
            style={{ color: 'rgba(255,255,255,0.68)', fontFamily: 'var(--font-sans)' }}
          >
            Start distributing to 150+ stores today. Free to upload — we only earn when you do.
          </p>

          {/* email + CTA form */}
          <form
            onSubmit={(e) => { e.preventDefault(); window.location.href = '/auth/login'; }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            aria-label="Sign up form"
          >
            <label htmlFor="cta-email" className="sr-only">Email address</label>
            <input
              id="cta-email"
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-lg text-[13px] text-[color:var(--lens-ink)] placeholder-[color:var(--lens-ink)] focus:outline-none"
              style={{
                fontFamily: 'var(--font-sans)',
                background: 'rgba(255,255,255,0.95)',
                border: 'none',
              }}
              aria-label="Email address"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-lg text-[12px] font-semibold tracking-[0.05em] transition-all duration-200 hover:scale-[1.02] whitespace-nowrap"
              style={{
                background: 'rgb(16,14,9)',
                color: 'white',
                fontFamily: 'var(--font-sans)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Start uploading
            </button>
          </form>

          <p className="mt-4 text-[11px]" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-sans)' }}>
            No credit card required. Start in under 2 minutes.
          </p>
        </article>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          12. FOOTER
      ═══════════════════════════════════════════════════════════════ */}
      <footer
        id="contact"
        className="bg-[color:var(--lens-ink)] text-white"
        role="contentinfo"
      >
        <section className="max-w-6xl mx-auto px-6 pt-16 pb-8">
          {/* top grid */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
            {/* brand */}
            <section className="col-span-2 md:col-span-1">
              <Link
                to="/"
                aria-label="Lens Music home"
                className="flex items-center gap-2.5 mb-4 focus-visible:outline-2 focus-visible:outline-white rounded w-fit"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="2" stroke="white" strokeWidth="1.5" opacity="0.8"/>
                  <circle cx="12" cy="12" r="5.5" stroke="white" strokeWidth="1.5" opacity="0.8"/>
                  <circle cx="12" cy="12" r="2" fill="white" opacity="0.8"/>
                </svg>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', fontWeight: 700 }}>
                  Lens Music
                </span>
              </Link>
              <p className="text-[12px] leading-relaxed max-w-[200px]" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-sans)' }}>
                Free music distribution for independent artists and labels, built in Rwanda.
              </p>
            </section>

            {/* product links */}
            <nav aria-label="Product links">
              <p className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-sans)' }}>
                Product
              </p>
              <ul className="flex flex-col gap-2.5 list-none p-0 m-0" role="list">
                {[
                  { label: 'How it works', href: '#how-it-works' },
                  { label: 'Features',     href: '#features'     },
                  { label: 'Pricing',      href: '#pricing'      },
                  { label: 'Dashboard',    href: '#dashboard'    },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="footer-link text-[12px]"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* company */}
            <nav aria-label="Company links">
              <p className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-sans)' }}>
                Company
              </p>
              <ul className="flex flex-col gap-2.5 list-none p-0 m-0" role="list">
                {[
                  { label: 'About',   href: '#about'   },
                  { label: 'Contact', href: '#contact' },
                  { label: 'FAQ',     href: '#faq'     },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="footer-link text-[12px]"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* legal */}
            <nav aria-label="Legal links">
              <p className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-sans)' }}>
                Legal
              </p>
              <ul className="flex flex-col gap-2.5 list-none p-0 m-0" role="list">
                {['Privacy Policy', 'Terms of Service', 'Artist Agreement'].map(label => (
                  <li key={label}>
                    <a
                      href="#"
                      className="footer-link text-[12px]"
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
          <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-7">
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-sans)' }}>
              Distribution is free. Lens charges a 15% revenue share on earnings generated through the platform.
            </p>
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-sans)' }}>
              © Lens Music, {new Date().getFullYear()}. All rights reserved.
            </p>
          </section>
        </section>
      </footer>
    </main>
  );
};

export default LandingPage;
