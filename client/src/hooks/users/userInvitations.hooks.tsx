import { useCallback, useState } from 'react';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'sonner';
import { usePagination } from '@/hooks/common/pagination.hooks';
import { useLazyFetchInvitationsQuery } from '@/state/api/apiQuerySlice';
import {
  useApproveInvitationMutation,
  useCreateBulkInvitationsMutation,
  useCreateInvitationMutation,
  useRevokeInvitationMutation,
} from '@/state/api/apiMutationSlice';
import { useAppDispatch } from '@/state/hooks';
import { setUserInvitationsList } from '@/state/features/userInvitationSlice';
import { useEffect } from 'react';

const parseEmailList = (raw: string): string[] => {
  const seen = new Set<string>();
  const out: string[] = [];

  for (const part of raw.split(/[\n,;\t]+/)) {
    const email = part.trim().toLowerCase();
    if (email && !seen.has(email)) {
      seen.add(email);
      out.push(email);
    }
  }

  return out.slice(0, 50);
};

const apiMessage = (err: unknown, fallback: string) =>
  (err as ErrorResponse)?.data?.message || fallback;

// FETCH USER INVITATIONS
export const useFetchUserInvitations = () => {
  const dispatch = useAppDispatch();

  const { page, size, totalCount, totalPages, setPage, setSize, setTotalCount, setTotalPages } = usePagination();

  const [fetchInvitations, { isFetching, data, isSuccess }] = useLazyFetchInvitationsQuery();

  useEffect(() => {
    if (isSuccess) {
      dispatch(setUserInvitationsList(data?.data?.rows));
      setTotalCount(data?.data?.totalCount);
      setTotalPages(data?.data?.totalPages);
    }
  }, [isSuccess, data, dispatch, setTotalCount, setTotalPages]);

  return { fetchInvitations, isFetching, page, size, totalCount, totalPages, setPage, setSize };
};

// CREATE USER INVITATIONS
export const useCreateUserInvitations = () => {
  const [createInvitation, createState] = useCreateInvitationMutation();
  const [createBulkInvitations, bulkState] = useCreateBulkInvitationsMutation();
  const [singleEmail, setSingleEmail] = useState('');
  const [bulkRaw, setBulkRaw] = useState('');

  const submitSingleInvite = useCallback(async () => {
    const email = singleEmail.trim().toLowerCase();
    if (!email) {
      toast.error('Enter an email address.');
      return false;
    }

    try {
      await createInvitation({ email }).unwrap();
      toast.success('Invitation sent.');
      setSingleEmail('');
      return true;
    } catch (err) {
      toast.error(apiMessage(err, 'Could not send invitation.'));
      return false;
    }
  }, [createInvitation, singleEmail]);

  const submitBulkInvite = useCallback(async () => {
    const emails = parseEmailList(bulkRaw);
    if (!emails.length) {
      toast.error('Add at least one email (one per line or comma-separated).');
      return false;
    }

    try {
      const res = await createBulkInvitations({ emails }).unwrap();
      const payload = res as {
        data?: { succeeded?: string[]; failed?: { email: string; reason: string }[] };
        message?: string;
      };
      const succeeded = payload.data?.succeeded?.length ?? 0;
      const failed = payload.data?.failed ?? [];

      toast.success(payload.message || `${succeeded} invitation(s) sent.`);
      if (failed.length) {
        toast.error(
          `${failed.length} failed: ${failed
            .slice(0, 3)
            .map((item) => item.email)
            .join(', ')}${failed.length > 3 ? '…' : ''}`,
        );
      }

      setBulkRaw('');
      return true;
    } catch (err) {
      toast.error(apiMessage(err, 'Bulk invite request failed.'));
      return false;
    }
  }, [bulkRaw, createBulkInvitations]);

  return {
    singleEmail,
    setSingleEmail,
    bulkRaw,
    setBulkRaw,
    submitSingleInvite,
    submitBulkInvite,
    isSubmittingSingle: createState.isLoading,
    isSubmittingBulk: bulkState.isLoading,
  };
};

export const useUserInvitationTableActions = ({
  onSuccess,
}: {
  onSuccess?: () => void;
} = {}) => {
  const [approveInvitation, approveState] = useApproveInvitationMutation();
  const [createInvitation, createState] = useCreateInvitationMutation();
  const [revokeInvitation, revokeState] = useRevokeInvitationMutation();

  const runOnSuccess = useCallback(() => {
    if (onSuccess) onSuccess();
  }, [onSuccess]);

  const handleApprove = useCallback(
    async (id: string) => {
      try {
        await approveInvitation(id).unwrap();
        toast.success('Invitation approved and email sent.');
        runOnSuccess();
      } catch (err) {
        toast.error(apiMessage(err, 'Could not approve invitation.'));
      }
    },
    [approveInvitation, runOnSuccess],
  );

  const handleRevoke = useCallback(
    async (id: string) => {
      try {
        await revokeInvitation(id).unwrap();
        toast.success('Invitation revoked.');
        runOnSuccess();
      } catch (err) {
        toast.error(apiMessage(err, 'Could not revoke invitation.'));
      }
    },
    [revokeInvitation, runOnSuccess],
  );

  const handleRetry = useCallback(
    async (email: string) => {
      try {
        await createInvitation({ email }).unwrap();
        toast.success('Invitation sent.');
        runOnSuccess();
      } catch (err) {
        toast.error(apiMessage(err, 'Could not resend invitation.'));
      }
    },
    [createInvitation, runOnSuccess],
  );

  return {
    handleApprove,
    handleRevoke,
    handleRetry,
    isApproving: approveState.isLoading,
    isRevoking: revokeState.isLoading,
    isRetrying: createState.isLoading,
  };
};
