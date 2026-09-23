import { landingSectionClassName, reveal } from './landingShared';

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className={landingSectionClassName}
      aria-labelledby="pricing-heading"
    >
      <div className="app-container">
        <h2 id="pricing-heading" className="type-h2" {...reveal(0)}>
          Free to release. You keep 85%.
        </h2>
        <p className="mt-4 max-w-[52ch] type-body-lg text-(--muted)">
          No upload fee and no yearly fee. Lens takes a 15% share of what your
          music earns through the platform, and nothing before that.
        </p>

        <figure className="mt-14" aria-label="What happens to $100 of earnings">
          <p className="type-meta">When a release earns $100</p>
          <div
            className="mt-4 flex h-16 overflow-hidden rounded-(--radius-card)"
            role="img"
            aria-label="$85 goes to you, $15 goes to Lens"
          >
            <div className="flex w-[85%] items-center bg-(--ink) px-5 text-white">
              <span className="text-lg font-medium tabular">$85</span>
            </div>
            <div className="flex w-[15%] items-center justify-center bg-(--signal) text-white">
              <span className="text-lg font-medium tabular">$15</span>
            </div>
          </div>
          <figcaption className="mt-3 flex justify-between gap-4 text-sm">
            <span>Paid to you</span>
            <span className="text-(--signal)">Lens</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
