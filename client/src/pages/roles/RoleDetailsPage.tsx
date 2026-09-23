import Button from "@/components/inputs/Button";
import { BackButton, PageFooter } from "@/components/layout/PageFooter";
import SectionCard from "@/components/layout/SectionCard";
import { KeyValueList, KeyValuePair } from "@/components/inputs/KeyValuePair";
import { Heading } from "@/components/text/Headings";
import UserLayout from "@/containers/UserLayout";
import { useFetchRoleById } from "@/hooks/roles/roles.hooks";
import { useAppSelector } from "@/state/hooks";
import { capitalizeString, formatDate } from "@/utils/strings.helper";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import Loader from "@/components/inputs/Loader";

const RoleDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchRoleById, isFetching } = useFetchRoleById();
  const { role } = useAppSelector((state) => state.role);

  useEffect(() => {
    if (id) {
      fetchRoleById({ id });
    }
  }, [id, fetchRoleById]);

  if (isFetching) {
    return (
      <UserLayout>
        <main className="w-full flex items-center justify-center min-h-[50vh]">
          <Loader className="text-(--signal)" />
        </main>
      </UserLayout>
    );
  }

  if (!role) {
    return (
      <UserLayout>
        <main className="w-full flex flex-col gap-4">
          <Heading>Role details</Heading>
          <div className="w-full card-framed p-8 text-center">
            <p className="text-(--muted)">Role not found</p>
          </div>
          <PageFooter back={<BackButton route="/roles">Back to roles</BackButton>} />
        </main>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <main className="w-full flex flex-col gap-4">
        <header className="w-full flex flex-col gap-1">
          <Heading>Role details</Heading>
          <p className="text-[13px] text-(--muted) font-normal">
            View role information and associated permissions.
          </p>
        </header>

        <section className="flex w-full flex-col gap-1 card-framed p-5 sm:p-6">
          <h2 className="text-[18px] font-semibold text-(--ink)">{capitalizeString(role.name)}</h2>
          {role.description && (
            <p className="text-[13px] text-(--muted)">{role.description}</p>
          )}
        </section>

        <SectionCard title="Details">
          <KeyValueList>
            <KeyValuePair
              keyText="roleId"
              label="Role ID"
              valueText={<span className="font-mono font-normal">{role.id}</span>}
              className="md:col-span-2"
            />
            <KeyValuePair
              keyText="created"
              label="Created"
              valueText={role.createdAt ? formatDate(role.createdAt, "DD/MM/YYYY HH:mm") : undefined}
            />
            <KeyValuePair
              keyText="lastUpdated"
              label="Last updated"
              valueText={role.updatedAt ? formatDate(role.updatedAt, "DD/MM/YYYY HH:mm") : undefined}
            />
          </KeyValueList>
        </SectionCard>

        <SectionCard
          title="Permissions"
          description={`${role.permissions?.length || 0} granted to users with this role.`}
        >
          {role.permissions && role.permissions.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {role.permissions.map((permission) => (
                <li
                  key={permission.id}
                  className="inline-flex items-center rounded-(--radius-control) bg-(--surface) px-2 py-1 text-[13px] text-(--ink)"
                >
                  {capitalizeString(permission.permission?.name)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-(--radius-control) bg-(--surface) px-4 py-3 text-[13px] text-(--muted)">
              No permissions assigned.
            </p>
          )}
        </SectionCard>

        <PageFooter
          back={<BackButton route="/roles">Back to roles</BackButton>}
          actions={<Button route={`/roles/${id}/edit`}>Edit</Button>}
        />
      </main>
    </UserLayout>
  );
};

export default RoleDetailsPage;
