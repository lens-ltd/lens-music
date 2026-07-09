import Button from "@/components/inputs/Button";
import Loader from "@/components/inputs/Loader";
import { Heading } from "@/components/text/Headings";
import UserLayout from "@/containers/UserLayout";
import { useFetchUserById } from "@/hooks/users/users.hooks";
import { useAppSelector } from "@/state/hooks";
import { capitalizeString, formatDate, getStatusBackgroundColor } from "@/utils/strings.helper";
import {
  faEnvelope,
  faGlobe,
  faIdBadge,
  faPhone,
  faShieldAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const detailItems = [
  { key: "name", label: "Full name", icon: faUser },
  { key: "email", label: "Email address", icon: faEnvelope },
  { key: "phoneNumber", label: "Phone number", icon: faPhone },
  { key: "country", label: "Country", icon: faGlobe },
] as const;

const UserDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchUserById, isFetching } = useFetchUserById();
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (id) {
      fetchUserById({ id });
    }
  }, [fetchUserById, id]);

  if (isFetching) {
    return (
      <UserLayout>
        <main className="flex min-h-[50vh] w-full items-center justify-center">
          <Loader className="text-primary" />
        </main>
      </UserLayout>
    );
  }

  if (!user || user.id !== id) {
    return (
      <UserLayout>
        <main className="flex w-full flex-col gap-4">
          <nav className="flex w-full items-center justify-between gap-3">
            <Heading>User Details</Heading>
            <Button route="/users">Back to users</Button>
          </nav>
          <section className="w-full rounded-lg bg-[color:var(--lens-sand)]/10 p-8 text-center">
            <p className="text-[13px] text-[color:var(--lens-ink)]/60">
              User not found.
            </p>
          </section>
        </main>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <main className="flex w-full flex-col gap-5">
        <nav className="flex w-full items-center justify-between gap-3">
          <div>
            <Heading>User Details</Heading>
            <p className="mt-1 text-[13px] font-normal text-[color:var(--lens-ink)]/60">
              Review identity, account status, and access context.
            </p>
          </div>
          <Button route="/users">Back to users</Button>
        </nav>

        <section className="flex w-full flex-col gap-5 rounded-lg bg-[color:var(--lens-sand)]/10 p-5 sm:p-6">
          <div className="flex flex-col gap-4 border-b border-[color:var(--lens-sand)]/70 pb-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[color:var(--lens-blue)] text-xl font-semibold text-white">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="User avatar"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                user.name?.charAt(0) || "U"
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-[20px] font-semibold text-[color:var(--lens-ink)]">
                {user.name || "Unnamed user"}
              </h2>
              <p className="mt-1 truncate text-[13px] text-[color:var(--lens-ink)]/60">
                {user.email || "No email provided"}
              </p>
            </div>
            <span className={getStatusBackgroundColor(user.status)}>
              {capitalizeString(user.status)}
            </span>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            {detailItems.map((item) => (
              <div
                key={item.key}
                className="grid gap-3 rounded-md bg-white p-4 sm:grid-cols-[32px_140px_minmax(0,1fr)] sm:items-center"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[color:var(--lens-blue)]/10 text-[color:var(--lens-blue)]">
                  <FontAwesomeIcon icon={item.icon} className="text-[12px]" />
                </span>
                <p className="text-[11px] uppercase tracking-wide text-[color:var(--lens-ink)]/45">
                  {item.label}
                </p>
                <p className="min-w-0 truncate text-[13px] text-[color:var(--lens-ink)]">
                  {user[item.key] || "—"}
                </p>
              </div>
            ))}
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <div className="rounded-md bg-white p-4">
              <div className="mb-3 flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faShieldAlt}
                  className="text-[12px] text-[color:var(--lens-blue)]"
                />
                <h3 className="text-[13px] font-medium text-[color:var(--lens-ink)]">
                  Access
                </h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-[color:var(--lens-ink)]/45">
                    Role
                  </p>
                  <p className="mt-1 text-[13px] text-[color:var(--lens-ink)]">
                    {user.roleName || "No role assigned"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-[color:var(--lens-ink)]/45">
                    Permissions
                  </p>
                  <p className="mt-1 text-[13px] text-[color:var(--lens-ink)]">
                    {user.permissions?.length
                      ? `${user.permissions.length} permission${user.permissions.length === 1 ? "" : "s"}`
                      : "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-md bg-white p-4">
              <div className="mb-3 flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faIdBadge}
                  className="text-[12px] text-[color:var(--lens-blue)]"
                />
                <h3 className="text-[13px] font-medium text-[color:var(--lens-ink)]">
                  Workspace
                </h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-[color:var(--lens-ink)]/45">
                    Labels
                  </p>
                  <p className="mt-1 text-[13px] text-[color:var(--lens-ink)]">
                    {user.labels?.length || 0}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-[color:var(--lens-ink)]/45">
                    Releases
                  </p>
                  <p className="mt-1 text-[13px] text-[color:var(--lens-ink)]">
                    {user.releases?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 rounded-md bg-white p-4 sm:grid-cols-2">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-[color:var(--lens-ink)]/45">
                Created
              </p>
              <p className="mt-1 text-[13px] text-[color:var(--lens-ink)]">
                {user.createdAt ? formatDate(user.createdAt, "DD/MM/YYYY HH:mm") : "—"}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-[color:var(--lens-ink)]/45">
                Last updated
              </p>
              <p className="mt-1 text-[13px] text-[color:var(--lens-ink)]">
                {user.updatedAt ? formatDate(user.updatedAt, "DD/MM/YYYY HH:mm") : "—"}
              </p>
            </div>
          </div>
        </section>
      </main>
    </UserLayout>
  );
};

export default UserDetailsPage;
