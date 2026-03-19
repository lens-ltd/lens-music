import { tableActionClassName } from "@/constants/input.constants";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MouseEvent, ReactNode } from "react";
import { Link } from "react-router-dom";

export interface TableActionButtonProps {
    to?: string;
    onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
    className?: string;
    children: ReactNode;
    icon?: IconProp;
    iconClassName?: string;
}

const TableActionButton = ({ to = '#', onClick, className = tableActionClassName, children, icon, iconClassName = 'text-primary text-[12px]' }: TableActionButtonProps) => {
    return (
        <Link className={className} to={to} onClick={onClick}>
            {icon && <FontAwesomeIcon icon={icon} className={iconClassName} />}
            {children}
        </Link>
    );
};

export default TableActionButton;
