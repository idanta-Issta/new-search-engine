import { MenuOption } from './shared-options-input.models';


export interface SharedInputConfig<TData = any> {
  requestUrl: string;
  autocompleteUrl?: string;
  mapper: (data: any[]) => MenuOption[];
  uiConfig: SharedInputUIConfig;
  dataConfig?: TData;
}



export interface SharedInputUIConfig {
icon?: string | null;
    placeholder: string | null;
    titleMenuOptions: string |null;
    allowAutoComplete: boolean | false;
  defaultValue?: MenuOption;
    title?: string | null;
}
