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
    <FadeSection id="faq" labelledBy="faq-heading" className="section-rhythm bg-(--paper)">
      {({ inView }) => (
        <article className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-10">
          <header className="max-w-2xl" style={fadeUp(inView)}>
            <SectionLabel>FAQ</SectionLabel>
            <h2 id="faq-heading" className="mt-4 type-h2">
              Questions artists ask before they switch.
            </h2>
          </header>

          <section className="mt-8 space-y-3" aria-label="Frequently asked questions">
            {faqs.map(([question, answer], index) => (
              <details key={question} className="card-framed px-4" style={fadeUp(inView, 0.04 * index)}>
                <summary className="list-none cursor-pointer py-4 flex items-center justify-between gap-4">
                  <span className="type-body-sm">{question}</span>
                  <span className="faq-plus text-[18px] leading-none text-(--slate)" aria-hidden="true">+</span>
                </summary>
                <p className="pb-4 type-body-sm text-(--slate)">{answer}</p>
              </details>
            ))}
          </section>
        </article>
      )}
    </FadeSection>
  );
}
