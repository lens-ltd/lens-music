import Button from "@/components/inputs/Button";
import { BackButton, PageFooter } from "@/components/layout/PageFooter";
import SectionCard from "@/components/layout/SectionCard";
import { KeyValueList, KeyValuePair } from "@/components/inputs/KeyValuePair";
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

import { LuGlobe, LuMail, LuPhone, LuUser } from 'react-icons/lu';
import { formatPhone } from "@/utils/phone.helper";

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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-(--signal) text-xl font-medium text-white">
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
              <h2 className="text-[20px] text-(--ink)">
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

        </section>

        <SectionCard title="Profile" description="Identity and contact details.">
          <KeyValueList>
            {detailItems.map((item) => (
              <KeyValuePair
                key={item.key}
                keyText={item.key}
                label={item.label}
                icon={item.icon}
                valueText={
                  item.key === "phoneNumber"
                    ? formatPhone(user.phoneNumber)
                    : user[item.key]
                }
              />
            ))}
          </KeyValueList>
        </SectionCard>

        <SectionCard
          title="Access"
          description="Role and permissions granted to this user."
          action={
            canAssignRole && (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setSelectedUser(user));
                  dispatch(setAssignUserRoleModal(true));
                }}
              >
                {user.roleName ? "Change role" : "Assign role"}
              </Button>
            )
          }
        >
          <KeyValueList>
            <KeyValuePair keyText="role" label="Role" valueText={capitalizeString(user.roleName)} emptyText="No role assigned" />
            <KeyValuePair
              keyText="permissions"
              label="Permissions"
              valueText={
                user.permissions?.length
                  ? `${user.permissions.length} permission${user.permissions.length === 1 ? "" : "s"}`
                  : undefined
              }
            />
          </KeyValueList>
        </SectionCard>

        <SectionCard title="Workspace" description="Content this user owns and when the account changed.">
          <KeyValueList>
            <KeyValuePair keyText="labels" label="Labels" valueText={user.labels?.length || 0} />
            <KeyValuePair keyText="releases" label="Releases" valueText={user.releases?.length || 0} />
            <KeyValuePair
              keyText="created"
              label="Created"
              valueText={user.createdAt ? formatDate(user.createdAt, "DD/MM/YYYY HH:mm") : undefined}
            />
            <KeyValuePair
              keyText="lastUpdated"
              label="Last updated"
              valueText={user.updatedAt ? formatDate(user.updatedAt, "DD/MM/YYYY HH:mm") : undefined}
            />
          </KeyValueList>
        </SectionCard>
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
