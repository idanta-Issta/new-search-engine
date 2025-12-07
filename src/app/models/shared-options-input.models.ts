export interface MenuOption {
  label: string;
  value?: string;
  note?: string | null;
  key?: string;
  icon?: string;
  isPromoted?: boolean;
  isPlaceId?: boolean;
  dport?: string | number | null;
  code?: string | null;
}