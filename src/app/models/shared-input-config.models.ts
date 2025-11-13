import { MenuOption } from './shared-options-input.models';


export interface SharedInputConfig {
  requestUrl: string;
  autocompleteUrl?: string;
  mapper: (data: any[]) => MenuOption[];
  uiConfig: SharedInputUIConfig;
}


export interface SharedInputUIConfig {
icon?: string | null;
    placeholder: string;
    titleMenuOptions: string;
    allowAutoComplete: boolean;
  defaultValue?: MenuOption;
    title?: string;
}
