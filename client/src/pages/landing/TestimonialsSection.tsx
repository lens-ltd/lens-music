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
    <FadeSection id="testimonials" labelledBy="testimonials-heading" className="py-24 bg-white">
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
                <p className="mt-4 text-[clamp(26px,4vw,38px)] leading-[1.02] tracking-[-0.03em]" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
                  “The revenue view finally makes sense to our team.”
                </p>
              </figcaption>
              <figure className="mt-8 h-36 w-36 rounded-full border border-white/25 bg-white/10 flex items-center justify-center" aria-label="Artist story badge">
                <figcaption className="text-[10px] uppercase tracking-[0.16em] text-white/80 font-normal">Artist story</figcaption>
              </figure>
            </figure>

            <section className="bg-white p-6 md:p-8 grid gap-4" aria-label="Artist testimonials">
              {testimonials.map(([quote, name, role], index) => (
                <blockquote
                  key={name}
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
            </section>
          </section>
        </article>
      )}
    </FadeSection>
  );
}
