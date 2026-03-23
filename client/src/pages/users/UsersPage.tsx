import Button from "@/components/inputs/Button";
import Table from "@/components/table/Table";
import { Heading } from "@/components/text/Headings";
import UserLayout from "@/containers/UserLayout";
import { useUserColumns } from "@/hooks/users/columns.users";
import { useFetchUsers } from "@/hooks/users/users.hooks";
import { useAppSelector } from "@/state/hooks";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { useEffect } from "react";

const UsersPage = () => {
  // STATE
  const { usersList } = useAppSelector((state) => state.user);

  const {
    fetchUsers,
    isFetching,
    page,
    size,
    totalCount,
    totalPages,
    setPage,
    setSize,
  } = useFetchUsers();

  useEffect(() => {
    fetchUsers({ page, size });
  }, [fetchUsers, page, size]);

  // COLUMNS
  const { userColumns } = useUserColumns();

  return (
    <UserLayout>
      <main className="w-full flex flex-col gap-4">
        <nav className="w-full flex items-center gap-3 justify-between">
          <div>
            <Heading>Users</Heading>
            <p className="text-[13px] text-[color:var(--lens-ink)]/60 font-normal mt-1">
              Review dashboard users and their account status.
            </p>
          </div>
          <Button primary icon={faEnvelope} route="/users/invitations/create">
            Invite user
          </Button>
        </nav>

        <Table
          data={usersList}
          columns={userColumns}
          isLoading={isFetching}
          page={page}
          size={size}
          totalCount={totalCount}
          totalPages={totalPages}
          setPage={setPage}
          setSize={setSize}
          noDataMessage="No users found."
        />
      </main>
    </UserLayout>
  );
};

export default UsersPage;
