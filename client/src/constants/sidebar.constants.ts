import { faEnvelope, faFileLines } from '@fortawesome/free-regular-svg-icons';
import {
  faChartLine,
  faStore,
  faUser,
  faUserGroup,
  faUserTie,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { PERMISSIONS } from './permission.constants';
import { ROLES } from './role.constants';

export interface SidebarNavigation {
  title: string;
  path: string;
  icon: IconDefinition;
  /** User must have at least one of these permission names (API strings). */
  requiredAnyPermissions?: string[];
  adminOnly?: boolean;
  subCategories?: SidebarNavigation[];
}

const sidebarNavigationDefinition: SidebarNavigation[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: faChartLine,
  },
  {
    title: 'Releases',
    path: '/releases',
    icon: faFileLines,
  },
  {
    title: 'Contributors',
    path: '/contributors',
    icon: faUserGroup,
  },
  {
    title: 'Stores',
    path: '/stores',
    icon: faStore,
    adminOnly: true,
  },
  {
    title: 'Users',
    path: '/users',
    icon: faUser,
    subCategories: [
      {
        title: 'Users',
        path: '/users',
        icon: faUser,
        requiredAnyPermissions: [PERMISSIONS.READ_USER],
      },
      {
        title: 'Invitations',
        path: '/users/invitations',
        icon: faEnvelope,
        requiredAnyPermissions: [PERMISSIONS.CREATE_USER],
      },
    ],
  },
  {
    title: 'Roles',
    path: '/roles',
    icon: faUserTie,
    requiredAnyPermissions: [PERMISSIONS.CREATE_USER],
  },
];

function userHasAny(
  permissions: string[] | undefined,
  required?: string[],
): boolean {
  if (!required?.length) return true;
  const set = new Set(permissions ?? []);
  return required.some((p) => set.has(p));
}

function userIsAdmin(role: string | undefined): boolean {
  return role === ROLES.ADMIN;
}

/** Returns nav items the user may see; drops parents whose sub-items are all hidden. */
export function getSidebarNavigationForUser(
  permissions: string[] | undefined,
  role?: string,
): SidebarNavigation[] {
  return sidebarNavigationDefinition
    .map((item) => {
      if (item.adminOnly && !userIsAdmin(role)) return null;
      if (item.subCategories?.length) {
        const subs = item.subCategories.filter((sub) =>
          (!sub.adminOnly || userIsAdmin(role)) &&
          userHasAny(permissions, sub.requiredAnyPermissions),
        );
        if (subs.length === 0) return null;
        return { ...item, subCategories: subs };
      }
      if (item.adminOnly && !userIsAdmin(role)) return null;
      if (!userHasAny(permissions, item.requiredAnyPermissions)) return null;
      return item;
    })
    .filter((item): item is SidebarNavigation => item !== null);
}
