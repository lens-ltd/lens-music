import {
  faFont,
  faHome,
  faRecordVinyl,
  faSitemap,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons';

export const sidebarNavigation = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: faHome,
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
