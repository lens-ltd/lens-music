import CustomPopover from "@/components/inputs/CustomPopover";
import TableActionButton from "@/components/inputs/TableActionButton";
import { getCountryName } from "@/constants/countries.constants";
import { ellipsisHClassName } from "@/constants/input.constants";
import { Contributor } from "@/types/models/contributor.types";
import { capitalizeString, formatDate, getStatusBackgroundColor } from "@/utils/strings.helper";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faCircleInfo, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

export const useContributorColumns = () => {
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
            header: 'Country',
            accessorKey: 'country',
            cell: ({ row }) => getCountryName(row?.original?.country),
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
                                Update
                            </TableActionButton>
                        </menu>
                    </CustomPopover>
                );
            },
        }
    ], []);

    return { contributorColumns };
};