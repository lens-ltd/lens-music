import { faEnvelope, faFileLines } from '@fortawesome/free-regular-svg-icons';
import {
  faChartLine,
  faClipboardCheck,
  faStore,
  faUser,
  faUserGroup,
  faUserTie,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { PERMISSIONS } from './permission.constants';

export interface SidebarNavigation {
  title: string;
  path: string;
  icon: IconDefinition;
  /** User must have at least one of these permission names (API strings). */
  requiredAnyPermissions?: string[];
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
    title: 'Review',
    path: '/releases/review',
    icon: faClipboardCheck,
    subCategories: [
      {
        title: 'Releases',
        path: '/releases/review',
        icon: faFileLines,
        requiredAnyPermissions: [PERMISSIONS.REVIEW_RELEASE],
      },
      {
        title: 'Contributors',
        path: '/contributors/verification',
        icon: faUserGroup,
        requiredAnyPermissions: [PERMISSIONS.VERIFY_CONTRIBUTOR],
      },
    ],
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
    requiredAnyPermissions: [PERMISSIONS.UPDATE_STORE],
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
        requiredAnyPermissions: [PERMISSIONS.CREATE_INVITATION, PERMISSIONS.READ_INVITATION],
      },
    ],
  },
  {
    title: 'Roles',
    path: '/roles',
    icon: faUserTie,
    requiredAnyPermissions: [PERMISSIONS.READ_ROLE],
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

/** Returns nav items the user may see; drops parents whose sub-items are all hidden. */
export function getSidebarNavigationForUser(
  permissions: string[] | undefined,
): SidebarNavigation[] {
  return sidebarNavigationDefinition
    .map((item) => {
      if (item.subCategories?.length) {
        const subs = item.subCategories.filter((sub) =>
          userHasAny(permissions, sub.requiredAnyPermissions),
        );
        if (subs.length === 0) return null;
        return { ...item, subCategories: subs };
      }
      if (!userHasAny(permissions, item.requiredAnyPermissions)) return null;
      return item;
    })
    .filter((item): item is SidebarNavigation => item !== null);
}
