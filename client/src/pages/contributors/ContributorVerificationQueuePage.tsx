import Table from "@/components/table/Table";
import { Heading } from "@/components/text/Headings";
import UserLayout from "@/containers/UserLayout";
import { useContributorColumns } from "@/hooks/contributors/columns.contributors";
import { useFetchContributors } from "@/hooks/contributors/contributor.hooks";
import { useAppSelector } from "@/state/hooks";
import { ContributorVerificationStatus } from "@/types/models/contributor.types";
import { useEffect } from "react";
import VerifyContributor from "./VerifyContributor";
import RejectContributor from "./RejectContributor";

const VERIFICATION_QUEUE_STATUSES = [
  ContributorVerificationStatus.PENDING,
  ContributorVerificationStatus.PENDING_VERIFICATION,
].join(",");

const ContributorVerificationQueuePage = () => {
  const { contributorsList, verifyContributorModal, rejectContributorModal } =
    useAppSelector((state) => state.contributor);

  const {
    fetchContributors,
    isFetching,
    page,
    size,
    totalCount,
    totalPages,
    setPage,
    setSize,
  } = useFetchContributors();

  useEffect(() => {
    if (!verifyContributorModal && !rejectContributorModal) {
      fetchContributors({
        page,
        size,
        verificationStatus: VERIFICATION_QUEUE_STATUSES,
      });
    }
  }, [
    fetchContributors,
    page,
    size,
    verifyContributorModal,
    rejectContributorModal,
  ]);

  const { contributorColumns } = useContributorColumns();

  return (
    <UserLayout>
      <main className="w-full flex flex-col gap-4">
        <nav className="w-full flex flex-col gap-1">
          <Heading>Contributor Verification</Heading>
          <p className="text-[12px] text-[color:var(--lens-ink)]/55">
            Contributors awaiting verification. Verify eligible profiles or
            reject them with an optional note.
          </p>
        </nav>
        <Table
          data={contributorsList}
          columns={contributorColumns}
          isLoading={isFetching}
          page={page}
          size={size}
          totalCount={totalCount}
          totalPages={totalPages}
          setPage={setPage}
          setSize={setSize}
        />
      </main>
      <VerifyContributor />
      <RejectContributor />
    </UserLayout>
  );
};

export default ContributorVerificationQueuePage;
