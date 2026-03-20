import CustomPopover from "@/components/inputs/CustomPopover";
import TableActionButton from "@/components/inputs/TableActionButton";
import { ellipsisHClassName } from "@/constants/input.constants";
import { setDeleteContributorModal, setSelectedContributor } from "@/state/features/contributorSlice";
import { useAppDispatch } from "@/state/hooks";
import { Contributor, ContributorType } from "@/types/models/contributor.types";
import { capitalizeString, formatDate, getStatusBackgroundColor } from "@/utils/strings.helper";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faCircleInfo, faEllipsisH, faTrash, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

// CONTRIBUTOR COLUMNS
export const useContributorColumns = () => {

    // STATE
    const dispatch = useAppDispatch();

    const contributorColumns = useMemo<ColumnDef<Contributor>[]>(() => [
        {
            header: 'Name',
            accessorKey: 'name',
            cell: ({ row }) => row?.original?.displayName || row?.original?.name,
        },
        {
            header: 'Email',
            accessorKey: 'email',
        },
        {
            header: 'Phone Number',
            accessorKey: 'phoneNumber',
        },
        {
            header: 'Verification Status',
            accessorKey: 'verificationStatus',
            cell: ({ row }) =>
                row?.original?.verificationStatus ? <span className={getStatusBackgroundColor(row?.original?.verificationStatus)}>{capitalizeString(row?.original?.verificationStatus)}</span> : '-',
        },
        {
            header: 'Type',
            accessorKey: 'type',
            cell: ({ row }) => capitalizeString(row?.original?.type as ContributorType),
        },
        {
            header: 'Last Updated',
            accessorKey: 'updatedAt',
            cell: ({ row }) =>
                row?.original?.updatedAt
                    ? formatDate(row?.original?.updatedAt, 'DD/MM/YYYY HH:mm')
                    : '-',
        },
        {
            header: 'Actions',
            accessorKey: 'actions',
            cell: ({ row }) => {
                return (
                    <CustomPopover trigger={<FontAwesomeIcon icon={faEllipsisH} className={ellipsisHClassName} />}>
                        <menu className="w-full flex flex-col items-center gap-1">
                            <TableActionButton icon={faCircleInfo} to={`/contributors/${row?.original?.id}`}>
                                View details
                            </TableActionButton>
                            <TableActionButton icon={faPenToSquare} to={`/contributors/${row?.original?.id}/update`}>
                                Manage
                            </TableActionButton>
                           {[ContributorType.GROUP].includes(row?.original?.type as ContributorType) && <TableActionButton icon={faUsers} to={`/contributors/${row?.original?.id}/memberships`}>
                                Manage memberships
                            </TableActionButton>}
                            <TableActionButton icon={faTrash} iconClassName="text-red-700" onClick={(e) => {
                                e.preventDefault();
                                if (row?.original?.id) {
                                    dispatch(setSelectedContributor(row?.original));
                                    dispatch(setDeleteContributorModal(true));
                                }
                            }}>
                                Delete
                            </TableActionButton>
                        </menu>
                    </CustomPopover>
                );
            },
        }
    ], [dispatch]);

    return { contributorColumns };
};