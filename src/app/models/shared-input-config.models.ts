import { MenuOption } from './shared-options-input.models';
import { Type } from '@angular/core';

export interface SharedInputConfig<T = any> {
  requestUrl?: string;
  autocompleteUrl?: string;
  mapper?: (data: any) => any;
  uiConfig: {
    title: string;
    placeholder?: string;
    titleMenuOptions?: string;
    icon?: string;
    allowAutoComplete?: boolean;
    defaultValue?: any;
  };
  dataConfig?: T;
  component?: Type<any> | (() => Promise<Type<any>>);
}




export interface SharedInputUIConfig {
  title: string;
  placeholder?: string | null;
  titleMenuOptions?: string | null;
  icon?: string | null;
  allowAutoComplete?: boolean;
  defaultValue?: any;
}
