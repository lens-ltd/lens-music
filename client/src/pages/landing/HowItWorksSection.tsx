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
    <FadeSection id="how-it-works" labelledBy="how-it-works-heading" className="py-24 bg-white">
      {({ inView }) => (
        <article className="max-w-6xl mx-auto px-6">
          <header className="max-w-2xl" style={fadeUp(inView)}>
            <SectionLabel>How it works</SectionLabel>
            <h2
              id="how-it-works-heading"
              className="mt-4 text-[clamp(28px,4vw,44px)] leading-tight tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              A clear release workflow from upload to payout.
            </h2>
            <p className="mt-4 text-[13px] leading-7 text-[color:var(--lens-ink)]/60 font-normal">
              Lens keeps the release process simple and gives you the revenue reporting needed to make decisions after launch.
            </p>
          </header>

          <ol className="mt-10 grid md:grid-cols-3 gap-4 list-none p-0 m-0">
            {steps.map((item, index) => (
              <li key={item.step} style={fadeUp(inView, 0.08 * index)}>
                <article className="h-full rounded-2xl border border-[color:var(--lens-sand)] p-6">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--lens-blue)] font-normal">{item.step}</p>
                  <h3 className="mt-4 text-[18px] leading-snug text-[color:var(--lens-ink)]" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400 }}>
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[12px] leading-6 text-[color:var(--lens-ink)]/60 font-normal">{item.text}</p>
                </article>
              </li>
            ))}
          </ol>
        </article>
      )}
    </FadeSection>
  );
}
