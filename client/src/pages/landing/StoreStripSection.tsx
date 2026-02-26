import { StoreIcon } from './landingShared';

const stores = [
  'Spotify',
  'Apple Music',
  'Deezer',
  'Tidal',
  'YouTube Music',
  'Audiomack',
  'Amazon Music',
];

export default function StoreStripSection() {
  return (
    <section className="border-y border-[color:var(--lens-sand)] bg-[color:var(--lens-sand)]/20 py-6" aria-label="Supported music platforms">
      <article className="max-w-6xl mx-auto px-6">
        <p className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--lens-ink)]/45 mb-4 font-normal">
          Distributed to 150+ stores worldwide
        </p>
        <section className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-6" aria-label="Store list">
          {stores.map((store) => (
            <StoreIcon key={store} name={store} />
          ))}
        </section>
      </article>
    </section>
  );
}
