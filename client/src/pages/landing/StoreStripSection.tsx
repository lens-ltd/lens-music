import { StoreIcon } from './landingShared';

const stores = [
  'Spotify',
  'Apple Music',
  'Deezer',
  'Tidal',
  'YouTube Music',
  'Audiomack',
];

export default function StoreStripSection() {
  return (
    <section className="border-y border-(--line) bg-(--paper) py-6" aria-label="Supported music platforms">
      <article className="app-container">
        <p className="type-eyebrow mb-4">Distributed to 150+ stores worldwide</p>
        <section className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6" aria-label="Store list">
          {stores.map((store) => (
            <StoreIcon key={store} name={store} />
          ))}
        </section>
      </article>
    </section>
  );
}
