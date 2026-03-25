import Button from '@/components/inputs/Button';
import Select from '@/components/inputs/Select';
import Table from '@/components/table/Table';
import { Heading } from '@/components/text/Headings';
import { INVITATION_STATUS_OPTIONS } from '@/constants/invitation.constants';
import UserLayout from '@/containers/UserLayout';
import { useUserInvitationColumns } from '@/hooks/users/columns.userInvitations';
import {
  useFetchUserInvitations,
  useUserInvitationTableActions,
} from '@/hooks/users/userInvitations.hooks';
import { useAppSelector } from '@/state/hooks';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useCallback, useEffect, useState } from 'react';

const UserInvitationsPage = () => {
  // STATE
  const { userInvitationsList } = useAppSelector((state) => state.userInvitation);
  const [statusFilter, setStatusFilter] = useState('');

  // FETCH INVITATIONS
  const {
    fetchInvitations,
    isFetching,
    page,
    size,
    totalCount,
    totalPages,
    setPage,
    setSize,
  } = useFetchUserInvitations();

  const refreshInvitations = useCallback(() => {
    fetchInvitations({ page, size, ...(statusFilter ? { status: statusFilter } : {}) });
  }, [fetchInvitations, page, size, statusFilter]);

  // TABLE ACTIONS
  const {
    handleApprove,
    handleRevoke,
    handleRetry,
    isApproving,
    isRevoking,
    isRetrying,
  } = useUserInvitationTableActions({
    onSuccess: refreshInvitations,
  });

  // FETCH INVITATIONS
  useEffect(() => {
    refreshInvitations();
  }, [refreshInvitations]);

  // COLUMNS
  const { userInvitationColumns } = useUserInvitationColumns({
    onApprove: (id) => void handleApprove(id),
    onRevoke: (id) => void handleRevoke(id),
    onRetry: (email) => void handleRetry(email),
    isApproving,
    isRevoking,
    isRetrying,
  });

  return (
    <UserLayout>
      <main className="w-full flex flex-col gap-4">
        <nav className="w-full flex items-center gap-3 justify-between">
          <div>
            <Heading>User Invitations</Heading>
            <p className="text-[13px] text-[color:var(--lens-ink)]/60 font-normal mt-1">
              Track invitation status and manage pending access requests.
            </p>
          </div>
          <Button icon={faPlus} primary route="/users/invitations/create">
            Create invitation
          </Button>
        </nav>

        <section className="w-full flex flex-col gap-3">
          <div className="w-full max-w-[220px]">
            <Select
              label="Status"
              options={INVITATION_STATUS_OPTIONS.map((option) => ({
                label: option.label,
                value: option.value,
              }))}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Filter by status"
            />
          </div>

          <Table
            columns={userInvitationColumns}
            data={userInvitationsList}
            page={page}
            size={size}
            totalCount={totalCount}
            totalPages={totalPages}
            setPage={setPage}
            setSize={setSize}
            isLoading={isFetching}
            noDataMessage="No invitations match this filter."
          />
        </section>
      </main>
    </UserLayout>
  );
};

export default UserInvitationsPage;
