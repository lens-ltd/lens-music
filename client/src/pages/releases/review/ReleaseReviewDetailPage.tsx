import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@/components/inputs/Button";
import { Heading } from "@/components/text/Headings";
import UserLayout from "@/containers/UserLayout";
import { PERMISSIONS } from "@/constants/permission.constants";
import { useGetRelease } from "@/hooks/releases/release.hooks";
import { useFetchReleaseContributors } from "@/hooks/releases/release-contributor.hooks";
import {
  setApproveReleaseModal,
  setRejectReleaseModal,
  setSelectedRelease,
} from "@/state/features/releaseSlice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { ReleaseStatus } from "@/types/models/release.types";
import { UUID } from "@/types/common.types";
import { capitalizeString, formatDate, getStatusBackgroundColor } from "@/utils/strings.helper";
import ApproveRelease from "./ApproveRelease";
import RejectRelease from "./RejectRelease";
import PreviewOverviewSection from "../wizard-steps/preview/PreviewOverviewSection";
import PreviewContributorsSection from "../wizard-steps/preview/PreviewContributorsSection";
import PreviewTracksSection from "../wizard-steps/preview/PreviewTracksSection";
import PreviewTerritoriesSection from "../wizard-steps/preview/PreviewTerritoriesSection";
import PreviewLabelsSection from "../wizard-steps/preview/PreviewLabelsSection";
import PreviewRelatedReleasesSection from "../wizard-steps/preview/PreviewRelatedReleasesSection";
import PreviewTerritoryDetailsSection from "../wizard-steps/preview/PreviewTerritoryDetailsSection";
import PreviewStoresSection from "../wizard-steps/preview/PreviewStoresSection";

const ReleaseReviewDetailPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: UUID }>();

  const { user } = useAppSelector((state) => state.auth);
  const permissions = user?.permissions ?? [];
  const canApprove = permissions.includes(PERMISSIONS.APPROVE_RELEASE);
  const canReject = permissions.includes(PERMISSIONS.REJECT_RELEASE);

  const { release, approveReleaseModal, rejectReleaseModal } = useAppSelector(
    (state) => state.release,
  );
  const { getRelease, isFetching } = useGetRelease();
  const {
    fetchReleaseContributors,
    data: releaseContributorsData,
    isFetching: areContributorsFetching,
  } = useFetchReleaseContributors();

  useEffect(() => {
    if (id) {
      fetchReleaseContributors({ releaseId: id });
    }
  }, [id, fetchReleaseContributors]);

  // Refetch after either review modal closes so an approve/reject action is reflected.
  useEffect(() => {
    if (id && !approveReleaseModal && !rejectReleaseModal) {
      getRelease({ id });
    }
  }, [id, approveReleaseModal, rejectReleaseModal, getRelease]);

  const releaseContributors = releaseContributorsData?.data ?? [];
  const isNotFound = !id || (!isFetching && release?.id !== id);
  const canReview = release?.status === ReleaseStatus.REVIEW;

  return (
    <UserLayout>
      <main className="w-full flex flex-col gap-4">
        <nav className="w-full flex flex-col gap-1">
          <Heading isLoading={isFetching}>
            {release?.title || "Release review"}
          </Heading>
          <p className="text-[12px] text-[color:var(--lens-ink)]/55">
            Everything submitted for this release, along with any prior
            feedback, to help you decide whether to approve it.
          </p>
        </nav>

        {isNotFound ? (
          <section className="rounded-md border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
            <Heading type="h3" className="!text-gray-900">
              Release not found
            </Heading>
            <p className="mt-2 text-[12px] text-gray-500">
              This release could not be loaded or does not exist.
            </p>
            <menu className="mt-5 flex justify-center">
              <Button
                onClick={(event) => {
                  event.preventDefault();
                  navigate(-1);
                }}
              >
                Back
              </Button>
            </menu>
          </section>
        ) : (
          <>
            <section className="rounded-md border border-gray-200/80 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[color:var(--lens-ink)]/55">
                  <span>Catalog: {release?.catalogNumber || "—"}</span>
                  <span>
                    Submitted by:{" "}
                    {release?.createdBy?.name || release?.createdBy?.email || "—"}
                  </span>
                  <span>
                    Submitted: {formatDate(release?.updatedAt, "DD/MM/YYYY HH:mm")}
                  </span>
                </div>
                {release?.status && (
                  <span className={getStatusBackgroundColor(release.status)}>
                    {capitalizeString(release.status)}
                  </span>
                )}
              </div>
            </section>

            {release?.reviewNotes && (
              <aside className="rounded-md border border-amber-200 bg-amber-50 p-4">
                <p className="text-[12px] font-medium text-amber-800">
                  Feedback from{" "}
                  {release.reviewedBy?.name || release.reviewedBy?.email || "reviewer"}
                  {release.reviewedAt
                    ? ` · ${formatDate(release.reviewedAt, "DD/MM/YYYY HH:mm")}`
                    : ""}
                </p>
                <p className="mt-1 text-[12px] text-amber-700 whitespace-pre-line">
                  {release.reviewNotes}
                </p>
              </aside>
            )}

            <section className="flex flex-col gap-4">
              {release && (
                <>
                  <PreviewOverviewSection
                    release={release}
                    contributors={releaseContributors}
                  />
                  <PreviewContributorsSection
                    releaseId={release.id}
                    contributors={releaseContributors}
                    isLoading={areContributorsFetching}
                  />
                  <PreviewTracksSection
                    tracks={release.tracks ?? []}
                    releaseId={release.id}
                    isLoading={isFetching}
                  />
                  <PreviewTerritoriesSection territories={release.territories ?? []} />
                  <PreviewLabelsSection releaseId={release.id} />
                  <PreviewRelatedReleasesSection releaseId={release.id} />
                  <PreviewTerritoryDetailsSection releaseId={release.id} />
                  <PreviewStoresSection releaseId={release.id} />
                </>
              )}
            </section>

            <footer className="flex w-full items-center justify-between gap-3">
              <Button
                onClick={(event) => {
                  event.preventDefault();
                  navigate(-1);
                }}
              >
                Back
              </Button>
              {canReview && (canApprove || canReject) && (
                <div className="flex items-center gap-2">
                  {canReject && (
                    <Button
                      danger
                      onClick={(event) => {
                        event.preventDefault();
                        if (release) {
                          dispatch(setSelectedRelease(release));
                          dispatch(setRejectReleaseModal(true));
                        }
                      }}
                    >
                      Request changes
                    </Button>
                  )}
                  {canApprove && (
                    <Button
                      primary
                      onClick={(event) => {
                        event.preventDefault();
                        if (release) {
                          dispatch(setSelectedRelease(release));
                          dispatch(setApproveReleaseModal(true));
                        }
                      }}
                    >
                      Approve release
                    </Button>
                  )}
                </div>
              )}
            </footer>
          </>
        )}
      </main>
      <ApproveRelease />
      <RejectRelease />
    </UserLayout>
  );
};

export default ReleaseReviewDetailPage;
