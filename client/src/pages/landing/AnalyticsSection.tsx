import DashboardChart from '@/components/graphs/DashboardChart';
import FadeSection from './FadeSection';
import { CheckIcon, fadeUp, sampleChartData, SectionLabel } from './landingShared';

const bullets = [
  'Revenue trend tracking by month',
  'Platform and territory breakdowns',
  'Pending payout visibility',
  'Release-level performance review',
];

export default function AnalyticsSection() {
  return (
    <FadeSection id="analytics" labelledBy="analytics-heading" className="py-24 bg-white">
      {({ inView }) => (
        <article className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[0.95fr_1.05fr] gap-12 items-center">
          <header style={fadeUp(inView)}>
            <SectionLabel>Revenue analytics</SectionLabel>
            <h2
              id="analytics-heading"
              className="mt-4 text-[clamp(28px,4vw,42px)] leading-tight tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              See where revenue comes from, not just how much arrived.
            </h2>
            <p className="mt-4 text-[13px] leading-7 text-[color:var(--lens-ink)]/60 font-normal">
              Lens surfaces the platform and territory context behind every reporting cycle so you can compare release performance and plan your next launch with better data.
            </p>
            <ul className="mt-6 space-y-3 list-none p-0 m-0">
              {bullets.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[13px] text-[color:var(--lens-ink)] font-normal">
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </header>

          <figure className="rounded-2xl border border-[color:var(--lens-sand)] p-5 h-[320px]" style={fadeUp(inView, 0.12)} aria-label="Revenue trend preview">
            <figcaption className="text-[12px] text-[color:var(--lens-ink)]/60 mb-3 font-normal">Sample monthly earnings trend</figcaption>
            <DashboardChart
              data={sampleChartData}
              dataKey="month"
              height="90%"
              areaFillMode="none"
              showGrid
              showYAxis
              tooltipVariant="minimal"
              fill="rgb(31,98,142)"
            />
          </figure>
        </article>
      )}
    </FadeSection>
  );
}
