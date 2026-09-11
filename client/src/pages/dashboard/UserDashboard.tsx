import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  IconDefinition,
  faArrowRight,
  faCalendarDays,
  faCheck,
  faCompactDisc,
  faMusic,
  faPaperPlane,
  faPlus,
  faRotateRight,
  faTowerBroadcast,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import UserLayout from '@/containers/UserLayout';
import DashboardSection from '@/pages/dashboard/components/DashboardSection';
import Button from '@/components/inputs/Button';
import { SkeletonLoader } from '@/components/inputs/Loader';
import { useGetDashboardSummaryQuery } from '@/state/api/apiQuerySlice';
import { setCreateReleaseModal } from '@/state/features/releaseSlice';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import {
  DashboardActionItem,
  DashboardRelease,
  DashboardSummary,
} from '@/types/models/dashboard.types';
import { ReleaseStatus } from '@/types/models/release.types';
import { ReleaseDeliveryStatus } from '@/types/models/releaseStore.types';
import { formatDate, formatNumbers } from '@/utils/strings.helper';

const serif = { fontFamily: 'var(--font-serif)', fontWeight: 700 } as const;

const releaseStatusMeta: Record<
  ReleaseStatus,
  { label: string }
> = {
  [ReleaseStatus.DRAFT]: { label: 'Draft' },
  [ReleaseStatus.VALIDATED]: { label: 'Validated' },
  [ReleaseStatus.REVIEW]: { label: 'In review' },
  [ReleaseStatus.APPROVED]: { label: 'Approved' },
  [ReleaseStatus.DELIVERED]: { label: 'Delivered' },
  [ReleaseStatus.LIVE]: { label: 'Live' },
  [ReleaseStatus.TAKENDOWN]: { label: 'Taken down' },
};

const deliveryStatusMeta: Record<
  ReleaseDeliveryStatus,
  { label: string }
> = {
  [ReleaseDeliveryStatus.PENDING]: { label: 'Pending' },
  [ReleaseDeliveryStatus.IN_PROGRESS]: { label: 'In progress' },
  [ReleaseDeliveryStatus.DELIVERED]: { label: 'Delivered' },
  [ReleaseDeliveryStatus.FAILED]: { label: 'Failed' },
};

const UserDashboard = () => {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetDashboardSummaryQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });

  return (
    <UserLayout variant="canvas">
      <div className="flex w-full min-w-0 flex-col gap-6">
        {isLoading ? <DashboardSkeleton /> : null}
        {!isLoading && isError ? (
          <DashboardError onRetry={refetch} isRetrying={isFetching} />
        ) : null}
        {!isLoading && !isError && data?.data ? (
          <DashboardContent summary={data.data} isRefreshing={isFetching} />
        ) : null}
      </div>
    </UserLayout>
  );
};

const DashboardContent = ({
  summary,
  isRefreshing,
}: {
  summary: DashboardSummary;
  isRefreshing: boolean;
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const userName = useAppSelector((state) => state.auth.user?.name);

  const createRelease = () => {
    dispatch(setCreateReleaseModal(true));
    navigate('/releases');
  };

  if (summary.totals.releases === 0) {
    return <DashboardEmptyState onCreateRelease={createRelease} />;
  }

  return (
    <motion.div
      className="flex flex-col gap-6"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <header className="flex flex-col gap-5 border-b border-(--line) pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="type-eyebrow">
            Catalog
          </p>
          <h1
            className="mt-2 type-page-title text-(--ink)"
          >
            {userName ? `${userName.split(' ')[0]}’s dashboard` : 'Dashboard'}
          </h1>
          <p className="mt-2 max-w-xl type-body-sm text-(--muted)">
            Follow every release from first draft to store delivery.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-2 type-meta">
            <span
              className={`h-1.5 w-1.5 rounded-full bg-(--lens-blue) ${isRefreshing ? 'animate-pulse' : ''}`}
            />
            Updated {formatDate(new Date(summary.generatedAt))}
          </span>
          <Button primary icon={faPlus} onClick={createRelease}>
            Create release
          </Button>
        </div>
      </header>

      <TotalsStrip totals={summary.totals} />
      <ReleasePipeline pipeline={summary.releasePipeline} />

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)]">
        <RecentReleases releases={summary.recentReleases} />
        <ActionQueue items={summary.actionItems} />
      </section>

      <DeliveryHealth summary={summary} />
    </motion.div>
  );
};

