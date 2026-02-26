import FadeSection from './FadeSection';
import { fadeUp, SectionLabel } from './landingShared';

const faqs = [
  [
    'Is Lens Music free to use?',
    'Lens does not charge an upfront distribution fee. Lens earns through a 15% revenue share on earnings generated through the platform.',
  ],
  ['How many stores can I distribute to?', 'Lens supports delivery to 150+ stores and services, including major streaming platforms.'],
  ['Do I get revenue analytics?', 'Yes. Lens includes revenue reporting and performance views so you can review trends by platform and territory.'],
  ['Can labels use Lens?', 'Yes. Lens is designed for independent artists and labels, with catalog and release management support.'],
] as const;

export default function FAQSection() {
  return (
    <FadeSection id="faq" labelledBy="faq-heading" className="py-24 bg-white">
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

          <section className="mt-8 space-y-3" aria-label="Frequently asked questions">
            {faqs.map(([question, answer], index) => (
              <details key={question} className="rounded-xl border border-[color:var(--lens-sand)] px-4" style={fadeUp(inView, 0.04 * index)}>
                <summary className="list-none cursor-pointer py-4 flex items-center justify-between gap-4">
                  <span className="text-[13px] text-[color:var(--lens-ink)] font-normal">{question}</span>
                  <span className="faq-plus text-[18px] leading-none text-[color:var(--lens-blue)]" aria-hidden="true">+</span>
                </summary>
                <p className="pb-4 text-[12px] leading-6 text-[color:var(--lens-ink)]/60 font-normal">{answer}</p>
              </details>
            ))}
          </section>
        </article>
      )}
    </FadeSection>
  );
}
