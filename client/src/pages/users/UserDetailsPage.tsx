import { BackButton, PageFooter } from "@/components/layout/PageFooter";
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
import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { LuGlobe, LuIdCard, LuMail, LuPhone, LuShield, LuUser } from 'react-icons/lu';
import { Icon } from '@/components/ui/icon';

const detailItems = [
  { key: "name", label: "Full name", icon: LuUser },
  { key: "email", label: "Email address", icon: LuMail },
  { key: "phoneNumber", label: "Phone number", icon: LuPhone },
  { key: "country", label: "Country", icon: LuGlobe },
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
          <Loader className="text-(--signal)" />
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
          <Heading>User details</Heading>
          <section className="w-full card-framed p-8 text-center">
            <p className="text-[13px] text-(--muted)">{message}</p>
          </section>
          <PageFooter back={<BackButton route="/users">Back to users</BackButton>} />
        </main>
      </UserLayout>
    );
  }

  if (!user || (isSuccess && user.id !== id)) {
    return (
      <UserLayout>
        <main className="flex w-full flex-col gap-4">
          <Heading>User details</Heading>
          <section className="w-full card-framed p-8 text-center">
            <p className="text-[13px] text-(--muted)">
              User not found.
            </p>
          </section>
          <PageFooter back={<BackButton route="/users">Back to users</BackButton>} />
        </main>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <main className="flex w-full flex-col gap-5">
        <nav className="flex w-full items-center justify-between gap-3">
          <div>
            <Heading>User details</Heading>
            <p className="mt-1 text-[13px] font-normal text-(--muted)">
              Review identity, account status, and access context.
            </p>
          </div>
        </nav>

        <section className="flex w-full flex-col gap-5 card-framed p-5 sm:p-6">
          <div className="flex flex-col gap-4 pb-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-(--signal) text-xl font-semibold text-white">
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
                className="grid gap-3 rounded-md bg-(--surface) p-4 sm:grid-cols-[32px_140px_minmax(0,1fr)] sm:items-center"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-(--signal-soft) text-(--signal)">
                  <Icon icon={item.icon} className="text-[12px]" />
                </span>
                <p className="text-xs text-(--muted)">
                  {item.label}
                </p>
                <p className="min-w-0 truncate text-[13px] text-(--ink)">
                  {user[item.key] || "—"}
                </p>
              </div>
            ))}
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <div className="rounded-md bg-(--surface) p-4">
              <div className="mb-3 flex items-center gap-2">
                <LuShield
                 
                  className="text-[12px] text-(--signal)" />
                <h3 className="text-[13px] font-medium text-(--ink)">
                  Access
                </h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-(--muted)">
                    Role
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-[13px] text-(--ink)">
                    {user.roleName || "No role assigned"}
                    {canAssignRole && (
                      <button
                        type="button"
                        className="text-[12px] text-(--signal) hover:underline"
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
                  <p className="text-xs text-(--muted)">
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

            <div className="rounded-md bg-(--surface) p-4">
              <div className="mb-3 flex items-center gap-2">
                <LuIdCard
                 
                  className="text-[12px] text-(--signal)" />
                <h3 className="text-[13px] font-medium text-(--ink)">
                  Workspace
                </h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-(--muted)">
                    Labels
                  </p>
                  <p className="mt-1 text-[13px] text-(--ink)">
                    {user.labels?.length || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-(--muted)">
                    Releases
                  </p>
                  <p className="mt-1 text-[13px] text-(--ink)">
                    {user.releases?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 rounded-md bg-(--surface) p-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-(--muted)">
                Created
              </p>
              <p className="mt-1 text-[13px] text-(--ink)">
                {user.createdAt ? formatDate(user.createdAt, "DD/MM/YYYY HH:mm") : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-(--muted)">
                Last updated
              </p>
              <p className="mt-1 text-[13px] text-(--ink)">
                {user.updatedAt ? formatDate(user.updatedAt, "DD/MM/YYYY HH:mm") : "—"}
              </p>
            </div>
          </div>
        </section>
        <PageFooter
          back={
            <BackButton onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }}>
              Back to users
            </BackButton>
          }
        />
      </main>
      <AssignUserRole />
    </UserLayout>
  );
};

export default UserDetailsPage;
