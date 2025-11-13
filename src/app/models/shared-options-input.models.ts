export interface MenuOption {
  label: string;
  note?: string | null; // 👈 תוסיף null לטייפ
  key?: string;
  icon?: string;
  isPromoted?: boolean;
}