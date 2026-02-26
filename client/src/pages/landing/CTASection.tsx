import Button from '@/components/inputs/Button';
import FadeSection from './FadeSection';
import { fadeUp } from './landingShared';

export default function CTASection() {
  return (
    <FadeSection id="cta" labelledBy="cta-heading" className="py-20 bg-[color:var(--lens-ink)] text-white">
      {({ inView }) => (
        <article className="max-w-5xl mx-auto px-6">
          <section className="rounded-2xl border border-white/15 bg-black/25 p-8 md:p-10 text-center relative overflow-hidden" style={fadeUp(inView)}>
            <span className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary" aria-hidden="true" />
            <span className="absolute -left-5 bottom-8 h-14 w-14 rounded-full border border-white/20" aria-hidden="true" />
            <header className="relative z-10">
              <span className="editorial-chip">Start now</span>
              <h2
                id="cta-heading"
                className="mt-4 text-[clamp(30px,4vw,46px)] leading-tight tracking-[-0.02em] text-white"
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
              >
                Launch your next release with distribution and revenue reporting in one place.
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-[13px] leading-7 text-white/70 font-normal">
                Create your Lens account to distribute to 150+ stores and monitor earnings with a clear analytics dashboard.
              </p>
              <menu className="mt-7 flex flex-wrap justify-center gap-3 p-0 m-0">
                <Button route="/auth/login" primary className="px-6 py-2.5 text-[12px] tracking-[0.04em] font-normal">
                  Start uploading
                </Button>
              </menu>
            </header>
          </section>
        </article>
      )}
    </FadeSection>
  );
}
