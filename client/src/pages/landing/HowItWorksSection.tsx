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
      <div className="app-container">
        <h2 id="how-it-works-heading" className="type-h2 max-w-[20ch]">
          From upload to payout in three steps.
        </h2>

        <ol className="mt-14 grid list-none gap-12 p-0 md:grid-cols-3 md:gap-10" role="list">
          {steps.map(({ title, text }, index) => (
            <li key={title}>
              <span className="block text-5xl font-medium leading-none text-(--signal) tabular">
                {index + 1}
              </span>
              <h3 className="mt-6 type-h3">{title}</h3>
              <p className="mt-2 max-w-[34ch] type-body text-(--muted)">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
