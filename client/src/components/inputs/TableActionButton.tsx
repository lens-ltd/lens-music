import { tableActionClassName } from "@/constants/input.constants";
import { MouseEvent, ReactNode } from "react";
import { Link } from "react-router-dom";

import type { IconType } from 'react-icons';
import { Icon } from '@/components/ui/icon';

export interface TableActionButtonProps {
    to?: string;
    onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
    className?: string;
    children: ReactNode;
    icon?: IconType;
    iconClassName?: string;
}

const TableActionButton = ({ to = '#', onClick, className = tableActionClassName, children, icon, iconClassName = 'size-4 text-(--muted)' }: TableActionButtonProps) => {
    return (
        <Link className={className} to={to} onClick={onClick}>
            {icon && <Icon icon={icon} className={iconClassName} />}
            {children}
        </Link>
    );
};

export default TableActionButton;
