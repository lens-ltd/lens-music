import { PERMISSIONS } from './permission.constants';

import { LuBriefcase, LuChartLine, LuClipboardCheck, LuFileText, LuMail, LuStore, LuUser, LuUsers } from 'react-icons/lu';
import type { IconType } from 'react-icons';

export interface SidebarNavigation {
  title: string;
  path: string;
  icon: IconType;
  /** User must have at least one of these permission names (API strings). */
  requiredAnyPermissions?: string[];
  subCategories?: SidebarNavigation[];
}

const sidebarNavigationDefinition: SidebarNavigation[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: LuChartLine,
  },
  {
    title: 'Releases',
    path: '/releases',
    icon: LuFileText,
  },
  {
    title: 'Review',
    path: '/releases/review',
    icon: LuClipboardCheck,
    subCategories: [
      {
        title: 'Releases',
        path: '/releases/review',
        icon: LuFileText,
        requiredAnyPermissions: [PERMISSIONS.REVIEW_RELEASE],
      },
      {
        title: 'Contributors',
        path: '/contributors/verification',
        icon: LuUsers,
        requiredAnyPermissions: [PERMISSIONS.VERIFY_CONTRIBUTOR],
      },
    ],
  },
  {
    title: 'Contributors',
    path: '/contributors',
    icon: LuUsers,
  },
  {
    title: 'Stores',
    path: '/stores',
    icon: LuStore,
    requiredAnyPermissions: [PERMISSIONS.UPDATE_STORE],
  },
  {
    title: 'Users',
    path: '/users',
    icon: LuUser,
    subCategories: [
      {
        title: 'Users',
        path: '/users',
        icon: LuUser,
        requiredAnyPermissions: [PERMISSIONS.READ_USER],
      },
      {
        title: 'Invitations',
        path: '/users/invitations',
        icon: LuMail,
        requiredAnyPermissions: [PERMISSIONS.CREATE_INVITATION, PERMISSIONS.READ_INVITATION],
      },
    ],
  },
  {
    title: 'Roles',
    path: '/roles',
    icon: LuBriefcase,
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
