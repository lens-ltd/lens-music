import Button from '@/components/inputs/Button';

export default function CTASection() {
  return (
    <section className="bg-(--signal) py-20 text-white md:py-24" aria-labelledby="cta-heading">
      <div className="app-container flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 id="cta-heading" className="type-h2 max-w-[18ch]">
            Release your next track for free.
          </h2>
          <p className="mt-3 type-body text-white/80">
            Create an account and start your first release.
          </p>
        </div>
        <Button
          route="/auth/signup"
          primary
          className="h-12 bg-white px-6 text-base text-(--signal) hover:bg-white/90"
        >
          Create free account
        </Button>
      </div>
    </section>
  );
}
