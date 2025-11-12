import { MenuOption } from '../models/shared-options-input.models';

export interface SharedInputConfig {
  requestUrl: string;
  autocompleteUrl?: string;
  mapper: (data: any[]) => MenuOption[];
  uiConfig: {
    icon: string;
    placeholder: string;
    titleMenuOptions: string;
    allowAutoComplete: boolean;
  };
}