const TotalsStrip = ({ totals }: { totals: DashboardSummary['totals'] }) => {
  const now = new Date();
  const inThirtyDays = new Date(now);
  inThirtyDays.setDate(now.getDate() + 30);
  const date = (value: Date) => value.toISOString().slice(0, 10);
  const metrics: {
    label: string;
    value: number;
    icon: IconDefinition;
    route?: string;
  }[] = [
    { label: 'Releases', value: totals.releases, icon: faCompactDisc, route: '/releases' },
    { label: 'Tracks', value: totals.tracks, icon: faMusic },
    { label: 'Live now', value: totals.liveReleases, icon: faTowerBroadcast, route: `/releases?status=${ReleaseStatus.LIVE}` },
    {
      label: 'Next 30 days',
      value: totals.upcomingReleases,
      icon: faCalendarDays,
      route: `/releases?digitalReleaseDateFrom=${date(now)}&digitalReleaseDateTo=${date(inThirtyDays)}`,
    },
  ];

  return (
    <section
      className="grid overflow-hidden card-framed sm:grid-cols-2 xl:grid-cols-4"
      aria-label="Catalog totals"
    >
      {metrics.map((metric, index) => {
        const content = (
          <>
            <span className="flex items-center justify-between gap-3">
              <span className="type-eyebrow">
                {metric.label}
              </span>
              <FontAwesomeIcon icon={metric.icon} className="text-(--muted)" aria-hidden="true" />
            </span>
            <strong className="mt-4 block type-metric text-(--ink)">
              {formatNumbers(metric.value)}
            </strong>
          </>
        );
        const className = `min-h-[112px] p-5 transition-colors hover:bg-(--surface) ${
          index > 0 ? 'border-t border-(--line) sm:border-t-0 sm:border-l' : ''
        } ${index === 2 ? 'sm:border-l-0 xl:border-l' : ''}`;
        return metric.route ? (
          <Link key={metric.label} to={metric.route} className={className}>
            {content}
          </Link>
        ) : (
          <div key={metric.label} className={className}>{content}</div>
        );
      })}
    </section>
  );
};

const ReleasePipeline = ({
  pipeline,
}: {
  pipeline: DashboardSummary['releasePipeline'];
}) => {
  const total = pipeline.reduce((sum, item) => sum + item.count, 0);

  return (
    <DashboardSection
      label="Pipeline"
      title="Release pipeline"
      subtitle={`${formatNumbers(total)} releases across your distribution journey`}
      variant="open"
    >
        <ol className="grid gap-px overflow-hidden rounded-(--radius-card) border border-(--line) bg-(--surface) sm:grid-cols-2 lg:grid-cols-7" aria-label="Release lifecycle counts">
          {pipeline.map((item) => {
            const meta = releaseStatusMeta[item.status];
            return (
              <li
                key={item.status}
                className="bg-(--paper)"
              >
                <Link
                  to={`/releases?status=${item.status}`}
                  className="group flex min-h-[98px] flex-row items-center justify-between gap-3 p-4 transition-colors hover:bg-(--surface) lg:flex-col lg:items-start"
                >
                  <span className="flex items-center gap-2">
                    <span className="h-px w-4 bg-(--lens-blue)" aria-hidden="true" />
                  <span className="type-meta">
                    {meta.label}
                  </span>
                </span>
                <strong
                  className="type-metric text-[1.5rem] text-(--ink) transition-colors group-hover:text-(--lens-blue)"
                >
                  {formatNumbers(item.count)}
                </strong>
                </Link>
              </li>
            );
          })}
        </ol>
    </DashboardSection>
  );
};

const DeliveryHealth = ({ summary }: { summary: DashboardSummary }) => {
  const { deliveryHealth } = summary;
  const delivered = deliveryHealth.byStatus.find(
    (item) => item.status === ReleaseDeliveryStatus.DELIVERED,
  )?.count ?? 0;
  return (
    <DashboardSection
      label="Store delivery"
      title="Delivery health"
      subtitle={`${formatNumbers(deliveryHealth.total)} store assignments across your catalog`}
      variant="open"
    >
      {deliveryHealth.total === 0 ? (
        <div className="rounded-(--radius-control) border border-dashed border-(--line) bg-(--surface) px-5 py-8 text-center">
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="text-(--muted)"
            aria-hidden="true"
          />
          <p className="mt-3 type-label text-(--ink)">
            No store deliveries yet
          </p>
          <p className="mx-auto mt-1 max-w-sm type-meta">
            Assign stores inside a release to start tracking delivery health here.
          </p>
        </div>
      ) : (
        <div className="grid items-center gap-7 sm:grid-cols-[150px_1fr]">
          <div className="card-quiet mx-auto flex h-[142px] w-[142px] flex-col items-center justify-center">
            <strong className="type-metric tabular">
              {deliveryHealth.deliveredRate}%
            </strong>
            <span className="mt-1 type-eyebrow">
              delivered
            </span>
          </div>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-4">
            {deliveryHealth.byStatus.map((item) => {
              const meta = deliveryStatusMeta[item.status];
              return (
                <li
                  key={item.status}
                  className="border-l-2 border-(--ink) pl-3"
                >
                  <strong
                    className="block type-card-title text-(--ink)"
                    style={serif}
                  >
                    {formatNumbers(item.count)}
                  </strong>
                  <span className="type-meta">
                    {meta.label}
                  </span>
                </li>
              );
            })}
          </ul>
          <span className="sr-only">
            {delivered} of {deliveryHealth.total} store assignments delivered
          </span>
        </div>
      )}
    </DashboardSection>
  );
};

