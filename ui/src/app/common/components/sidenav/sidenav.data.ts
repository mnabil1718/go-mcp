import { StaticNavItem } from './sidenav.domain';

export const staticNavigations: StaticNavItem[] = [
  {
    label: 'New Chat',
    routerLinkParam: '/',
    iconName: 'edit',
  },
  {
    label: 'Resume Builder',
    routerLinkParam: '/r',
    iconName: 'article_person',
  },
];
