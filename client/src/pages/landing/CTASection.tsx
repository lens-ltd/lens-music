import Button from '@/components/inputs/Button';
import { reveal } from './landingShared';

export default function CTASection() {
  return (
    <section
      className="relative isolate overflow-hidden bg-(--signal) py-24 text-white md:py-32"
      aria-labelledby="cta-heading"
    >
      {/* Photo: Eva Bronzini, Pexels (pexels.com/photo/7605490), tinted with a flat brand-blue layer. */}
      <img
        src="/images/vinyl-blue.jpg"
        alt=""
        loading="lazy"
        className="absolute inset-0 -z-20 size-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-(--signal)/65" aria-hidden="true" />
      <div
        className="app-container flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between"
        {...reveal(0)}
      >
        <div>
          <h2 id="cta-heading" className="type-h2 max-w-[18ch]">
            Release your next track for free.
          </h2>
          <p className="mt-3 type-body-lg text-white">
            Create an account and start your first release.
          </p>
        </div>
        <Button
          route="/auth/signup"
          primary
          size="lg"
          className="bg-white text-(--signal) hover:bg-white/90"
        >
          Create free account
        </Button>
      </div>
    </section>
  );
}
