import { CSSProperties, ReactNode, RefObject, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faApple,
  faDeezer,
  faSpotify,
  faYoutube,
  faAmazon,
  IconDefinition,
} from '@fortawesome/free-brands-svg-icons';
import Button from '@/components/inputs/Button';
import DashboardChart from '@/components/graphs/DashboardChart';
import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';

const sampleChartData = [
  { month: 'Aug', value: 780 },
  { month: 'Sep', value: 940 },
  { month: 'Oct', value: 1210 },
  { month: 'Nov', value: 1335 },
  { month: 'Dec', value: 1580 },
  { month: 'Jan', value: 1840 },
  { month: 'Feb', value: 2055 },
];

function useInView() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, inView };
}

function useStatCounter(target: number, active: boolean, duration = 1400) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let current = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = window.setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        window.clearInterval(timer);
      } else {
        setCount(current);
      }
    }, 16);

    return () => window.clearInterval(timer);
  }, [active, duration, target]);

  return count;
}

const fadeUp = (inView: boolean, delay = 0): CSSProperties => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translateY(0)' : 'translateY(20px)',
  transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
});

const SectionLabel = ({ children }: { children: ReactNode }) => (
  <p
    className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--lens-blue)]"
    style={{ fontFamily: 'var(--font-sans)', fontWeight: 400 }}
  >
    {children}
  </p>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0 mt-0.5">
    <circle cx="7" cy="7" r="6.5" stroke="rgb(31,98,142)" opacity="0.18" />
    <path d="M4 7.1 6.1 9.1 10 5" stroke="rgb(31,98,142)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StoreIcon = ({ name }: { name: string }) => {
  const icons: Record<string, IconDefinition> = {
    Spotify: faSpotify,
    'Apple Music': faApple,
    Deezer: faDeezer,
    Tidal: faApple,
    'YouTube Music': faYoutube,
    Audiomack: faAmazon,
    'Amazon Music': faAmazon,
  };

  return (
    <figure className="flex flex-col items-center gap-2 opacity-60 hover:opacity-90 transition-opacity" aria-label={name}>
      <span className="text-[15px] text-[color:var(--lens-ink)]/75">
        <FontAwesomeIcon icon={icons[name]} />
      </span>
      <figcaption className="text-[10px] text-[color:var(--lens-ink)]/70 font-normal">{name}</figcaption>
    </figure>
  );
};

