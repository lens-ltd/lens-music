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

import { LuArrowRight, LuCalendarDays, LuCheck, LuDisc3, LuMusic, LuPlus, LuRadioTower, LuRotateCw, LuSend, LuTriangleAlert } from 'react-icons/lu';
import type { IconType } from 'react-icons';
import { Icon } from '@/components/ui/icon';
import StatusBadge from '@/components/feedbacks/StatusBadge';

const serif = { fontFamily: 'var(--font-serif)', fontWeight: 500 } as const;

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
      className="flex flex-col gap-10"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <header className="flex flex-col gap-5 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="type-page-title text-(--ink)">
            {userName ? `${userName.split(' ')[0]}’s dashboard` : 'Dashboard'}
          </h1>
          <p className="mt-2 max-w-xl type-body-sm text-(--muted)">
            Follow every release from first draft to store delivery.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-2 type-meta">
            <span
              className={`h-1.5 w-1.5 rounded-full bg-(--signal) ${isRefreshing ? 'animate-pulse' : ''}`}
            />
            Updated {formatDate(new Date(summary.generatedAt))}
          </span>
          <Button primary icon={LuPlus} onClick={createRelease}>
            Create release
          </Button>
        </div>
      </header>

      <TotalsStrip totals={summary.totals} />
      <ReleasePipeline pipeline={summary.releasePipeline} />

      <section className="grid gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)]">
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
    icon: IconType;
    route?: string;
  }[] = [
    { label: 'Releases', value: totals.releases, icon: LuDisc3, route: '/releases' },
    { label: 'Tracks', value: totals.tracks, icon: LuMusic },
    { label: 'Live now', value: totals.liveReleases, icon: LuRadioTower, route: `/releases?status=${ReleaseStatus.LIVE}` },
    {
      label: 'Next 30 days',
      value: totals.upcomingReleases,
      icon: LuCalendarDays,
      route: `/releases?digitalReleaseDateFrom=${date(now)}&digitalReleaseDateTo=${date(inThirtyDays)}`,
    },
  ];

  return (
    <section
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      aria-label="Catalog totals"
    >
      {metrics.map((metric) => {
        const content = (
          <>
            <span className="flex items-center justify-between gap-3">
              <span className="type-meta">
                {metric.label}
              </span>
              <Icon icon={metric.icon} className="size-4 text-(--muted)" />
            </span>
            <strong className="mt-4 block type-metric text-(--ink)">
              {formatNumbers(metric.value)}
            </strong>
          </>
        );
        const className = `min-h-[112px] card-framed p-5 ${
          metric.route ? 'transition-colors hover:border-(--line-hover)' : ''
        }`;
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
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7" aria-label="Release lifecycle counts">
          {pipeline.map((item) => {
            const meta = releaseStatusMeta[item.status];
            return (
              <li
                key={item.status}
                className="card-framed"
              >
                <Link
                  to={`/releases?status=${item.status}`}
                  className="group flex min-h-[98px] flex-row items-center justify-between gap-3 rounded-(--radius-card) p-4 transition-colors hover:bg-(--signal-soft) lg:flex-col lg:items-start"
                >
                  <span className="type-meta">
                    {meta.label}
                  </span>
                <strong
                  className="type-metric text-[1.5rem] text-(--ink) transition-colors group-hover:text-(--signal)"
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
        <div className="card-framed px-5 py-8 text-center">
          <LuSend className="mx-auto size-5 text-(--muted)" aria-hidden="true" />
          <p className="mt-3 type-label text-(--ink)">
            No store deliveries yet
          </p>
          <p className="mx-auto mt-1 max-w-sm type-meta">
            Assign stores inside a release to start tracking delivery health here.
          </p>
        </div>
      ) : (
        <div className="grid items-center gap-7 sm:grid-cols-[150px_1fr]">
          <div className="card-framed mx-auto flex h-[142px] w-[142px] flex-col items-center justify-center">
            <strong className="type-metric tabular">
              {deliveryHealth.deliveredRate}%
            </strong>
            <span className="mt-1 type-meta">
              delivered
            </span>
          </div>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-4">
            {deliveryHealth.byStatus.map((item) => {
              const meta = deliveryStatusMeta[item.status];
              return (
                <li
                  key={item.status}
                  className="card-framed px-4 py-3"
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
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-(--signal-soft) text-(--signal)">
          <LuCheck aria-hidden="true" />
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
                    ? 'bg-(--danger-soft) text-(--danger)'
                    : 'bg-(--signal-soft) text-(--signal)'
                }`}
              >
                <LuTriangleAlert className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <strong className="block truncate type-label text-(--ink)">
                  {item.releaseTitle}
                </strong>
                <span className="mt-1 line-clamp-2 block type-meta">
                  {item.message}
                </span>
              </span>
              <LuArrowRight className="size-4 mt-2 shrink-0 text-(--muted) transition-transform group-hover:translate-x-1 group-hover:text-(--signal)" aria-hidden="true" />
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
        <LuArrowRight className="size-4" aria-hidden="true" />
      </Button>
    }
  >
    {releases.length ? (
      <ul className="divide-y divide-(--line)">
        {releases.map((release) => (
          <RecentReleaseRow key={release.id} release={release} />
        ))}
      </ul>
    ) : (
      <p className="px-5 py-10 text-center type-body-sm text-(--muted)">
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
        className="group -mx-3 grid min-h-[76px] grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-3 rounded-(--radius-control) px-3 py-3 transition-colors hover:bg-(--surface) lg:grid-cols-[52px_minmax(160px,1.3fr)_0.45fr_0.45fr_0.8fr_auto] lg:gap-5"
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
          <StatusBadge status={release.status}>{status.label}</StatusBadge>
          <LuArrowRight className="size-4 hidden text-(--muted) transition-transform group-hover:translate-x-1 group-hover:text-(--signal) md:block" aria-hidden="true" />
        </span>
      </Link>
    </li>
  );
};

const onboardingSteps = [
  ['Add the release details', 'Title, cover art, release date and the essentials stores ask for.'],
  ['Add tracks and credits', 'Upload audio, then add contributors, territories and stores.'],
  ['Review and submit', 'Check everything in one place, then send it for distribution.'],
] as const;

const DashboardEmptyState = ({ onCreateRelease }: { onCreateRelease: () => void }) => (
  <section
    className="grid gap-12 card-framed p-7 sm:p-10 lg:grid-cols-[1fr_1fr] lg:p-14"
    aria-labelledby="empty-dashboard-title"
  >
    <div>
      <h1 id="empty-dashboard-title" className="max-w-md type-h2 text-(--ink)">
        Create your first release.
      </h1>
      <p className="mt-4 max-w-md type-body text-(--muted)">
        Every step saves as you go, so you can stop and come back without losing
        your place.
      </p>
      <Button primary icon={LuPlus} onClick={onCreateRelease} className="mt-8">
        Create release
      </Button>
    </div>
    <ol className="flex list-none flex-col gap-6 p-0">
      {onboardingSteps.map(([title, description], index) => (
        <li key={title} className="grid grid-cols-[32px_1fr] gap-3">
          <span className="type-card-title text-(--signal) tabular">{index + 1}</span>
          <span>
            <strong className="block type-card-title font-medium text-(--ink)">{title}</strong>
            <span className="mt-1 block type-body-sm text-(--muted)">{description}</span>
          </span>
        </li>
      ))}
    </ol>
  </section>
);

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
    <span className="flex size-14 items-center justify-center rounded-full bg-(--danger-soft) text-(--danger)">
      <LuTriangleAlert className="size-6" aria-hidden="true" />
    </span>
    <h1 className="mt-5 type-page-title text-(--ink)">
      Dashboard unavailable
    </h1>
    <p className="mt-2 max-w-sm type-body-sm text-(--muted)">
      The dashboard summary didn't load. Check your connection and try again.
    </p>
    <Button
      onClick={onRetry}
      disabled={isRetrying}
      isLoading={isRetrying}
      icon={LuRotateCw}
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
