export enum ETypeTravel {
  VACATION_PACKAGES = 'VACATION_PACKAGES',
  CRUISES = 'CRUISES',
  SKI_PACKAGES = 'SKI_PACKAGES',
  CAR_RENTAL_ABROAD = 'CAR_RENTAL_ABROAD',
  SPORT_PACKAGES = 'SPORT_PACKAGES',
  ORGANIZED_TOURS = 'ORGANIZED_TOURS',
  VACATION_IN_ISRAEL = 'VACATION_IN_ISRAEL',
  HOTELS_ABROAD = 'HOTELS_ABROAD',
  FLIGHTS = 'FLIGHTS',
  FLIGHTS_PACKAGES = 'FLIGHTS_PACKAGES',
  LAST_FAST_MINUTE_DEALS = 'LAST_FAST_MINUTE_DEALS',
  WHATSAPP = 'WHATSAPP'
}

export interface TypeTabSearchEngine {
  typeTravel: ETypeTravel;
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
