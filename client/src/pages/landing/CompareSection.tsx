import FadeSection from './FadeSection';
import { fadeUp, SectionLabel } from './landingShared';

const rows = [
  ['Upfront cost', 'Free', '$20 to $50/year'],
  ['Revenue share', '15% on earnings', 'Varies by plan'],
  ['Store reach', '150+ stores', 'Varies'],
  ['Revenue analytics', 'Included', 'Often limited by plan'],
  ['Label tools', 'Included', 'Often extra cost'],
  ['Codes (ISRC/UPC)', 'Handled in workflow', 'May require manual setup'],
] as const;

export default function CompareSection() {
  return (
    <FadeSection id="compare" labelledBy="compare-heading" className="py-24 bg-[color:var(--lens-sand)]/20">
      {({ inView }) => (
        <article className="max-w-4xl mx-auto px-6">
          <header className="mb-8" style={fadeUp(inView)}>
            <SectionLabel>Comparison</SectionLabel>
            <h2
              id="compare-heading"
              className="mt-4 text-[clamp(28px,4vw,40px)] leading-tight tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              A straightforward model for independent releases.
            </h2>
          </header>

          <figure className="overflow-hidden rounded-2xl border border-[color:var(--lens-sand)] bg-white" style={fadeUp(inView, 0.1)} aria-label="Feature comparison table">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[color:var(--lens-sand)]">
                  <th className="text-left px-5 py-4 text-[11px] uppercase tracking-[0.15em] text-[color:var(--lens-ink)]/55" style={{ fontWeight: 400 }}>Category</th>
                  <th className="text-left px-5 py-4 text-[11px] uppercase tracking-[0.15em] text-[color:var(--lens-blue)]" style={{ fontWeight: 400 }}>Lens Music</th>
                  <th className="text-left px-5 py-4 text-[11px] uppercase tracking-[0.15em] text-[color:var(--lens-ink)]/45" style={{ fontWeight: 400 }}>Typical distributor</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row[0]} className={i % 2 === 0 ? '' : 'bg-[color:var(--lens-sand)]/10'}>
                    <td className="px-5 py-4 text-[12px] text-[color:var(--lens-ink)] font-normal">{row[0]}</td>
                    <td className="px-5 py-4 text-[12px] text-[color:var(--lens-ink)] font-normal">{row[1]}</td>
                    <td className="px-5 py-4 text-[12px] text-[color:var(--lens-ink)]/60 font-normal">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </figure>
        </article>
      )}
    </FadeSection>
  );
}
