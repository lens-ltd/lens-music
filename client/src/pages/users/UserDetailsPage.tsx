import Button from "@/components/inputs/Button";
import Loader from "@/components/inputs/Loader";
import { Heading } from "@/components/text/Headings";
import UserLayout from "@/containers/UserLayout";
import { PERMISSIONS } from "@/constants/permission.constants";
import { useFetchUserById } from "@/hooks/users/users.hooks";
import AssignUserRole from "@/pages/users/AssignUserRole";
import {
  setAssignUserRoleModal,
  setSelectedUser,
} from "@/state/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { User } from "@/types/models/user.types";
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
import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

const detailItems = [
  { key: "name", label: "Full name", icon: faUser },
  { key: "email", label: "Email address", icon: faEnvelope },
  { key: "phoneNumber", label: "Phone number", icon: faPhone },
  { key: "country", label: "Country", icon: faGlobe },
] as const;

const UserDetailsPage = () => {

  // NAVIGATION
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // FETCH USER BY ID
  const {
    fetchUserById,
    isFetching,
    isError,
    error,
    isSuccess,
    isUninitialized,
    data: fetchedUser,
  } = useFetchUserById();
  const dispatch = useAppDispatch();
  const { user: storeUser, assignUserRoleModal } = useAppSelector(
    (state) => state.user,
  );
  const { user: authUser } = useAppSelector((state) => state.auth);
  const canAssignRole = authUser?.permissions?.includes(
    PERMISSIONS.UPDATE_USER,
  );

  useEffect(() => {
    if (id && !assignUserRoleModal) {
      void fetchUserById({ id });
    }
  }, [fetchUserById, id, assignUserRoleModal]);

  const user: User | undefined = useMemo(() => {
    if (fetchedUser && fetchedUser.id === id) {
      return fetchedUser as User;
    }
    if (storeUser && storeUser.id === id) {
      return storeUser;
    }
    return undefined;
  }, [fetchedUser, storeUser, id]);

  if (isUninitialized || isFetching) {
    return (
      <UserLayout>
        <main className="flex min-h-[50vh] w-full items-center justify-center">
          <Loader className="text-primary" />
        </main>
      </UserLayout>
    );
  }

  if (isError) {
    const message =
      (error as { data?: { message?: string } })?.data?.message ||
      "Failed to load user details.";
    return (
      <UserLayout>
        <main className="flex w-full flex-col gap-4">
          <nav className="flex w-full items-center justify-between gap-3">
            <Heading>User Details</Heading>
            <Button route="/users">Back to users</Button>
          </nav>
          <section className="w-full rounded-lg bg-(--surface) p-8 text-center">
            <p className="text-[13px] text-(--muted)">{message}</p>
          </section>
        </main>
      </UserLayout>
    );
  }

  if (!user || (isSuccess && user.id !== id)) {
    return (
      <UserLayout>
        <main className="flex w-full flex-col gap-4">
          <nav className="flex w-full items-center justify-between gap-3">
            <Heading>User Details</Heading>
            <Button route="/users">Back to users</Button>
          </nav>
          <section className="w-full rounded-lg bg-(--surface) p-8 text-center">
            <p className="text-[13px] text-(--muted)">
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
            <p className="mt-1 text-[13px] font-normal text-(--muted)">
              Review identity, account status, and access context.
            </p>
          </div>
        </nav>

        <section className="flex w-full flex-col gap-5 rounded-lg bg-(--surface) p-5 sm:p-6">
          <div className="flex flex-col gap-4 border-b border-(--line)/70 pb-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-(--lens-blue) text-xl font-semibold text-white">
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
              <h2 className="text-[20px] font-semibold text-(--ink)">
                {user.name || "Unnamed user"}
              </h2>
              <p className="mt-1 truncate text-[13px] text-(--muted)">
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
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-(--lens-blue-soft) text-(--lens-blue)">
                  <FontAwesomeIcon icon={item.icon} className="text-[12px]" />
                </span>
                <p className="text-[11px] uppercase tracking-wide text-(--muted)">
                  {item.label}
                </p>
                <p className="min-w-0 truncate text-[13px] text-(--ink)">
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
                  className="text-[12px] text-(--lens-blue)"
                />
                <h3 className="text-[13px] font-medium text-(--ink)">
                  Access
                </h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-(--muted)">
                    Role
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-[13px] text-(--ink)">
                    {user.roleName || "No role assigned"}
                    {canAssignRole && (
                      <button
                        type="button"
                        className="text-[12px] text-(--lens-blue) hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(setSelectedUser(user));
                          dispatch(setAssignUserRoleModal(true));
                        }}
                      >
                        {user.roleName ? "Change role" : "Assign role"}
                      </button>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-(--muted)">
                    Permissions
                  </p>
                  <p className="mt-1 text-[13px] text-(--ink)">
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
                  className="text-[12px] text-(--lens-blue)"
                />
                <h3 className="text-[13px] font-medium text-(--ink)">
                  Workspace
                </h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-(--muted)">
                    Labels
                  </p>
                  <p className="mt-1 text-[13px] text-(--ink)">
                    {user.labels?.length || 0}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-(--muted)">
                    Releases
                  </p>
                  <p className="mt-1 text-[13px] text-(--ink)">
                    {user.releases?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 rounded-md bg-white p-4 sm:grid-cols-2">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-(--muted)">
                Created
              </p>
              <p className="mt-1 text-[13px] text-(--ink)">
                {user.createdAt ? formatDate(user.createdAt, "DD/MM/YYYY HH:mm") : "—"}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-(--muted)">
                Last updated
              </p>
              <p className="mt-1 text-[13px] text-(--ink)">
                {user.updatedAt ? formatDate(user.updatedAt, "DD/MM/YYYY HH:mm") : "—"}
              </p>
            </div>
          </div>
        </section>
        <menu>
          <Button onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}>
            Back
          </Button>
        </menu>
      </main>
      <AssignUserRole />
    </UserLayout>
  );
};

export default UserDetailsPage;
