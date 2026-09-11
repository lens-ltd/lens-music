import Button from '@/components/inputs/Button';
import FadeSection from './FadeSection';
import { fadeUp } from './landingShared';

export default function CTASection() {
  return (
    <FadeSection id="cta" labelledBy="cta-heading" className="invert-surface py-16 md:py-20">
      {({ inView }) => (
        <article className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <section className="text-center" style={fadeUp(inView)}>
            <p className="type-eyebrow text-[#a9c1cf]">Start now</p>
            <h2 id="cta-heading" className="mt-4 type-h2 max-w-[22ch] mx-auto">
              Launch your next release with distribution and revenue reporting in one place.
            </h2>
            <p className="mt-4 max-w-2xl mx-auto type-body text-(--muted)">
              Create your Lens account to distribute to 150+ stores and monitor earnings with a clear analytics dashboard.
            </p>
            <menu className="mt-7 flex flex-wrap justify-center gap-3 p-0 m-0">
              <Button route="/auth/signup" primary>
                Create account
              </Button>
              <Button route="/auth/login">Sign in</Button>
            </menu>
          </section>
        </article>
      )}
    </FadeSection>
  );
}
