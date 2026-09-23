import { LuPlus } from 'react-icons/lu';
import { landingSectionClassName, reveal } from './landingShared';

const faqs = [
  [
    'Does it cost anything to release music?',
    'No. There is no upload fee and no yearly fee. Lens takes a 15% share of the earnings your releases generate through the platform.',
  ],
  [
    'Which stores will my music reach?',
    'More than 150 stores and streaming services, including Spotify, Apple Music, YouTube Music, Tidal, Deezer and Audiomack.',
  ],
  [
    'How do I see what I earn?',
    'Your dashboard shows earnings by store, country and month, with each payout from pending to paid.',
  ],
  [
    'Can a label manage several artists?',
    'Yes. One account can hold releases for several artists, each with their own catalog and contributors.',
  ],
  [
    'Do I need ISRC or UPC codes before I start?',
    'No. Codes are handled as part of the release process.',
  ],
] as const;

export default function FAQSection() {
  return (
    <section id="faq" className={`${landingSectionClassName} bg-(--canvas)`} aria-labelledby="faq-heading">
      <div className="app-container grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <h2 id="faq-heading" className="type-h2" {...reveal(0)}>
          Questions
        </h2>

        <div className="divide-y divide-(--line-soft)">
          {faqs.map(([question, answer]) => (
            <details key={question} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                <span className="type-body-lg font-medium">{question}</span>
                <LuPlus
                  className="size-5 shrink-0 text-(--muted) transition-transform duration-(--dur-state) group-open:rotate-45"
                  aria-hidden="true"
                />
              </summary>
              <p className="max-w-[60ch] pb-6 type-body-lg text-(--muted)">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
