import Button from "@/components/inputs/Button";
import { Heading } from "@/components/text/Headings";
import UserLayout from "@/containers/UserLayout";
import { useFetchRoleById } from "@/hooks/roles/roles.hooks";
import { useAppSelector } from "@/state/hooks";
import { formatDate } from "@/utils/strings.helper";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Loader from "@/components/inputs/Loader";

const RoleDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
          <Loader className="text-primary" />
        </main>
      </UserLayout>
    );
  }

  if (!role) {
    return (
      <UserLayout>
        <main className="w-full flex flex-col gap-4">
          <nav className="w-full flex items-center gap-3 justify-between">
            <div>
              <Heading>Role Details</Heading>
            </div>
            <Button route="/roles">Back to roles</Button>
          </nav>
          <div className="w-full rounded-xl border border-[color:var(--lens-sand)] bg-white p-8 text-center">
            <p className="text-[color:var(--lens-ink)]/60">Role not found</p>
          </div>
        </main>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <main className="w-full flex flex-col gap-4">
        <nav className="w-full flex items-center gap-3 justify-between">
          <div>
            <Heading>Role Details</Heading>
            <p className="text-[13px] text-[color:var(--lens-ink)]/60 font-normal mt-1">
              View role information and associated permissions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button route={`/roles/${id}/edit`}>Edit</Button>
            <Button route="/roles">Back to roles</Button>
          </div>
        </nav>

        <section className="w-full max-w-3xl">
          <div className="w-full flex flex-col gap-6 rounded-xl border border-[color:var(--lens-sand)] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-1">
              <h2 className="text-[18px] font-semibold text-[color:var(--lens-ink)]">
                {role.name}
              </h2>
              {role.description && (
                <p className="text-[13px] text-[color:var(--lens-ink)]/70">
                  {role.description}
                </p>
              )}
            </div>

            <div className="grid gap-4 pt-4 border-t border-[color:var(--lens-sand)]">
              <div className="flex flex-col gap-1">
                <p className="text-[11px] uppercase tracking-wide text-[color:var(--lens-ink)]/45">
                  Role ID
                </p>
                <p className="text-[13px] text-[color:var(--lens-ink)] font-mono">
                  {role.id}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-[11px] uppercase tracking-wide text-[color:var(--lens-ink)]/45">
                  Permissions
                </p>
                <div className="flex flex-wrap gap-2">
                  {role.permissions && role.permissions.length > 0 ? (
                    role.permissions.map((permission) => (
                      <span
                        key={permission.id}
                        className="inline-flex items-center px-2 py-1 rounded-md bg-[color:var(--lens-sand)]/30 text-[12px] text-[color:var(--lens-ink)]"
                      >
                        {permission.permission?.name || permission.name}
                      </span>
                    ))
                  ) : (
                    <p className="text-[13px] text-[color:var(--lens-ink)]/50">No permissions assigned</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-[11px] uppercase tracking-wide text-[color:var(--lens-ink)]/45">
                    Created
                  </p>
                  <p className="text-[13px] text-[color:var(--lens-ink)]">
                    {role.createdAt ? formatDate(role.createdAt, "DD/MM/YYYY HH:mm") : "—"}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-[11px] uppercase tracking-wide text-[color:var(--lens-ink)]/45">
                    Last updated
                  </p>
                  <p className="text-[13px] text-[color:var(--lens-ink)]">
                    {role.updatedAt ? formatDate(role.updatedAt, "DD/MM/YYYY HH:mm") : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </UserLayout>
  );
};

export default RoleDetailsPage;