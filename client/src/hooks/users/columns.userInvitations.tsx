import CustomTooltip from '@/components/inputs/CustomTooltip';
import { capitalizeString, formatDate, getStatusBackgroundColor } from '@/utils/strings.helper';
import { UserInvitation } from '@/types/models/invitation.types';
import { faBan, faCircleCheck, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

export const useUserInvitationColumns = ({
  onApprove,
  onRevoke,
  onRetry,
  isApproving,
  isRevoking,
  isRetrying,
}: {
  onApprove: (id: string) => void;
  onRevoke: (id: string) => void;
  onRetry: (email: string) => void;
  isApproving: boolean;
  isRevoking: boolean;
  isRetrying: boolean;
}) => {
  const userInvitationColumns = useMemo<ColumnDef<UserInvitation>[]>(
    () => [
      {
        header: 'No',
        accessorKey: 'no',
        cell: ({ row }) => row.index + 1,
      },
      {
        header: 'Name',
        accessorKey: 'name',
        cell: ({ row }) => row.original.name || '—',
      },
      {
        header: 'Email',
        accessorKey: 'email',
      },
      {
        header: 'Phone',
        accessorKey: 'phoneNumber',
        cell: ({ row }) => row.original.phoneNumber || '—',
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => <span className={getStatusBackgroundColor(row?.original?.status)}>{capitalizeString(row?.original?.status)}</span>,
      },
      {
        header: 'Expires on',
        accessorKey: 'expiresAt',
        cell: ({ row }) =>
          row.original.expiresAt
            ? formatDate(row.original.expiresAt, 'DD/MM/YYYY HH:mm')
            : '—',
      },
      {
        header: 'Completed on',
        accessorKey: 'completedAt',
        cell: ({ row }) =>
          row?.original?.completedAt ? formatDate(String(row.original.completedAt), 'DD/MM/YYYY HH:mm') : '—',
      },
      {
        header: 'Created on',
        accessorKey: 'createdAt',
        cell: ({ row }) => formatDate(row?.original?.createdAt, 'DD/MM/YYYY HH:mm'),
      },
      {
        header: 'Actions',
        accessorKey: 'actions',
        cell: ({ row }) => {
          const invitation = row.original;

          return (
            <menu className="w-full flex items-center gap-2">
              {invitation.status === 'REQUESTED' && (
                <CustomTooltip label="Approve request">
                  <button
                    type="button"
                    className="p-2 rounded-full cursor-pointer bg-green-700 text-white transition-all duration-200 hover:scale-[1.01] disabled:opacity-50"
                    disabled={isApproving}
                    onClick={() => onApprove(invitation.id)}
                  >
                    <FontAwesomeIcon icon={faCircleCheck} className="text-[12px]" />
                  </button>
                </CustomTooltip>
              )}
              {invitation.status === 'PENDING' && (
                <CustomTooltip label="Revoke invitation">
                  <button
                    type="button"
                    className="p-2 rounded-full cursor-pointer bg-red-600 text-white transition-all duration-200 hover:scale-[1.01] disabled:opacity-50"
                    disabled={isRevoking}
                    onClick={() => onRevoke(invitation.id)}
                  >
                    <FontAwesomeIcon icon={faBan} className="text-[12px]" />
                  </button>
                </CustomTooltip>
              )}
              {invitation.status === 'REQUESTED' && (
                <CustomTooltip label="Decline request">
                  <button
                    type="button"
                    className="p-2 rounded-full cursor-pointer bg-red-600 text-white transition-all duration-200 hover:scale-[1.01] disabled:opacity-50"
                    disabled={isRevoking}
                    onClick={() => onRevoke(invitation.id)}
                  >
                    <FontAwesomeIcon icon={faBan} className="text-[12px]" />
                  </button>
                </CustomTooltip>
              )}
              {invitation.status === 'FAILED' && (
                <CustomTooltip label="Resend invitation">
                  <button
                    type="button"
                    className="p-2 rounded-full cursor-pointer bg-[color:var(--lens-blue)] text-white transition-all duration-200 hover:scale-[1.01] disabled:opacity-50"
                    disabled={isRetrying}
                    onClick={() => onRetry(invitation.email)}
                  >
                    <FontAwesomeIcon
                      icon={faRotateRight}
                      className="text-[12px]"
                    />
                  </button>
                </CustomTooltip>
              )}
            </menu>
          );
        },
      },
    ],
    [isApproving, isRetrying, isRevoking, onApprove, onRetry, onRevoke],
  );

  return { userInvitationColumns };
};
