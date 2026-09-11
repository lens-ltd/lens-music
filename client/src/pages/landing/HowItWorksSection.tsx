import FadeSection from './FadeSection';
import { fadeUp, SectionLabel } from './landingShared';

const steps = [
  {
    step: '01',
    title: 'Prepare your release',
    text: 'Add audio, cover art, metadata, and credits in one structured submission flow.',
  },
  {
    step: '02',
    title: 'Deliver to stores',
    text: 'Send your release to major streaming and download platforms from a single dashboard.',
  },
  {
    step: '03',
    title: 'Track earnings',
    text: 'Review platform and territory performance with revenue trends and payout summaries.',
  },
];

export default function HowItWorksSection() {
  return (
    <FadeSection id="how-it-works" labelledBy="how-it-works-heading" className="section-rhythm bg-(--paper)">
      {({ inView }) => (
        <article className="app-container">
          <header className="max-w-2xl" style={fadeUp(inView)}>
            <SectionLabel>How it works</SectionLabel>
            <h2 id="how-it-works-heading" className="mt-4 type-h2">
              A clear release workflow from upload to payout.
            </h2>
            <p className="mt-4 type-body text-(--muted) max-w-[46ch]">
              Lens keeps the release process simple and gives you the revenue reporting needed to make decisions after launch.
            </p>
          </header>

          <ol className="mt-10 grid md:grid-cols-3 gap-4 list-none p-0 m-0">
            {steps.map((item, index) => (
              <li key={item.step} style={fadeUp(inView, 0.08 * index)}>
                <article className="h-full card-framed p-6">
                  <p className="type-eyebrow tabular">{item.step}</p>
                  <h3 className="mt-4 type-h3">{item.title}</h3>
                  <p className="mt-3 type-body-sm text-(--muted)">{item.text}</p>
                </article>
              </li>
            ))}
          </ol>
        </article>
      )}
    </FadeSection>
  );
}
