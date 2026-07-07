import Table from "@/components/table/Table";
import { Heading } from "@/components/text/Headings";
import UserLayout from "@/containers/UserLayout";
import { useReviewReleaseColumns } from "@/hooks/releases/columns.reviewReleases";
import { useFetchReleaseReviewQueue } from "@/hooks/releases/release-review.hooks";
import { RootState } from "@/state/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import ApproveRelease from "./ApproveRelease";
import RejectRelease from "./RejectRelease";

const ReleaseReviewPage = () => {
  const { releasesList, approveReleaseModal, rejectReleaseModal } = useSelector(
    (state: RootState) => state.release,
  );

  const {
    fetchReleaseReviewQueue,
    isFetching,
    page,
    size,
    totalCount,
    totalPages,
    setPage,
    setSize,
  } = useFetchReleaseReviewQueue();

  // Refetch when neither review modal is open (i.e. after an action completes).
  useEffect(() => {
    if (!approveReleaseModal && !rejectReleaseModal) {
      fetchReleaseReviewQueue({ size, page });
    }
  }, [
    fetchReleaseReviewQueue,
    size,
    page,
    approveReleaseModal,
    rejectReleaseModal,
  ]);

  const { reviewReleaseColumns } = useReviewReleaseColumns();

  return (
    <UserLayout>
      <main className="w-full flex flex-col gap-4">
        <nav className="w-full flex flex-col gap-1">
          <Heading>Release Review</Heading>
          <p className="text-[12px] text-[color:var(--lens-ink)]/55">
            Releases submitted for review. Approve to advance them, or request
            changes with feedback.
          </p>
        </nav>
        <section className="w-full flex flex-col gap-2">
          <Table
            columns={reviewReleaseColumns}
            data={releasesList}
            page={page}
            size={size}
            totalCount={totalCount}
            totalPages={totalPages}
            setPage={setPage}
            setSize={setSize}
            isLoading={isFetching}
          />
        </section>
      </main>
      <ApproveRelease />
      <RejectRelease />
    </UserLayout>
  );
};

export default ReleaseReviewPage;
