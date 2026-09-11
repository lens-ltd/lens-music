import Button from '@/components/inputs/Button';
import DashboardChart from '@/components/graphs/DashboardChart';
import { sampleChartData, SectionLabel } from './landingShared';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section id="hero" className="bg-white pt-20 pb-16 md:pt-28 md:pb-24" aria-labelledby="hero-heading">
      <article className="app-container grid items-center gap-12 lg:grid-cols-[1fr_400px]">
        <header className="max-w-[52ch]">
          <SectionLabel>Free music distribution</SectionLabel>
          <h1 id="hero-heading" className="mt-4 type-display text-(--ink)">
            Release everywhere. Know what it earns.
          </h1>
          <p className="mt-5 type-body max-w-[44ch] text-(--slate)">
            Lens Music distributes your releases to 150+ stores and turns the
            reporting mess into one readable payout statement. Distribution is
            free — Lens takes 15% only when you earn.
          </p>

          <menu className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 p-0 m-0">
            <Button route="/auth/signup" primary>
              Create free account
            </Button>
            <Link
              to="/auth/login"
              className="link-sweep type-body-sm text-(--signal)"
            >
              Sign in
            </Link>
          </menu>

          <p className="mt-6 type-meta">
            No annual upload fee. Revenue analytics included.
          </p>
        </header>

        <figure className="card-framed overflow-hidden" aria-label="February payout statement preview">
          <header className="flex items-center justify-between gap-3 border-b border-(--line) px-5 py-4">
            <section>
              <p className="type-eyebrow">Revenue statement</p>
              <p className="mt-1 type-meta">February payout cycle</p>
            </section>
            <p className="rounded-(--radius-pill) border border-(--approve-line) bg-(--approve-surface) px-3 py-1 type-meta text-(--approve-strong)">
              Settled
            </p>
          </header>

          <section className="px-5 pt-5">
            <p className="type-display tabular text-(--ink)">$2,055</p>
            <p className="mt-1 type-meta">Paid out across 150+ stores</p>
          </section>

          <section className="px-2 pb-2 pt-3">
            <DashboardChart
              data={sampleChartData}
              dataKey="month"
              height={180}
              showGrid
            />
          </section>

          <footer className="flex items-center justify-between gap-3 border-t border-(--line) px-5 py-3">
            <p className="type-meta">Top platform · Spotify</p>
            <p className="type-body-sm tabular text-(--signal)">+11.7%</p>
          </footer>
        </figure>
      </article>
    </section>
  );
}
