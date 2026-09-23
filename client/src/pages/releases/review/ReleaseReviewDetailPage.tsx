import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@/components/inputs/Button";
import { BackButton } from "@/components/layout/PageFooter";
import SectionCard from "@/components/layout/SectionCard";
import { KeyValueList, KeyValuePair } from "@/components/inputs/KeyValuePair";
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
          <p className="text-[13px] text-(--muted)">
            Everything submitted for this release, along with any prior
            feedback, to help you decide whether to approve it.
          </p>
        </nav>

        {isNotFound ? (
          <section className="card-framed p-8 text-center">
            <Heading type="h3" className="!text-(--ink)">
              Release not found
            </Heading>
            <p className="mt-2 text-[13px] text-(--muted)">
              This release could not be loaded or does not exist.
            </p>
            <menu className="mt-5 flex justify-center">
              <BackButton
                onClick={(event) => {
                  event.preventDefault();
                  navigate(-1);
                }}
              >
                Back
              </BackButton>
            </menu>
          </section>
        ) : (
          <>
            <SectionCard
              title="Submission"
              action={
                release?.status && (
                  <span className={getStatusBackgroundColor(release.status)}>
                    {capitalizeString(release.status)}
                  </span>
                )
              }
            >
              <KeyValueList className="lg:grid-cols-3">
                <KeyValuePair
                  keyText="catalogNumber"
                  label="Catalog number"
                  valueText={release?.catalogNumber}
                />
                <KeyValuePair
                  keyText="submittedBy"
                  label="Submitted by"
                  valueText={release?.createdBy?.name || release?.createdBy?.email}
                />
                <KeyValuePair
                  keyText="submittedAt"
                  label="Submitted"
                  valueText={
                    release?.updatedAt
                      ? formatDate(release.updatedAt, "DD/MM/YYYY HH:mm")
                      : undefined
                  }
                />
              </KeyValueList>
            </SectionCard>

            {release?.reviewNotes && (
              <SectionCard
                title="Reviewer feedback"
                description={`From ${
                  release.reviewedBy?.name || release.reviewedBy?.email || "reviewer"
                }${
                  release.reviewedAt
                    ? ` · ${formatDate(release.reviewedAt, "DD/MM/YYYY HH:mm")}`
                    : ""
                }`}
              >
                <p className="rounded-(--radius-control) bg-(--surface) px-4 py-3 text-[13px] text-(--ink) whitespace-pre-line">
                  {release.reviewNotes}
                </p>
              </SectionCard>
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
              <BackButton
                onClick={(event) => {
                  event.preventDefault();
                  navigate(-1);
                }}
              >
                Back
              </BackButton>
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
