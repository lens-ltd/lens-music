import Button from "@/components/inputs/Button";
import Table from "@/components/table/Table";
import { Heading } from "@/components/text/Headings";
import UserLayout from "@/containers/UserLayout";
import { useRoleColumns } from "@/hooks/roles/columns.roles";
import { useFetchRoles } from "@/hooks/roles/roles.hooks";
import { useAppSelector } from "@/state/hooks";
import { faPlus } from "@fortawesome/free-regular-svg-icons";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RolesPage = () => {
  const navigate = useNavigate();
  
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

  useEffect(() => {
    fetchRoles({ page, size });
  }, [fetchRoles, page, size]);

  // COLUMNS
  const { roleColumns } = useRoleColumns({
    onView: (id) => {
      navigate(`/roles/${id}`);
    },
    onEdit: (id) => {
      navigate(`/roles/${id}/edit`);
    },
    onDelete: (id) => {
      // TODO: Implement delete confirmation modal
      console.log("Delete role:", id);
    },
  });

  return (
    <UserLayout>
      <main className="w-full flex flex-col gap-4">
        <nav className="w-full flex items-center gap-3 justify-between">
          <div>
            <Heading>Roles</Heading>
            <p className="text-[13px] text-[color:var(--lens-ink)]/60 font-normal mt-1">
              Manage user roles and their associated permissions.
            </p>
          </div>
          <Button icon={faPlus} primary route="/roles/create">
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
      </main>
    </UserLayout>
  );
};

export default RolesPage;