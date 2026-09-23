import Button from "@/components/inputs/Button";
import Table from "@/components/table/Table";
import { Heading } from "@/components/text/Headings";
import UserLayout from "@/containers/UserLayout";
import { useRoleColumns } from "@/hooks/roles/columns.roles";
import { useFetchRoles } from "@/hooks/roles/roles.hooks";
import DeleteRole from "@/pages/roles/DeleteRole";
import { useAppSelector } from "@/state/hooks";
import { useCallback, useEffect } from "react";

import { LuPlus } from 'react-icons/lu';

const RolesPage = () => {
  // STATE
  const { rolesList } = useAppSelector((state) => state.role);

  const {
    fetchRoles,
    isFetching,
    page,
    size,
    totalCount,
    totalPages,
    setPage,
    setSize,
  } = useFetchRoles();

  const refreshRoles = useCallback(() => {
    fetchRoles({ page, size });
  }, [fetchRoles, page, size]);

  useEffect(() => {
    refreshRoles();
  }, [refreshRoles]);

  // COLUMNS
  const { roleColumns } = useRoleColumns();

  return (
    <UserLayout>
      <main className="w-full flex flex-col gap-4">
        <nav className="w-full flex items-center gap-3 justify-between">
          <div>
            <Heading>Roles</Heading>
            <p className="type-meta mt-1">
              Manage user roles and their associated permissions.
            </p>
          </div>
          <Button icon={LuPlus} primary route="/roles/create">
            Create role
          </Button>
        </nav>

        <Table
          data={rolesList}
          columns={roleColumns}
          isLoading={isFetching}
          page={page}
          size={size}
          totalCount={totalCount}
          totalPages={totalPages}
          setPage={setPage}
          setSize={setSize}
          noDataMessage="No roles found."
        />
        <DeleteRole onDeleted={refreshRoles} />
      </main>
    </UserLayout>
  );
};

export default RolesPage;