const FadeSection = ({
  id,
  title,
  children,
  className,
}: {
  id?: string;
  title?: string;
  children: (ctx: { ref: RefObject<HTMLElement>; inView: boolean }) => ReactNode;
  className?: string;
}) => {
  const section = useInView();
  return (
    <section
      id={id}
      ref={section.ref as RefObject<HTMLElement>}
      className={className}
      aria-labelledby={title ? `${id}-heading` : undefined}
    >
      {children({ ref: section.ref as RefObject<HTMLElement>, inView: section.inView })}
    </section>
  );
};

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const heroStats = useInView();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const countStores = useStatCounter(150, heroStats.inView);
  const countArtists = useStatCounter(2400, heroStats.inView);
  const countCountries = useStatCounter(38, heroStats.inView);

  const stores = ['Spotify', 'Apple Music', 'Deezer', 'Tidal', 'YouTube Music', 'Audiomack', 'Amazon Music'];

  return (
    <main className="min-h-screen bg-white text-[color:var(--lens-ink)] overflow-x-hidden" style={{ fontFamily: 'var(--font-sans)' }}>
      <style>{`
        .nav-link { position: relative; transition: opacity 0.2s ease; }
        .nav-link::after { content: ''; position: absolute; left: 0; bottom: -2px; width: 0; height: 1px; background: currentColor; transition: width 0.2s ease; }
        .nav-link:hover::after { width: 100%; }
        .footer-link { position: relative; color: rgba(255,255,255,0.55); transition: color 0.2s ease; }
        .footer-link::after { content: ''; position: absolute; left: 0; bottom: -2px; width: 0; height: 1px; background: rgba(255,255,255,0.7); transition: width 0.2s ease; }
        .footer-link:hover { color: white; }
        .footer-link:hover::after { width: 100%; }
        details[open] > summary .faq-plus { transform: rotate(45deg); }
        .faq-plus { transition: transform .2s ease; }
        .editorial-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: var(--color-primary);
          color: white;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 0.5rem 0.75rem;
          font-weight: 400;
        }
        @media (prefers-reduced-motion: reduce) {
          * { scroll-behavior: auto !important; }
        }
      `}</style>

      <PublicNavbar scrolled={scrolled} variant="landing" />

      <section id="hero" className="pt-26 pb-16 md:pb-20" aria-labelledby="hero-heading">
        <article className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-start">
          <header className="space-y-6">
            <SectionLabel>Free music distribution*</SectionLabel>
            <h1
              id="hero-heading"
              className="text-[clamp(38px,6vw,66px)] leading-[1.02] tracking-[-0.03em] text-[color:var(--lens-ink)]"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              Release your music widely. Understand what it earns.
            </h1>
            <p className="max-w-xl text-[14px] leading-7 text-[color:var(--lens-ink)]/65 font-normal">
              Lens Music helps independent artists and labels distribute to 150+ stores, then
              track revenue and performance in one clear workspace. Distribution is free. Lens
              takes 15% only when you earn.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button route="/auth/signup" primary className="px-6 py-2.5 text-[12px] tracking-[0.04em] font-normal">
                Start uploading
              </Button>
              <Button route="/auth/login" className="px-6 py-2.5 text-[12px] tracking-[0.04em] font-normal">
                Sign in to dashboard
              </Button>
            </div>

            <p className="text-[12px] text-[color:var(--lens-ink)]/50 font-normal">
              No annual upload fee. Revenue analytics included.
            </p>

            <section ref={heroStats.ref as RefObject<HTMLElement>} className="grid sm:grid-cols-3 gap-3 pt-4" aria-label="Platform summary">
              {[
                { label: 'Stores connected', value: `${countStores}+` },
                { label: 'Artists and labels', value: `${countArtists.toLocaleString()}+` },
                { label: 'Countries reached', value: `${countCountries}+` },
              ].map((stat) => (
                <article key={stat.label} className="rounded-xl border border-[color:var(--lens-sand)] p-4">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--lens-ink)]/50 font-normal">
                    {stat.label}
                  </p>
                  <p
                    className="mt-2 text-[26px] leading-none"
                    style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
                  >
                    {stat.value}
                  </p>
                </article>
              ))}
            </section>
          </header>

          <figure className="border border-[color:var(--lens-sand)] rounded-2xl bg-white overflow-hidden" aria-label="Revenue analytics dashboard preview">
            <header className="px-5 py-4 border-b border-[color:var(--lens-sand)] flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--lens-blue)] font-normal">Revenue analytics</p>
                <p className="mt-1 text-[13px] text-[color:var(--lens-ink)]/60 font-normal">February payout cycle</p>
              </div>
              <span className="px-3 py-1 rounded-full border border-[color:var(--lens-sand)] text-[11px] text-[color:var(--lens-ink)]/65 font-normal">
                Revenue workspace preview
              </span>
            </header>

            <section className="p-5 grid grid-cols-2 gap-3 border-b border-[color:var(--lens-sand)]">
              {[
                ['Monthly revenue', '$2,055'],
                ['Payout pending', '$412'],
                ['Top platform', 'Spotify'],
                ['Growth vs last month', '+11.7%'],
              ].map(([label, value]) => (
                <article key={label} className="rounded-xl border border-[color:var(--lens-sand)] p-4 bg-[color:var(--lens-sand)]/15">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-[color:var(--lens-ink)]/50 font-normal">{label}</p>
                  <p className="mt-2 text-[20px] leading-none text-[color:var(--lens-ink)]" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
                    {value}
                  </p>
                </article>
              ))}
            </section>

            <section className="p-5 grid gap-4">
              <figure className="rounded-xl border border-[color:var(--lens-sand)] p-4 h-52" aria-label="Monthly revenue trend">
                <figcaption className="text-[12px] text-[color:var(--lens-ink)]/65 font-normal mb-2">
                  Revenue trend (last 7 months)
                </figcaption>
                <DashboardChart
                  data={sampleChartData}
                  dataKey="month"
                  height="88%"
                  areaFillMode="solid"
                  areaOpacity={0.08}
                  tooltipVariant="minimal"
                  showGrid
                  fill="rgb(31,98,142)"
                />
              </figure>

              <section className="grid sm:grid-cols-2 gap-4">
                <article className="rounded-xl border border-[color:var(--lens-sand)] p-4">
                  <h2 className="text-[13px] text-[color:var(--lens-ink)]" style={{ fontWeight: 400 }}>
                    Platform revenue split
                  </h2>
                  <ul className="mt-4 space-y-3 list-none m-0 p-0">
                    {[
                      ['Spotify', 42],
                      ['Apple Music', 28],
                      ['YouTube Music', 14],
                      ['Deezer', 9],
                      ['Other', 7],
                    ].map(([name, width]) => (
                      <li key={String(name)} className="grid grid-cols-[92px_1fr_38px] items-center gap-3">
                        <span className="text-[12px] text-[color:var(--lens-ink)]/65 font-normal">{name}</span>
                        <span className="h-2 rounded-full bg-[color:var(--lens-sand)] overflow-hidden">
                          <span
                            className="block h-full bg-[color:var(--lens-blue)]"
                            style={{ width: `${width}%` }}
                            aria-hidden="true"
                          />
                        </span>
                        <span className="text-[12px] text-right text-[color:var(--lens-ink)] font-normal">{width}%</span>
                      </li>
                    ))}
                  </ul>
                </article>

                <article className="rounded-xl border border-[color:var(--lens-sand)] p-4">
                  <h2 className="text-[13px] text-[color:var(--lens-ink)]" style={{ fontWeight: 400 }}>
                    Top territories
                  </h2>
                  <ul className="mt-4 divide-y divide-[color:var(--lens-sand)] list-none m-0 p-0">
                    {[
                      ['United States', '$881'],
                      ['Rwanda', '$296'],
                      ['Kenya', '$241'],
                      ['United Kingdom', '$198'],
                    ].map(([market, amount]) => (
                      <li key={String(market)} className="py-2.5 flex items-center justify-between gap-2">
                        <span className="text-[12px] text-[color:var(--lens-ink)]/65 font-normal">{market}</span>
                        <span className="text-[12px] text-[color:var(--lens-ink)] font-normal">{amount}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </section>
            </section>
          </figure>
        </article>
      </section>

      <section className="border-y border-[color:var(--lens-sand)] bg-[color:var(--lens-sand)]/20 py-6" aria-label="Supported music platforms">
        <article className="max-w-6xl mx-auto px-6">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--lens-ink)]/45 mb-4 font-normal">
            Distributed to 150+ stores worldwide
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-6">
            {stores.map((store) => (
              <StoreIcon key={store} name={store} />
            ))}
          </div>
        </article>
      </section>

      <FadeSection id="how-it-works" className="py-24 bg-white">
        {({ inView }) => (
          <article className="max-w-6xl mx-auto px-6">
            <header className="max-w-2xl" style={fadeUp(inView)}>
              <SectionLabel>How it works</SectionLabel>
              <h2
                id="how-it-works-heading"
                className="mt-4 text-[clamp(28px,4vw,44px)] leading-tight tracking-[-0.02em]"
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
              >
                A clear release workflow from upload to payout.
              </h2>
              <p className="mt-4 text-[13px] leading-7 text-[color:var(--lens-ink)]/60 font-normal">
                Lens keeps the release process simple and gives you the revenue reporting needed to
                make decisions after launch.
              </p>
            </header>

            <ol className="mt-10 grid md:grid-cols-3 gap-4 list-none p-0 m-0">
              {[
                {
                  step: '01',
                  title: 'Prepare your release',
                  text: 'Add audio, cover art, metadata, and credits in one structured submission flow.',
                },
                {
                  step: '02',
                  title: 'Deliver to stores',
                  text: 'Send your release to major streaming and download platforms from a single dashboard.',
                },
                {
                  step: '03',
                  title: 'Track earnings',
                  text: 'Review platform and territory performance with revenue trends and payout summaries.',
                },
              ].map((item, index) => (
                <li key={item.step} style={fadeUp(inView, 0.08 * index)}>
                  <article className="h-full rounded-2xl border border-[color:var(--lens-sand)] p-6">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--lens-blue)] font-normal">{item.step}</p>
                    <h3 className="mt-4 text-[18px] leading-snug text-[color:var(--lens-ink)]" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400 }}>
                      {item.title}
                    </h3>
                    <p className="mt-3 text-[12px] leading-6 text-[color:var(--lens-ink)]/60 font-normal">{item.text}</p>
                  </article>
                </li>
              ))}
            </ol>
          </article>
        )}
      </FadeSection>

      <FadeSection id="features" className="py-24 bg-[color:var(--lens-ink)] text-white">
        {({ inView }) => (
          <article className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[1fr_1fr] gap-12 items-start">
            <header style={fadeUp(inView)}>
              <span className="editorial-chip">Built around your needs</span>
              <h2
                id="features-heading"
                className="mt-5 text-[clamp(28px,4vw,42px)] leading-tight tracking-[-0.02em] text-white"
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
              >
                Distribution tools with reporting that stays readable.
              </h2>
              <p className="mt-4 text-[13px] leading-7 text-white/70 font-normal">
                Lens is designed for artists, managers, labels, and small teams that need reliable
                delivery plus practical revenue visibility.
              </p>
            </header>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                ['Store delivery', 'Publish releases to 150+ stores from one workflow.'],
                ['Catalog tracking', 'Monitor release status and keep your catalog organized.'],
                ['Revenue analytics', 'View earnings by platform, territory, and reporting period.'],
                ['Payout visibility', 'Track pending balances and payout activity in one place.'],
                ['Label support', 'Manage multiple artists and release operations from one account.'],
                ['Codes included', 'ISRC and UPC handling stays inside the release process.'],
              ].map(([title, text], index) => (
                <article
                  key={title}
                  className="rounded-none border border-white/15 bg-[color:var(--lens-sand)] p-5 text-[color:var(--lens-ink)]"
                  style={fadeUp(inView, 0.05 * index)}
                >
                  <h3 className="text-[14px] text-[color:var(--lens-ink)]" style={{ fontWeight: 400 }}>{title}</h3>
                  <p className="mt-3 text-[12px] leading-6 text-[color:var(--lens-ink)]/75 font-normal">{text}</p>
                </article>
              ))}
            </div>
          </article>
        )}
      </FadeSection>

      <FadeSection id="analytics" className="py-24 bg-white">
        {({ inView }) => (
          <article className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[0.95fr_1.05fr] gap-12 items-center">
            <header style={fadeUp(inView)}>
              <SectionLabel>Revenue analytics</SectionLabel>
              <h2
                id="analytics-heading"
                className="mt-4 text-[clamp(28px,4vw,42px)] leading-tight tracking-[-0.02em]"
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
              >
                See where revenue comes from, not just how much arrived.
              </h2>
              <p className="mt-4 text-[13px] leading-7 text-[color:var(--lens-ink)]/60 font-normal">
                Lens surfaces the platform and territory context behind every reporting cycle so
                you can compare release performance and plan your next launch with better data.
              </p>
              <ul className="mt-6 space-y-3 list-none p-0 m-0">
                {[
                  'Revenue trend tracking by month',
                  'Platform and territory breakdowns',
                  'Pending payout visibility',
                  'Release-level performance review',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[13px] text-[color:var(--lens-ink)] font-normal">
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </header>

            <figure className="rounded-2xl border border-[color:var(--lens-sand)] p-5 h-[320px]" style={fadeUp(inView, 0.12)} aria-label="Revenue trend preview">
              <figcaption className="text-[12px] text-[color:var(--lens-ink)]/60 mb-3 font-normal">
                Sample monthly earnings trend
              </figcaption>
              <DashboardChart
                data={sampleChartData}
                dataKey="month"
                height="90%"
                areaFillMode="none"
                showGrid
                showYAxis
                tooltipVariant="minimal"
                fill="rgb(31,98,142)"
              />
            </figure>
          </article>
        )}
      </FadeSection>

      <FadeSection id="compare" className="py-24 bg-[color:var(--lens-sand)]/20">
        {({ inView }) => (
          <article className="max-w-4xl mx-auto px-6">
            <header className="mb-8" style={fadeUp(inView)}>
              <SectionLabel>Comparison</SectionLabel>
              <h2
                id="compare-heading"
                className="mt-4 text-[clamp(28px,4vw,40px)] leading-tight tracking-[-0.02em]"
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
              >
                A straightforward model for independent releases.
              </h2>
            </header>

            <figure className="overflow-hidden rounded-2xl border border-[color:var(--lens-sand)] bg-white" style={fadeUp(inView, 0.1)} aria-label="Feature comparison table">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[color:var(--lens-sand)]">
                    <th className="text-left px-5 py-4 text-[11px] uppercase tracking-[0.15em] text-[color:var(--lens-ink)]/55" style={{ fontWeight: 400 }}>
                      Category
                    </th>
                    <th className="text-left px-5 py-4 text-[11px] uppercase tracking-[0.15em] text-[color:var(--lens-blue)]" style={{ fontWeight: 400 }}>
                      Lens Music
                    </th>
                    <th className="text-left px-5 py-4 text-[11px] uppercase tracking-[0.15em] text-[color:var(--lens-ink)]/45" style={{ fontWeight: 400 }}>
                      Typical distributor
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Upfront cost', 'Free', '$20 to $50/year'],
                    ['Revenue share', '15% on earnings', 'Varies by plan'],
                    ['Store reach', '150+ stores', 'Varies'],
                    ['Revenue analytics', 'Included', 'Often limited by plan'],
                    ['Label tools', 'Included', 'Often extra cost'],
                    ['Codes (ISRC/UPC)', 'Handled in workflow', 'May require manual setup'],
                  ].map((row, i) => (
                    <tr key={row[0]} className={i % 2 === 0 ? '' : 'bg-[color:var(--lens-sand)]/10'}>
                      <td className="px-5 py-4 text-[12px] text-[color:var(--lens-ink)] font-normal">{row[0]}</td>
                      <td className="px-5 py-4 text-[12px] text-[color:var(--lens-ink)] font-normal">{row[1]}</td>
                      <td className="px-5 py-4 text-[12px] text-[color:var(--lens-ink)]/60 font-normal">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </figure>
          </article>
        )}
      </FadeSection>

      <FadeSection id="testimonials" className="py-24 bg-white">
        {({ inView }) => (
          <article className="max-w-6xl mx-auto px-6">
            <header className="max-w-2xl" style={fadeUp(inView)}>
              <SectionLabel>Artist voices</SectionLabel>
              <h2
                id="testimonials-heading"
                className="mt-4 text-[clamp(28px,4vw,40px)] leading-tight tracking-[-0.02em]"
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
              >
                What artists say after switching to a clearer workflow.
              </h2>
            </header>

            <section className="mt-8 grid lg:grid-cols-2 border border-[color:var(--lens-sand)] rounded-2xl overflow-hidden" style={fadeUp(inView, 0.08)}>
              <figure className="bg-primary text-white p-8 md:p-10 min-h-[320px] flex flex-col justify-between">
                <figcaption>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/70 font-normal">Featured quote</p>
                  <p
                    className="mt-4 text-[clamp(26px,4vw,38px)] leading-[1.02] tracking-[-0.03em]"
                    style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
                  >
                    “The revenue view finally makes sense to our team.”
                  </p>
                </figcaption>
                <div className="mt-8 h-36 w-36 rounded-full border border-white/25 bg-white/10 flex items-center justify-center">
                  <span className="text-[10px] uppercase tracking-[0.16em] text-white/80 font-normal">Artist story</span>
                </div>
              </figure>

              <div className="bg-white p-6 md:p-8 grid gap-4">
                {[
                  [
                    'Lens made our release workflow easier to manage. The reporting view is clear enough that the team actually uses it every week.',
                    'Aline N.',
                    'Artist manager',
                  ],
                  [
                    'We needed a simpler way to track where income was coming from. Platform and territory summaries have been the biggest improvement.',
                    'M. Didier',
                    'Independent label',
                  ],
                  [
                    'The no-upfront-cost model helped us launch quickly, and the dashboard gives us enough visibility to plan the next release cycle.',
                    'S. Kamanzi',
                    'Artist',
                  ],
                ].map(([quote, name, role], index) => (
                  <blockquote
                    key={String(name)}
                    className="border-b last:border-b-0 border-[color:var(--lens-sand)] pb-4 last:pb-0"
                    style={fadeUp(inView, 0.12 + 0.05 * index)}
                  >
                    <p className="text-[13px] leading-7 text-[color:var(--lens-ink)]/75 font-normal">{quote}</p>
                    <footer className="mt-3">
                      <p className="text-[12px] text-[color:var(--lens-ink)] font-normal">{name}</p>
                      <p className="text-[11px] text-[color:var(--lens-ink)]/50 font-normal">{role}</p>
                    </footer>
                  </blockquote>
                ))}
              </div>
            </section>
          </article>
        )}
      </FadeSection>

      <FadeSection id="pricing" className="py-24 bg-[color:var(--lens-sand)]/20">
        {({ inView }) => (
          <article className="max-w-5xl mx-auto px-6">
            <header className="max-w-2xl" style={fadeUp(inView)}>
              <SectionLabel>Pricing</SectionLabel>
              <h2
                id="pricing-heading"
                className="mt-4 text-[clamp(28px,4vw,40px)] leading-tight tracking-[-0.02em]"
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
              >
                Free to distribute. Revenue share only when earnings arrive.
              </h2>
              <p className="mt-4 text-[13px] leading-7 text-[color:var(--lens-ink)]/60 font-normal">
                Lens does not charge an upfront distribution fee. The platform takes a 15% share
                of earnings generated through Lens.
              </p>
            </header>

            <div className="mt-8 grid md:grid-cols-[1.1fr_0.9fr] gap-4">
              <article className="rounded-2xl border border-[color:var(--lens-sand)] bg-white p-7" style={fadeUp(inView, 0.05)}>
                <p className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--lens-blue)] font-normal">Lens distribution</p>
                <p className="mt-4 text-[40px] leading-none" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
                  $0
                </p>
                <p className="mt-2 text-[12px] text-[color:var(--lens-ink)]/60 font-normal">Upfront distribution cost</p>
                <ul className="mt-6 space-y-3 list-none p-0 m-0">
                  {[
                    'Distribute to 150+ stores',
                    'Revenue analytics dashboard',
                    'Payout visibility and reporting',
                    'Catalog and release management tools',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[12px] font-normal">
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-2xl border border-[color:var(--lens-sand)] bg-white p-7" style={fadeUp(inView, 0.1)}>
                <h3 className="text-[14px] text-[color:var(--lens-ink)]" style={{ fontWeight: 400 }}>Revenue share</h3>
                <p className="mt-4 text-[34px] leading-none" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
                  15%
                </p>
                <p className="mt-2 text-[12px] text-[color:var(--lens-ink)]/60 font-normal">
                  Applied to earnings generated through Lens.
                </p>
                <div className="mt-6 border-t border-[color:var(--lens-sand)] pt-5">
                  <p className="text-[12px] text-[color:var(--lens-ink)]/65 font-normal leading-6">
                    Example: if a release earns $100 through Lens, the artist payout is $85 and Lens retains $15.
                  </p>
                </div>
              </article>
            </div>
          </article>
        )}
      </FadeSection>

      <FadeSection id="faq" className="py-24 bg-white">
        {({ inView }) => (
          <article className="max-w-4xl mx-auto px-6">
            <header className="max-w-2xl" style={fadeUp(inView)}>
              <SectionLabel>FAQ</SectionLabel>
              <h2
                id="faq-heading"
                className="mt-4 text-[clamp(28px,4vw,40px)] leading-tight tracking-[-0.02em]"
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
              >
                Questions artists ask before they switch.
              </h2>
            </header>

            <div className="mt-8 space-y-3">
              {[
                ['Is Lens Music free to use?', 'Lens does not charge an upfront distribution fee. Lens earns through a 15% revenue share on earnings generated through the platform.'],
                ['How many stores can I distribute to?', 'Lens supports delivery to 150+ stores and services, including major streaming platforms.'],
                ['Do I get revenue analytics?', 'Yes. Lens includes revenue reporting and performance views so you can review trends by platform and territory.'],
                ['Can labels use Lens?', 'Yes. Lens is designed for independent artists and labels, with catalog and release management support.'],
              ].map(([question, answer], index) => (
                <details
                  key={String(question)}
                  className="rounded-xl border border-[color:var(--lens-sand)] px-4"
                  style={fadeUp(inView, 0.04 * index)}
                >
                  <summary className="list-none cursor-pointer py-4 flex items-center justify-between gap-4">
                    <span className="text-[13px] text-[color:var(--lens-ink)] font-normal">{question}</span>
                    <span className="faq-plus text-[18px] leading-none text-[color:var(--lens-blue)]" aria-hidden="true">+</span>
                  </summary>
                  <p className="pb-4 text-[12px] leading-6 text-[color:var(--lens-ink)]/60 font-normal">{answer}</p>
                </details>
              ))}
            </div>
          </article>
        )}
      </FadeSection>

      <FadeSection id="cta" className="py-20 bg-[color:var(--lens-ink)] text-white">
        {({ inView }) => (
          <article className="max-w-5xl mx-auto px-6">
            <section className="rounded-2xl border border-white/15 bg-black/25 p-8 md:p-10 text-center relative overflow-hidden" style={fadeUp(inView)}>
              <span className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary" aria-hidden="true" />
              <span className="absolute -left-5 bottom-8 h-14 w-14 rounded-full border border-white/20" aria-hidden="true" />
              <div className="relative z-10">
              <span className="editorial-chip">Start now</span>
              <h2
                id="cta-heading"
                className="mt-4 text-[clamp(30px,4vw,46px)] leading-tight tracking-[-0.02em] text-white"
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
              >
                Launch your next release with distribution and revenue reporting in one place.
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-[13px] leading-7 text-white/70 font-normal">
                Create your Lens account to distribute to 150+ stores and monitor earnings with a clear analytics dashboard.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button route="/auth/signup" primary className="px-6 py-2.5 text-[12px] tracking-[0.04em] font-normal">
                  Start uploading
                </Button>
                <Button route="/auth/login" className="px-6 py-2.5 text-[12px] tracking-[0.04em] font-normal border-white! text-white! bg-transparent! hover:bg-white/10!">
                  Sign in to dashboard
                </Button>
              </div>
              </div>
            </section>
          </article>
        )}
      </FadeSection>

      <PublicFooter />
    </main>
  );
};

export default LandingPage;
