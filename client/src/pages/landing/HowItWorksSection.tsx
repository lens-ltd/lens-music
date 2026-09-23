import { landingSectionClassName } from './landingShared';

const steps = [
  {
    title: 'Upload your release',
    text: 'Add audio, cover art, credits and release details in one guided form.',
  },
  {
    title: 'Lens delivers it',
    text: 'Your release goes out to 150+ streaming and download stores at once.',
  },
  {
    title: 'Track what it earns',
    text: 'See earnings by store, country and month, and follow every payout.',
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className={landingSectionClassName}
      aria-labelledby="how-it-works-heading"
    >
      <div className="app-container grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
        {/* Photo: Miguel Á. Padriñán, Pexels (pexels.com/photo/3391930) */}
        <img
          src="/images/vinyl-black.jpg"
          alt=""
          loading="lazy"
          className="aspect-[4/5] w-full rounded-(--radius-card) object-cover object-[70%_center] max-lg:aspect-[16/9]"
        />

        <div>
          <h2 id="how-it-works-heading" className="type-h2 max-w-[20ch]">
            From upload to payout in three steps.
          </h2>

          <ol className="mt-12 flex list-none flex-col gap-10 p-0" role="list">
            {steps.map(({ title, text }, index) => (
              <li key={title} className="grid grid-cols-[48px_1fr] gap-4">
                <span className="text-4xl font-medium leading-none text-(--signal) tabular">
                  {index + 1}
                </span>
                <div>
                  <h3 className="type-h3">{title}</h3>
                  <p className="mt-2 max-w-[40ch] type-body text-(--muted)">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
