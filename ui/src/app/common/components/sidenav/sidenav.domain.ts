export interface SidenavMenuItem {
  readonly label: string;
  readonly actionCallback: () => void;
}

export type SidenavItemMenu = SidenavMenuItem[];

export interface StaticNavItem {
  label: string;
  routerLinkParam: string | string[];
  iconName?: string;
}
