import { LuCheck } from 'react-icons/lu';
import DashboardChart from '@/components/graphs/DashboardChart';
import { landingSectionClassName, reveal, sampleChartData } from './landingShared';

const included = [
  'Earnings by store, country and month',
  'Payouts you can follow from pending to paid',
  'ISRC and UPC codes handled during release',
  'Several artists managed from one account',
  'Release status for your whole catalog',
];

export default function WhatYouGetSection() {
  return (
    <section
      id="what-you-get"
      className={`${landingSectionClassName} bg-(--canvas)`}
      aria-labelledby="what-you-get-heading"
    >
      <div className="app-container grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <h2 id="what-you-get-heading" className="type-h2 max-w-[18ch]" {...reveal(0)}>
            Know where every payment comes from.
          </h2>
          <p className="mt-4 max-w-[46ch] type-body text-(--muted)" {...reveal(1)}>
            Store reports arrive in different formats and currencies. Lens turns
            them into one statement you can read in a minute.
          </p>

          <ul className="mt-10 flex list-none flex-col gap-4 p-0" role="list">
            {included.map((item, index) => (
              <li key={item} className="flex items-start gap-3 type-body" {...reveal(index + 2)}>
                <LuCheck className="mt-0.5 size-5 shrink-0 text-(--signal)" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <figure
          className="rounded-(--radius-card) bg-(--paper) p-6 sm:p-8"
          {...reveal(2)}
          aria-label="Example payout statement"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="type-meta">February statement</p>
              <p className="mt-2 type-price tabular">$2,055</p>
            </div>
            <span className="inline-flex h-6 items-center rounded-(--radius-pill) bg-(--success-soft) px-2.5 text-xs font-medium text-(--success)">
              Paid
            </span>
          </div>

          <div className="-mx-2 mt-6">
            <DashboardChart data={sampleChartData} dataKey="month" height={180} showGrid />
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <dt className="type-meta">Top store</dt>
              <dd className="mt-1 text-sm font-medium">Spotify</dd>
            </div>
            <div>
              <dt className="type-meta">Since January</dt>
              <dd className="mt-1 text-sm font-medium text-(--signal) tabular">+11.7%</dd>
            </div>
          </dl>
        </figure>
      </div>
    </section>
  );
}
