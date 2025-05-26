import {
  faChartLine,
  faFont,
  faRecordVinyl,
  faSitemap,
  faUserTie,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

export interface SidebarNavigation {
  title: string;
  path: string;
  icon: IconDefinition;
  subCategories?: SidebarNavigation[];
}

export const sidebarNavigation: SidebarNavigation[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: faChartLine,
  },
  {
    title: 'Artists',
    path: '/artists',
    icon: faUserTie,
  },
  {
    title: 'Releases',
    path: '/releases',
    icon: faRecordVinyl,
  },
  {
    title: 'Lyrics',
    path: '/lyrics',
    icon: faFont,
  },
  {
    title: 'Labels',
    path: '/labels',
    icon: faSitemap,
  },
];
