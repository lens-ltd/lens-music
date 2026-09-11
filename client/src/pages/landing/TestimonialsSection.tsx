import FadeSection from './FadeSection';
import { fadeUp, SectionLabel } from './landingShared';

const testimonials = [
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
] as const;

export default function TestimonialsSection() {
  return (
    <FadeSection id="testimonials" labelledBy="testimonials-heading" className="section-rhythm bg-(--paper)">
      {({ inView }) => (
        <article className="app-container">
          <header className="max-w-2xl" style={fadeUp(inView)}>
            <SectionLabel>Artist voices</SectionLabel>
            <h2 id="testimonials-heading" className="mt-4 type-h2">
              What artists say after switching to a clearer workflow.
            </h2>
          </header>

          <section className="mt-8 grid lg:grid-cols-2 card-framed overflow-hidden" style={fadeUp(inView, 0.08)}>
            <figure className="invert-surface p-8 md:p-10 min-h-[320px] flex flex-col justify-between">
              <figcaption>
                <p className="type-eyebrow">Featured quote</p>
                <p className="mt-4 type-h2 max-w-[16ch]">
                  “The revenue view finally makes sense to our team.”
                </p>
              </figcaption>
              <p className="type-meta mt-8">Artist story</p>
            </figure>

            <section className="bg-(--paper) p-6 md:p-8 grid gap-4" aria-label="Artist testimonials">
              {testimonials.map(([quote, name, role], index) => (
                <blockquote
                  key={name}
                  className="border-b last:border-b-0 border-(--line) pb-4 last:pb-0"
                  style={fadeUp(inView, 0.12 + 0.05 * index)}
                >
                  <p className="type-body-sm text-(--muted)">{quote}</p>
                  <footer className="mt-3">
                    <p className="type-label">{name}</p>
                    <p className="type-meta">{role}</p>
                  </footer>
                </blockquote>
              ))}
            </section>
          </section>
        </article>
      )}
    </FadeSection>
  );
}
