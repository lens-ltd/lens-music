import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/inputs/Button';
import DashboardChart from '@/components/graphs/DashboardChart';
import { sampleChartData, SectionLabel, useInView, useStatCounter } from './landingShared';

const metrics = [
  ['Monthly revenue', '$2,055'],
  ['Payout pending', '$412'],
  ['Top platform', 'Spotify'],
  ['Growth vs last month', '+11.7%'],
] as const;

const platformSplit = [
  ['Spotify', 42],
  ['Apple Music', 28],
  ['YouTube Music', 14],
  ['Deezer', 9],
  ['Other', 7],
] as const;

const topTerritories = [
  ['United States', '$881'],
  ['Rwanda', '$296'],
  ['Kenya', '$241'],
  ['United Kingdom', '$198'],
] as const;

export default function HeroSection() {
  const heroStats = useInView<HTMLElement>();
  const countStores = useStatCounter(150, heroStats.inView);
  const countArtists = useStatCounter(2400, heroStats.inView);
  const countCountries = useStatCounter(38, heroStats.inView);

  return (
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
            Lens Music helps independent artists and labels distribute to 150+ stores, then track
            revenue and performance in one clear workspace. Distribution is free. Lens takes 15%
            only when you earn.
          </p>

          <menu className="flex flex-wrap items-center gap-3 p-0 m-0">
            <Button route="/auth/login" primary className="px-6 py-2.5 text-[12px] tracking-[0.04em] font-normal">
              <FontAwesomeIcon icon={faRocket} />
              Start uploading
            </Button>
          </menu>

          <p className="text-[12px] text-[color:var(--lens-ink)]/50 font-normal">
            No annual upload fee. Revenue analytics included.
          </p>

          <section ref={heroStats.ref} className="grid sm:grid-cols-3 gap-3 pt-4" aria-label="Platform summary">
            {[
              { label: 'Stores connected', value: `${countStores}+` },
              { label: 'Artists and labels', value: `${countArtists.toLocaleString()}+` },
              { label: 'Countries reached', value: `${countCountries}+` },
            ].map((stat) => (
              <article key={stat.label} className="rounded-xl border border-[color:var(--lens-sand)] p-4">
                <p className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--lens-ink)]/50 font-normal">
                  {stat.label}
                </p>
                <p className="mt-2 text-[26px] leading-none" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
                  {stat.value}
                </p>
              </article>
            ))}
          </section>
        </header>

        <figure className="border border-[color:var(--lens-sand)] rounded-2xl bg-white overflow-hidden" aria-label="Revenue analytics dashboard preview">
          <header className="px-5 py-4 border-b border-[color:var(--lens-sand)] flex items-center justify-between gap-3">
            <section>
              <p className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--lens-blue)] font-normal">Revenue analytics</p>
              <p className="mt-1 text-[13px] text-[color:var(--lens-ink)]/60 font-normal">February payout cycle</p>
            </section>
            <p className="px-3 py-1 rounded-full border border-[color:var(--lens-sand)] text-[11px] text-[color:var(--lens-ink)]/65 font-normal">
              Revenue workspace preview
            </p>
          </header>

          <section className="p-5 grid grid-cols-2 gap-3 border-b border-[color:var(--lens-sand)]">
            {metrics.map(([label, value]) => (
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
              <DashboardChart data={sampleChartData} dataKey="month" height="88%" areaFillMode="solid" areaOpacity={0.08} tooltipVariant="minimal" showGrid fill="rgb(31,98,142)" />
            </figure>

            <section className="grid sm:grid-cols-2 gap-4">
              <article className="rounded-xl border border-[color:var(--lens-sand)] p-4">
                <h2 className="text-[13px] text-[color:var(--lens-ink)]" style={{ fontWeight: 400 }}>Platform revenue split</h2>
                <ul className="mt-4 space-y-3 list-none m-0 p-0">
                  {platformSplit.map(([name, width]) => (
                    <li key={name} className="grid grid-cols-[92px_1fr_38px] items-center gap-3">
                      <span className="text-[12px] text-[color:var(--lens-ink)]/65 font-normal">{name}</span>
                      <span className="h-2 rounded-full bg-[color:var(--lens-sand)] overflow-hidden">
                        <span className="block h-full bg-[color:var(--lens-blue)]" style={{ width: `${width}%` }} aria-hidden="true" />
                      </span>
                      <span className="text-[12px] text-right text-[color:var(--lens-ink)] font-normal">{width}%</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-xl border border-[color:var(--lens-sand)] p-4">
                <h2 className="text-[13px] text-[color:var(--lens-ink)]" style={{ fontWeight: 400 }}>Top territories</h2>
                <ul className="mt-4 divide-y divide-[color:var(--lens-sand)] list-none m-0 p-0">
                  {topTerritories.map(([market, amount]) => (
                    <li key={market} className="py-2.5 flex items-center justify-between gap-2">
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
  );
}
