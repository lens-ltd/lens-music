import { faEnvelope, faFileLines } from "@fortawesome/free-regular-svg-icons";
import {
  faChartLine,
  faUser,
  faUserGroup,
  faUserTie,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

export interface SidebarNavigation {
  title: string;
  path: string;
  icon: IconDefinition;
  subCategories?: SidebarNavigation[];
}

export const sidebarNavigation: SidebarNavigation[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: faChartLine,
  },
  {
    title: "Releases",
    path: "/releases",
    icon: faFileLines,
  },
  {
    title: "Contributors",
    path: "/contributors",
    icon: faUserGroup,
  },
  {
    title: "Users",
    path: "/users",
    icon: faUser,
    subCategories: [
      {
        title: "Users",
        path: "/users",
        icon: faUser,
      },
      {
        title: "Invitations",
        path: "/users/invitations",
        icon: faEnvelope,
      },
    ],
  },
  {
    title: "Roles",
    path: "/roles",
    icon: faUserTie,
  },
];
