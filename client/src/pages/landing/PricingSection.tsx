import FadeSection from './FadeSection';
import { CheckIcon, fadeUp, SectionLabel } from './landingShared';

const included = [
  'Distribute to 150+ stores',
  'Revenue analytics dashboard',
  'Payout visibility and reporting',
  'Catalog and release management tools',
];

export default function PricingSection() {
  return (
    <FadeSection id="pricing" labelledBy="pricing-heading" className="py-24 bg-[color:var(--lens-sand)]/20">
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
              Lens does not charge an upfront distribution fee. The platform takes a 15% share of earnings generated through Lens.
            </p>
          </header>

          <section className="mt-8 grid md:grid-cols-[1.1fr_0.9fr] gap-4" aria-label="Pricing breakdown">
            <article className="rounded-2xl border border-[color:var(--lens-sand)] bg-white p-7" style={fadeUp(inView, 0.05)}>
              <p className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--lens-blue)] font-normal">Lens distribution</p>
              <p className="mt-4 text-[40px] leading-none" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>$0</p>
              <p className="mt-2 text-[12px] text-[color:var(--lens-ink)]/60 font-normal">Upfront distribution cost</p>
              <ul className="mt-6 space-y-3 list-none p-0 m-0">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[12px] font-normal">
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-[color:var(--lens-sand)] bg-white p-7" style={fadeUp(inView, 0.1)}>
              <h3 className="text-[14px] text-[color:var(--lens-ink)]" style={{ fontWeight: 400 }}>Revenue share</h3>
              <p className="mt-4 text-[34px] leading-none" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>15%</p>
              <p className="mt-2 text-[12px] text-[color:var(--lens-ink)]/60 font-normal">Applied to earnings generated through Lens.</p>
              <section className="mt-6 border-t border-[color:var(--lens-sand)] pt-5">
                <p className="text-[12px] text-[color:var(--lens-ink)]/65 font-normal leading-6">
                  Example: if a release earns $100 through Lens, the artist payout is $85 and Lens retains $15.
                </p>
              </section>
            </article>
          </section>
        </article>
      )}
    </FadeSection>
  );
}
