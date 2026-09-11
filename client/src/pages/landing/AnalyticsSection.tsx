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
    <FadeSection id="analytics" labelledBy="analytics-heading" className="section-rhythm bg-(--paper)">
      {({ inView }) => (
        <article className="app-container grid lg:grid-cols-[0.95fr_1.05fr] gap-12 items-center">
          <header style={fadeUp(inView)}>
            <SectionLabel>Revenue analytics</SectionLabel>
            <h2 id="analytics-heading" className="mt-4 type-h2">
              See where revenue comes from, not just how much arrived.
            </h2>
            <p className="mt-4 type-body text-(--muted) max-w-[46ch]">
              Lens surfaces the platform and territory context behind every reporting cycle so you can compare release performance and plan your next launch with better data.
            </p>
            <ul className="mt-6 space-y-3 list-none p-0 m-0">
              {bullets.map((item) => (
                <li key={item} className="flex items-start gap-2.5 type-body-sm">
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </header>

          <figure className="card-framed p-5 h-[320px]" style={fadeUp(inView, 0.12)} aria-label="Revenue trend preview">
            <figcaption className="type-meta mb-3">Sample monthly earnings trend</figcaption>
            <DashboardChart
              data={sampleChartData}
              dataKey="month"
              height="90%"
              areaFillMode="solid"
              areaOpacity={0.08}
              showGrid
              showYAxis
              tooltipVariant="minimal"
              fill="var(--lens-blue)"
            />
          </figure>
        </article>
      )}
    </FadeSection>
  );
}
