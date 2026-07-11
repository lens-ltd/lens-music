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
import UserLayout from '@/containers/UserLayout';
import DashboardCard from '@/containers/DashboardCard';
import DashboardSection from '@/pages/dashboard/components/DashboardSection';
import { Heading } from '@/components/text/Headings';
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

const serif = { fontFamily: 'var(--font-serif)', fontWeight: 700 } as const;

const releaseStatusMeta: Record<
  ReleaseStatus,
  { label: string; tone: string }
> = {
  [ReleaseStatus.DRAFT]: { label: 'Draft', tone: 'rgb(16,14,9)' },
  [ReleaseStatus.VALIDATED]: { label: 'Validated', tone: 'rgb(31,98,142)' },
  [ReleaseStatus.REVIEW]: { label: 'In review', tone: 'rgb(180,120,20)' },
  [ReleaseStatus.APPROVED]: { label: 'Approved', tone: 'rgb(31,98,142)' },
  [ReleaseStatus.DELIVERED]: { label: 'Delivered', tone: 'rgb(31,98,142)' },
  [ReleaseStatus.LIVE]: { label: 'Live', tone: 'rgb(46,125,80)' },
  [ReleaseStatus.TAKENDOWN]: { label: 'Taken down', tone: 'rgb(185,28,28)' },
};

const deliveryStatusMeta: Record<
  ReleaseDeliveryStatus,
  { label: string; color: string }
> = {
  [ReleaseDeliveryStatus.PENDING]: { label: 'Pending', color: 'rgb(16,14,9)' },
  [ReleaseDeliveryStatus.IN_PROGRESS]: { label: 'In progress', color: 'rgb(180,120,20)' },
  [ReleaseDeliveryStatus.DELIVERED]: { label: 'Delivered', color: 'rgb(31,98,142)' },
  [ReleaseDeliveryStatus.FAILED]: { label: 'Failed', color: 'rgb(185,28,28)' },
};

const formatNumber = new Intl.NumberFormat('en-US');
const formatDate = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});
const formatTime = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
});

const UserDashboard = () => {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetDashboardSummaryQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });

  return (
    <UserLayout>
      <main className="w-full min-w-0 flex flex-col gap-5">
        {isLoading ? <DashboardSkeleton /> : null}
        {!isLoading && isError ? (
          <DashboardError onRetry={refetch} isRetrying={isFetching} />
        ) : null}
        {!isLoading && !isError && data?.data ? (
          <DashboardContent summary={data.data} isRefreshing={isFetching} />
        ) : null}
      </main>
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
  const userName = useAppSelector((state) => state.auth.user?.name);

  const createRelease = () => {
    dispatch(setCreateReleaseModal(true));
    navigate('/releases');
  };

  if (summary.totals.releases === 0) {
    return <DashboardEmptyState onCreateRelease={createRelease} />;
  }

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <Heading>
            {userName ? `${userName.split(' ')[0]}’s dashboard` : 'Dashboard'}
          </Heading>
          <p className="mt-1 text-[13px] text-[color:var(--lens-ink)]/60">
            Follow every release from first draft to store delivery.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-2 text-[11px] text-[color:var(--lens-ink)]/45">
            <span
              className={`h-1.5 w-1.5 rounded-full bg-[color:var(--lens-blue)] ${isRefreshing ? 'animate-pulse' : ''}`}
            />
            Updated {formatTime.format(new Date(summary.generatedAt))}
          </span>
          <Button primary icon={faPlus} onClick={createRelease}>
            Create release
          </Button>
        </div>
      </header>

      <TotalsStrip totals={summary.totals} />
      <ReleasePipeline pipeline={summary.releasePipeline} />

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)]">
        <DeliveryHealth summary={summary} />
        <ActionQueue items={summary.actionItems} />
      </section>

      <RecentReleases releases={summary.recentReleases} />
    </div>
  );
};

const TotalsStrip = ({ totals }: { totals: DashboardSummary['totals'] }) => {
  const metrics: { label: string; value: number; icon: IconDefinition }[] = [
    { label: 'Releases', value: totals.releases, icon: faCompactDisc },
    { label: 'Tracks', value: totals.tracks, icon: faMusic },
    { label: 'Live now', value: totals.liveReleases, icon: faTowerBroadcast },
    { label: 'Next 30 days', value: totals.upcomingReleases, icon: faCalendarDays },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Catalog totals">
      {metrics.map((metric) => (
        <DashboardCard
          key={metric.label}
          title={metric.label}
          value={formatNumber.format(metric.value)}
          icon={metric.icon}
        />
      ))}
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
      subtitle={`${formatNumber.format(total)} releases moving through your distribution chain`}
      overflowHidden
    >
      <div className="overflow-x-auto">
        <ol
          className="grid min-w-[720px] grid-cols-7 gap-3"
          aria-label="Release lifecycle counts"
        >
          {pipeline.map((item) => {
            const meta = releaseStatusMeta[item.status];
            return (
              <li
                key={item.status}
                className="flex flex-col gap-2 rounded-md border border-[color:var(--lens-sand)] bg-[color:var(--lens-sand)]/10 px-3 py-3"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: meta.tone }}
                    aria-hidden="true"
                  />
                  <span className="text-[10px] uppercase tracking-[0.12em] text-[color:var(--lens-ink)]/50">
                    {meta.label}
                  </span>
                </span>
                <strong
                  className="text-[22px] text-[color:var(--lens-ink)]"
                  style={serif}
                >
                  {formatNumber.format(item.count)}
                </strong>
              </li>
            );
          })}
        </ol>
      </div>
    </DashboardSection>
  );
};

