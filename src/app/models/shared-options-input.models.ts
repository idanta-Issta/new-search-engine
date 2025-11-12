export interface MenuOption {
  label: string;
  note?: string | null; // 👈 תוסיף null לטייפ
  key?: string;
  icon?: string;
  isPromoted?: boolean;
}

export interface SharedOptionsInput {
  icon?: string;
  placeholder?: string;
  options?: MenuOption[];
  titleMenuOptions?: string;
  allowAutoComplete?: boolean;     
}
