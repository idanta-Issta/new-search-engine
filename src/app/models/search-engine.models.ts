import { ETypeSearchEngine } from '../enums/ETypeSearchEngine';


export interface TypeTabSearchEngine {
  typeTravel: ETypeSearchEngine;
  isPartial: boolean;
  partialPath?: string;
  contentTF?: any;
}

export interface TabsSearchEngine {
  title: string;
  icon?: string;
  image?: string;
  hasIcon: boolean;
  searchEngine: TypeTabSearchEngine;
}

export interface SearchEngine {
  tabs: TabsSearchEngine[];
  showTabs: boolean;
  defaultTab: TypeTabSearchEngine;
}
