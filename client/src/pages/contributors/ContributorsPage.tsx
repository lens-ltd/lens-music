import Button from "@/components/inputs/Button";
import Table from "@/components/table/Table";
import { Heading } from "@/components/text/Headings";
import UserLayout from "@/containers/UserLayout";
import { useContributorColumns } from "@/hooks/contributors/columns.contributors";
import { useFetchContributors } from "@/hooks/contributors/contributor.hooks";
import { useAppSelector } from "@/state/hooks";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import DeleteContributor from "./DeleteContributor";

const ContributorsPage = () => {
  // STATE
  const { contributorsList, deleteContributorModal } = useAppSelector(
    (state) => state.contributor,
  );

  // FETCH CONTRIBUTORS
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

  // FETCH CONTRIBUTORS
  useEffect(() => {
    if (!deleteContributorModal) {
      fetchContributors({ page, size });
    }
  }, [fetchContributors, page, size, deleteContributorModal]);

  // COLUMNS
  const { contributorColumns } = useContributorColumns();

  return (
    <UserLayout>
      <main className="w-full flex flex-col gap-4">
        <nav className="w-full flex items-center gap-3 justify-between">
          <Heading>Contributors</Heading>
          <Button icon={faPlus} primary route="/contributors/create">
            Add new contributor
          </Button>
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
      <DeleteContributor />
    </UserLayout>
  );
};

export default ContributorsPage;
