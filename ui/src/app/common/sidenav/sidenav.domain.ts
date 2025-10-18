export interface SidenavMenuItem {
  readonly label: string;
  readonly actionCallback: () => void;
}

export type SidenavItemMenu = SidenavMenuItem[];
