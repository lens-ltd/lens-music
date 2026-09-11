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
    <FadeSection id="pricing" labelledBy="pricing-heading" className="section-rhythm bg-(--paper)">
      {({ inView }) => (
        <article className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <header className="max-w-2xl" style={fadeUp(inView)}>
            <SectionLabel>Pricing</SectionLabel>
            <h2 id="pricing-heading" className="mt-4 type-h2">
              Free to distribute. Revenue share only when earnings arrive.
            </h2>
            <p className="mt-4 type-body text-(--slate) max-w-[46ch]">
              Lens does not charge an upfront distribution fee. The platform takes a 15% share of earnings generated through Lens.
            </p>
          </header>

          <section className="mt-8 grid md:grid-cols-[1.1fr_0.9fr] gap-4" aria-label="Pricing breakdown">
            <article className="card-framed p-7" style={fadeUp(inView, 0.05)}>
              <p className="type-eyebrow">Lens distribution</p>
              <p className="mt-4 type-price">$0</p>
              <p className="mt-2 type-meta">Upfront distribution cost</p>
              <ul className="mt-6 space-y-3 list-none p-0 m-0">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 type-body-sm">
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="card-framed p-7" style={fadeUp(inView, 0.1)}>
              <h3 className="type-label">Revenue share</h3>
              <p className="mt-4 type-price">15%</p>
              <p className="mt-2 type-meta">Applied to earnings generated through Lens.</p>
              <section className="mt-6 border-t border-(--line) pt-5">
                <p className="type-body-sm text-(--slate)">
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
