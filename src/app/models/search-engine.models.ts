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
  imagePath?: string;
  searchEngine: TypeTabSearchEngine;
  url?: string;
  htmlUrl?: string;
  partialPath?: string;
}

export interface SearchEngine {
  tabs: TabsSearchEngine[];
  showTabs: boolean;
  defaultTab: TypeTabSearchEngine;
}
