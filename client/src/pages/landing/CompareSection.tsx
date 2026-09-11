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
    <FadeSection id="compare" labelledBy="compare-heading" className="section-rhythm bg-(--paper)">
      {({ inView }) => (
        <article className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-10">
          <header className="mb-8" style={fadeUp(inView)}>
            <SectionLabel>Comparison</SectionLabel>
            <h2 id="compare-heading" className="mt-4 type-h2">
              A straightforward model for independent releases.
            </h2>
          </header>

          <figure className="overflow-hidden card-framed" style={fadeUp(inView, 0.1)} aria-label="Feature comparison table">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-(--line)">
                  <th className="text-left px-5 py-4 type-eyebrow">Category</th>
                  <th className="text-left px-5 py-4 type-eyebrow text-(--ink)">Lens Music</th>
                  <th className="text-left px-5 py-4 type-eyebrow">Typical distributor</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row[0]} className={i % 2 === 0 ? '' : 'bg-(--surface-sunken)'}>
                    <td className="px-5 py-4 type-body-sm">{row[0]}</td>
                    <td className="px-5 py-4 type-body-sm">{row[1]}</td>
                    <td className="px-5 py-4 type-body-sm text-(--slate)">{row[2]}</td>
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
