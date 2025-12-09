import { MenuOption } from './shared-options-input.models';
import { Type } from '@angular/core';

export interface CustomMenuHeaderAction {
  label: string;
  icon?: string;
  value: string;
  displayValue: string;
}

export interface CustomMenuHeaderConfig {
  text: string;
  label?: string;
  value?: string;
  icon?: string;
}

export interface SharedInputConfig<T = any> {
  requestUrl?: string;
  autocompleteUrl?: string;
  mapper?: (data: any, dataConfig?: any) => any;
  listMenuOption?: MenuOption[];
  excludeValues?: string[];
  isDisabled?: boolean;
  uiConfig: {
    title: string;
    placeholder?: string;
    titleMenuOptions?: string;
    icon?: string;
    allowAutoComplete?: boolean;
    defaultValue?: any;
    isBoldIcon?: boolean;
  };
  dataConfig?: T;
  component?: Type<any> | (() => Promise<Type<any>>);
  customMenuHeaderComponent?: Type<any> | (() => Promise<Type<any>>);
  customMenuHeaderConfig?: CustomMenuHeaderConfig;
}




export interface SharedInputUIConfig {
  title: string;
  placeholder?: string | null;
  titleMenuOptions?: string | null;
  icon?: string | null;
  allowAutoComplete?: boolean;
  defaultValue?: any;
  isBoldIcon?: boolean;
}