const DeliveryHealth = ({ summary }: { summary: DashboardSummary }) => {
  const { deliveryHealth } = summary;
  const delivered = deliveryHealth.byStatus.find(
    (item) => item.status === ReleaseDeliveryStatus.DELIVERED,
  )?.count ?? 0;
  const ringStyle = {
    background: `conic-gradient(var(--lens-blue) ${deliveryHealth.deliveredRate}%, var(--lens-sand) 0)`,
  };

  return (
    <DashboardSection
      label="Store delivery"
      title="Delivery health"
      subtitle={`${formatNumber.format(deliveryHealth.total)} store assignments across your catalog`}
    >
      {deliveryHealth.total === 0 ? (
        <div className="rounded-md border border-dashed border-[color:var(--lens-sand)] bg-[color:var(--lens-sand)]/10 px-5 py-8 text-center">
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="text-[color:var(--lens-blue)]"
            aria-hidden="true"
          />
          <p className="mt-3 text-[12px] font-semibold text-[color:var(--lens-ink)]">
            No store deliveries yet
          </p>
          <p className="mx-auto mt-1 max-w-sm text-[11px] leading-relaxed text-[color:var(--lens-ink)]/50">
            Assign stores inside a release to start tracking delivery health here.
          </p>
        </div>
      ) : (
        <div className="grid items-center gap-7 sm:grid-cols-[150px_1fr]">
          <div
            className="relative mx-auto flex h-[142px] w-[142px] items-center justify-center rounded-full"
            style={ringStyle}
          >
            <div className="flex h-[108px] w-[108px] flex-col items-center justify-center rounded-full bg-white">
              <strong
                className="text-[25px] text-[color:var(--lens-ink)]"
                style={serif}
              >
                {deliveryHealth.deliveredRate}%
              </strong>
              <span className="mt-1 text-[9px] uppercase tracking-[0.12em] text-[color:var(--lens-ink)]/45">
                delivered
              </span>
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-4">
            {deliveryHealth.byStatus.map((item) => {
              const meta = deliveryStatusMeta[item.status];
              return (
                <li
                  key={item.status}
                  className="border-l-2 pl-3"
                  style={{ borderColor: meta.color }}
                >
                  <strong
                    className="block text-[17px] text-[color:var(--lens-ink)]"
                    style={serif}
                  >
                    {formatNumber.format(item.count)}
                  </strong>
                  <span className="text-[10px] text-[color:var(--lens-ink)]/50">
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
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--lens-blue)]/10 text-[color:var(--lens-blue)]">
          <FontAwesomeIcon icon={faCheck} aria-hidden="true" />
        </span>
        <p className="mt-4 text-[12px] font-semibold text-[color:var(--lens-ink)]">
          Your queue is clear
        </p>
        <p className="mt-1 max-w-[230px] text-[11px] leading-relaxed text-[color:var(--lens-ink)]/50">
          No review changes or failed deliveries need action.
        </p>
      </div>
    ) : (
      <ul className="divide-y divide-[color:var(--lens-sand)]">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              to={`/releases/${item.releaseId}/wizard`}
              className="group flex min-h-[74px] items-start gap-3 py-4"
            >
              <span
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  item.kind === 'DELIVERY_FAILED'
                    ? 'bg-red-700/10 text-red-700'
                    : 'bg-[color:var(--lens-blue)]/10 text-[color:var(--lens-blue)]'
                }`}
              >
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  className="text-[13px]"
                  aria-hidden="true"
                />
              </span>
              <span className="min-w-0 flex-1">
                <strong className="block truncate text-[12px] font-semibold text-[color:var(--lens-ink)]">
                  {item.releaseTitle}
                </strong>
                <span className="mt-1 line-clamp-2 block text-[11px] leading-relaxed text-[color:var(--lens-ink)]/55">
                  {item.message}
                </span>
              </span>
              <FontAwesomeIcon
                icon={faArrowRight}
                className="mt-2 shrink-0 text-[color:var(--lens-ink)]/25 transition-transform group-hover:translate-x-1 group-hover:text-[color:var(--lens-blue)]"
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
    <ul className="divide-y divide-[color:var(--lens-sand)] border-t border-[color:var(--lens-sand)]">
      {releases.map((release) => (
        <RecentReleaseRow key={release.id} release={release} />
      ))}
    </ul>
  </DashboardSection>
);

const RecentReleaseRow = ({ release }: { release: DashboardRelease }) => {
  const status = releaseStatusMeta[release.status];
  return (
    <li>
      <Link
        to={`/releases/${release.id}/wizard`}
        className="group grid min-h-[82px] grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 transition-colors hover:bg-[color:var(--lens-sand)]/20 sm:px-5 lg:grid-cols-[52px_minmax(160px,1.3fr)_0.45fr_0.45fr_0.8fr_auto] lg:gap-5"
      >
        {release.coverArtUrl ? (
          <img
            src={release.coverArtUrl}
            alt=""
            className="h-12 w-12 rounded-md object-cover sm:h-[52px] sm:w-[52px]"
          />
        ) : (
          <span
            className="h-12 w-12 rounded-md bg-[color:var(--lens-sand)] sm:h-[52px] sm:w-[52px]"
            aria-label="No cover art"
            role="img"
          />
        )}
        <span className="min-w-0">
          <strong className="block truncate text-[12px] font-semibold text-[color:var(--lens-ink)]">
            {release.title}
          </strong>
          <span className="mt-1 block text-[10px] uppercase tracking-[0.1em] text-[color:var(--lens-ink)]/42">
            {release.type?.toLowerCase() ?? 'Release'}
          </span>
        </span>
        <span className="hidden lg:block">
          <span className="block text-[11px] text-[color:var(--lens-ink)]" style={serif}>
            {release.trackCount}
          </span>
          <span className="text-[9px] uppercase tracking-[0.1em] text-[color:var(--lens-ink)]/42">
            tracks
          </span>
        </span>
        <span className="hidden lg:block">
          <span className="block text-[11px] text-[color:var(--lens-ink)]" style={serif}>
            {release.storeCount}
          </span>
          <span className="text-[9px] uppercase tracking-[0.1em] text-[color:var(--lens-ink)]/42">
            stores
          </span>
        </span>
        <span className="hidden lg:block">
          <span className="block text-[11px] text-[color:var(--lens-ink)]">
            {release.digitalReleaseDate
              ? formatDate.format(new Date(`${release.digitalReleaseDate}T00:00:00`))
              : 'Not set'}
          </span>
          <span className="text-[9px] uppercase tracking-[0.1em] text-[color:var(--lens-ink)]/42">
            release date
          </span>
        </span>
        <span className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[color:var(--lens-sand)] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-[color:var(--lens-ink)]/70">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: status.tone }}
              aria-hidden="true"
            />
            {status.label}
          </span>
          <FontAwesomeIcon
            icon={faArrowRight}
            className="hidden text-[color:var(--lens-ink)]/25 transition-transform group-hover:translate-x-1 group-hover:text-[color:var(--lens-blue)] md:block"
            aria-hidden="true"
          />
        </span>
      </Link>
    </li>
  );
};

const DashboardEmptyState = ({ onCreateRelease }: { onCreateRelease: () => void }) => (
  <section
    className="flex min-h-[460px] flex-col items-center justify-center rounded-xl border border-[color:var(--lens-sand)] bg-white px-6 py-12 text-center"
    aria-labelledby="empty-dashboard-title"
  >
    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--lens-blue)]/10 text-[color:var(--lens-blue)]">
      <FontAwesomeIcon icon={faCompactDisc} className="text-2xl" aria-hidden="true" />
    </span>
    <h1
      id="empty-dashboard-title"
      className="mt-6 max-w-[520px] text-[28px] leading-tight text-[color:var(--lens-ink)] sm:text-[34px]"
      style={serif}
    >
      Create your first release to start tracking it here.
    </h1>
    <p className="mx-auto mt-4 max-w-md text-[13px] leading-relaxed text-[color:var(--lens-ink)]/55">
      Track its metadata, review state, store delivery, and path to going live — all in one place.
    </p>
    <Button primary icon={faPlus} onClick={onCreateRelease} className="mt-7">
      Create your first release
    </Button>
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
    className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-[color:var(--lens-sand)] bg-white px-6 text-center"
    role="alert"
  >
    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-700/10 text-red-700">
      <FontAwesomeIcon icon={faTriangleExclamation} className="text-xl" aria-hidden="true" />
    </span>
    <h1 className="mt-5 text-[22px] text-[color:var(--lens-ink)]" style={serif}>
      Dashboard unavailable
    </h1>
    <p className="mt-2 max-w-sm text-[12px] leading-relaxed text-[color:var(--lens-ink)]/55">
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
          className="min-h-[120px] rounded-xl border border-[color:var(--lens-sand)] bg-white p-5"
        >
          <SkeletonLoader type="text" width="6rem" height="1rem" />
          <div className="mt-4">
            <SkeletonLoader type="text" width="4rem" />
          </div>
        </div>
      ))}
    </div>
    <div className="h-[150px] rounded-xl border border-[color:var(--lens-sand)] bg-white p-5">
      <SkeletonLoader type="text" width="10rem" height="1rem" />
    </div>
    <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="h-[320px] rounded-xl border border-[color:var(--lens-sand)] bg-white p-5">
        <SkeletonLoader type="text" width="10rem" height="1rem" />
      </div>
      <div className="h-[320px] rounded-xl border border-[color:var(--lens-sand)] bg-white p-5">
        <SkeletonLoader type="text" width="8rem" height="1rem" />
      </div>
    </div>
  </div>
);

export default UserDashboard;
