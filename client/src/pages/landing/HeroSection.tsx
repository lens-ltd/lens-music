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
    <section id="hero" className="pt-26 pb-12 md:pb-16 bg-(--paper)" aria-labelledby="hero-heading">
      <article className="app-container grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-start">
        <header className="space-y-6">
          <SectionLabel>Free music distribution</SectionLabel>
          <h1 id="hero-heading" className="type-display text-(--ink) max-w-[16ch]">
            Release your music widely.{' '}
            <span className="mark-accent">Understand what it earns.</span>
          </h1>
          <p className="type-body max-w-[46ch] text-(--slate)">
            Lens Music helps independent artists and labels distribute to 150+ stores, then track
            revenue and performance in one clear workspace. Distribution is free. Lens takes 15%
            only when you earn.
          </p>

          <menu className="flex flex-wrap items-center gap-3 p-0 my-4">
            <Button route="/auth/signup" primary>
              <FontAwesomeIcon icon={faRocket} />
              Create account
            </Button>
            <Button route="/auth/login">Sign in</Button>
          </menu>

          <p className="type-meta">No annual upload fee. Revenue analytics included.</p>

          <section ref={heroStats.ref} className="grid sm:grid-cols-3 gap-3 pt-4" aria-label="Platform summary">
            {[
              { label: 'Stores connected', value: `${countStores}+` },
              { label: 'Artists and labels', value: `${countArtists.toLocaleString()}+` },
              { label: 'Countries reached', value: `${countCountries}+` },
            ].map((stat) => (
              <article key={stat.label} className="card-framed p-4">
                <p className="type-eyebrow">{stat.label}</p>
                <p className="mt-2 type-metric">{stat.value}</p>
              </article>
            ))}
          </section>
        </header>

        <figure className="card-framed overflow-hidden" aria-label="Revenue statement preview">
          <header className="px-5 py-4 border-b border-(--line) flex items-center justify-between gap-3">
            <section>
              <p className="type-eyebrow">Revenue statement</p>
              <p className="mt-1 type-meta">February payout cycle</p>
            </section>
            <p className="px-3 py-1 rounded-(--radius-pill) border border-(--line) type-meta">
              Catalog preview
            </p>
          </header>

          <section className="p-5 grid grid-cols-2 gap-3 border-b border-(--line)">
            {metrics.map(([label, value]) => (
              <article key={label} className="card-quiet p-4">
                <p className="type-eyebrow">{label}</p>
                <p className="mt-2 type-h3 tabular">{value}</p>
              </article>
            ))}
          </section>

          <section className="p-5 grid gap-4">
            <figure className="card-framed p-4 h-52" aria-label="Monthly revenue trend">
              <figcaption className="type-meta mb-2">Revenue trend (last 7 months)</figcaption>
              <DashboardChart
                data={sampleChartData}
                dataKey="month"
                height="88%"
                areaFillMode="solid"
                areaOpacity={0.08}
                tooltipVariant="minimal"
                showGrid
                fill="var(--lens-blue)"
              />
            </figure>

            <section className="grid sm:grid-cols-2 gap-4">
              <article className="card-framed p-4">
                <h2 className="type-label">Platform revenue split</h2>
                <ul className="mt-4 space-y-3 list-none m-0 p-0">
                  {platformSplit.map(([name, width]) => (
                    <li key={name} className="grid grid-cols-[92px_1fr_38px] items-center gap-3">
                      <span className="type-meta">{name}</span>
                      <span className="h-2 rounded-(--radius-pill) bg-(--surface) overflow-hidden">
                        <span className="block h-full bg-(--lens-blue)" style={{ width: `${width}%` }} aria-hidden="true" />
                      </span>
                      <span className="type-body-sm text-right tabular">{width}%</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="card-framed p-4">
                <h2 className="type-label">Top territories</h2>
                <ul className="mt-4 divide-y divide-(--line) list-none m-0 p-0">
                  {topTerritories.map(([market, amount]) => (
                    <li key={market} className="py-2.5 flex items-center justify-between gap-2">
                      <span className="type-meta">{market}</span>
                      <span className="type-body-sm tabular">{amount}</span>
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
