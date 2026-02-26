import FadeSection from './FadeSection';
import { fadeUp } from './landingShared';

const features = [
  ['Store delivery', 'Publish releases to 150+ stores from one workflow.'],
  ['Catalog tracking', 'Monitor release status and keep your catalog organized.'],
  ['Revenue analytics', 'View earnings by platform, territory, and reporting period.'],
  ['Payout visibility', 'Track pending balances and payout activity in one place.'],
  ['Label support', 'Manage multiple artists and release operations from one account.'],
  ['Codes included', 'ISRC and UPC handling stays inside the release process.'],
] as const;

export default function FeaturesSection() {
  return (
    <FadeSection id="features" labelledBy="features-heading" className="py-24 bg-[color:var(--lens-ink)] text-white">
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
              Lens is designed for artists, managers, labels, and small teams that need reliable delivery plus practical revenue visibility.
            </p>
          </header>

          <section className="grid sm:grid-cols-2 gap-4" aria-label="Feature list">
            {features.map(([title, text], index) => (
              <article
                key={title}
                className="rounded-none border border-white/15 bg-[color:var(--lens-sand)] p-5 text-[color:var(--lens-ink)]"
                style={fadeUp(inView, 0.05 * index)}
              >
                <h3 className="text-[14px] text-[color:var(--lens-ink)]" style={{ fontWeight: 400 }}>{title}</h3>
                <p className="mt-3 text-[12px] leading-6 text-[color:var(--lens-ink)]/75 font-normal">{text}</p>
              </article>
            ))}
          </section>
        </article>
      )}
    </FadeSection>
  );
}
