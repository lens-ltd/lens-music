import FadeSection from './FadeSection';
import { fadeUp, SectionLabel } from './landingShared';

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
    <FadeSection id="features" labelledBy="features-heading" className="section-rhythm bg-(--paper)">
      {({ inView }) => (
        <article className="app-container grid lg:grid-cols-[1fr_1fr] gap-12 items-start">
          <header style={fadeUp(inView)}>
            <SectionLabel>Built around your needs</SectionLabel>
            <h2 id="features-heading" className="mt-4 type-h2">
              Distribution tools with reporting that stays readable.
            </h2>
            <p className="mt-4 type-body text-(--slate) max-w-[46ch]">
              Lens is designed for artists, managers, labels, and small teams that need reliable delivery plus practical revenue visibility.
            </p>
          </header>

          <section className="grid sm:grid-cols-2 gap-4" aria-label="Feature list">
            {features.map(([title, text], index) => (
              <article
                key={title}
                className="card-framed p-5"
                style={fadeUp(inView, 0.05 * index)}
              >
                <h3 className="type-label">{title}</h3>
                <p className="mt-3 type-body-sm text-(--slate)">{text}</p>
              </article>
            ))}
          </section>
        </article>
      )}
    </FadeSection>
  );
}