const ActionQueue = ({ items }: { items: DashboardActionItem[] }) => (
  <DashboardSection label="Quality control" title="Needs attention">
    {items.length === 0 ? (
      <div className="flex min-h-[190px] flex-col items-center justify-center text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-(--lens-blue-soft) text-(--lens-blue)">
          <FontAwesomeIcon icon={faCheck} aria-hidden="true" />
        </span>
        <p className="mt-4 type-label text-(--ink)">
          Your queue is clear
        </p>
        <p className="mt-1 max-w-[230px] type-meta">
          No review changes or failed deliveries need action.
        </p>
      </div>
    ) : (
      <ul className="divide-y divide-(--line)">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              to={`/releases/${item.releaseId}/wizard`}
              className="group flex min-h-[74px] items-start gap-3 py-4"
            >
              <span
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  item.kind === 'DELIVERY_FAILED'
                    ? 'border border-[color:var(--lens-ink)]/25 bg-(--surface) text-(--ink)'
                    : 'bg-(--lens-blue-soft) text-(--lens-blue)'
                }`}
              >
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  className="text-[13px]"
                  aria-hidden="true"
                />
              </span>
              <span className="min-w-0 flex-1">
                <strong className="block truncate type-label text-(--ink)">
                  {item.releaseTitle}
                </strong>
                <span className="mt-1 line-clamp-2 block type-meta">
                  {item.message}
                </span>
              </span>
              <FontAwesomeIcon
                icon={faArrowRight}
                className="mt-2 shrink-0 text-(--ink)/25 transition-transform group-hover:translate-x-1 group-hover:text-(--lens-blue)"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    )}
  </DashboardSection>
);

const RecentReleases = ({ releases }: { releases: DashboardRelease[] }) => (
  <DashboardSection
    label="Latest movement"
    title="Recent releases"
    overflowHidden
    bodyClassName="p-0"
    action={
      <Button styled={false} route="/releases">
        View all
        <FontAwesomeIcon icon={faArrowRight} className="text-[11px]" aria-hidden="true" />
      </Button>
    }
  >
    {releases.length ? (
      <ul className="divide-y divide-(--line) border-t border-(--line)">
        {releases.map((release) => (
          <RecentReleaseRow key={release.id} release={release} />
        ))}
      </ul>
    ) : (
      <p className="border-t border-(--line) px-5 py-10 text-center type-body-sm text-(--muted)">
        No recent release activity yet.
      </p>
    )}
  </DashboardSection>
);

const RecentReleaseRow = ({ release }: { release: DashboardRelease }) => {
  const status = releaseStatusMeta[release.status];
  return (
    <li>
      <Link
        to={`/releases/${release.id}/wizard`}
        className="group grid min-h-[82px] grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 transition-colors hover:bg-(--surface) sm:px-5 lg:grid-cols-[52px_minmax(160px,1.3fr)_0.45fr_0.45fr_0.8fr_auto] lg:gap-5"
      >
        {release.coverArtUrl ? (
          <img
            src={release.coverArtUrl}
            alt=""
            className="h-12 w-12 rounded-md object-cover sm:h-[52px] sm:w-[52px]"
          />
        ) : (
          <span
            className="h-12 w-12 rounded-md bg-(--surface) sm:h-[52px] sm:w-[52px]"
            aria-label="No cover art"
            role="img"
          />
        )}
        <span className="min-w-0">
          <strong className="block truncate type-body-sm font-medium text-(--ink)">
            {release.title}
          </strong>
          <span className="mt-1 block type-meta capitalize">
            {release.type?.toLowerCase() ?? 'Release'}
          </span>
        </span>
        <span className="hidden lg:block">
          <span className="block type-body-sm text-(--ink)" style={serif}>
            {release.trackCount}
          </span>
          <span className="type-meta">
            tracks
          </span>
        </span>
        <span className="hidden lg:block">
          <span className="block type-body-sm text-(--ink)" style={serif}>
            {release.storeCount}
          </span>
          <span className="type-meta">
            stores
          </span>
        </span>
        <span className="hidden lg:block">
          <span className="block type-body-sm text-(--ink)">
            {release.digitalReleaseDate
              ? formatDate(release?.digitalReleaseDate, 'DD/MM/YYYY')
              : 'Not set'}
          </span>
          <span className="type-meta">
            release date
          </span>
        </span>
        <span className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-(--radius-pill) border border-(--line) px-2.5 py-1 type-meta text-(--ink)">
            <span className="h-px w-3 bg-(--lens-blue)" aria-hidden="true" />
            {status.label}
          </span>
          <FontAwesomeIcon
            icon={faArrowRight}
            className="hidden text-(--ink)/25 transition-transform group-hover:translate-x-1 group-hover:text-(--lens-blue) md:block"
            aria-hidden="true"
          />
        </span>
      </Link>
    </li>
  );
};

const onboardingSteps = [
  ['01', 'Shape the release', 'Add the title, artwork, dates, and essential metadata.'],
  ['02', 'Build the credits', 'Add music, contributors, territories, and stores.'],
  ['03', 'Review and submit', 'Validate everything, then send it for distribution.'],
] as const;

const DashboardEmptyState = ({ onCreateRelease }: { onCreateRelease: () => void }) => {
  const reduceMotion = useReducedMotion();

  return (
  <motion.section
    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    className="grid min-h-[560px] overflow-hidden card-framed lg:grid-cols-[1.1fr_0.9fr]"
    aria-labelledby="empty-dashboard-title"
  >
    <div className="flex flex-col justify-between invert-surface p-7 sm:p-10 lg:p-12">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-(--line)/30 text-(--muted)">
        <FontAwesomeIcon icon={faCompactDisc} aria-hidden="true" />
      </span>
      <div className="mt-16">
        <p className="type-eyebrow">A clear first step</p>
        <h1 id="empty-dashboard-title" className="mt-4 max-w-xl type-h2 text-(--ink)">
          Your first release starts here.
        </h1>
        <p className="mt-5 max-w-lg type-body-sm text-(--muted)">
          Build the release at your pace. Every step saves, so you can leave and return without losing your place.
        </p>
        <Button primary icon={faPlus} onClick={onCreateRelease} className="mt-7">
          Create your first release
        </Button>
      </div>
    </div>
    <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
      <p className="type-eyebrow text-(--lens-blue)">From draft to delivery</p>
      <ol className="mt-7 divide-y divide-(--line)">
        {onboardingSteps.map(([number, title, description]) => (
          <li key={number} className="grid grid-cols-[42px_1fr] gap-4 py-6 first:pt-0">
            <span className="type-body-sm text-(--lens-blue)" style={serif}>{number}</span>
            <span>
              <strong className="block type-card-title text-(--ink)">{title}</strong>
              <span className="mt-2 block type-body-sm text-(--muted)">{description}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  </motion.section>
  );
};

const DashboardError = ({
  onRetry,
  isRetrying,
}: {
  onRetry: () => unknown;
  isRetrying: boolean;
}) => (
  <section
    className="flex min-h-[420px] flex-col items-center justify-center card-framed px-6 text-center"
    role="alert"
  >
    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[color:var(--lens-ink)]/25 bg-(--surface) text-(--ink)">
      <FontAwesomeIcon icon={faTriangleExclamation} className="text-xl" aria-hidden="true" />
    </span>
    <h1 className="mt-5 type-page-title text-(--ink)">
      Dashboard unavailable
    </h1>
    <p className="mt-2 max-w-sm type-body-sm text-(--muted)">
      The dashboard summary could not be loaded. Check the API connection and try again.
    </p>
    <Button
      onClick={onRetry}
      disabled={isRetrying}
      isLoading={isRetrying}
      icon={faRotateRight}
      className="mt-6"
    >
      {isRetrying ? 'Retrying' : 'Retry'}
    </Button>
  </section>
);

const DashboardSkeleton = () => (
  <div
    className="flex flex-col gap-5"
    aria-label="Loading dashboard"
    aria-busy="true"
  >
    <div className="flex items-end justify-between">
      <div className="flex flex-col gap-3">
        <SkeletonLoader type="text" width="14rem" />
        <SkeletonLoader type="text" width="18rem" height="1rem" />
      </div>
      <SkeletonLoader type="button" width="9rem" />
    </div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="min-h-[120px] card-framed p-5"
        >
          <SkeletonLoader type="text" width="6rem" height="1rem" />
          <div className="mt-4">
            <SkeletonLoader type="text" width="4rem" />
          </div>
        </div>
      ))}
    </div>
    <div className="h-[150px] card-framed p-5">
      <SkeletonLoader type="text" width="10rem" height="1rem" />
    </div>
    <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="h-[320px] card-framed p-5">
        <SkeletonLoader type="text" width="10rem" height="1rem" />
      </div>
      <div className="h-[320px] card-framed p-5">
        <SkeletonLoader type="text" width="8rem" height="1rem" />
      </div>
    </div>
  </div>
);

export default UserDashboard;
