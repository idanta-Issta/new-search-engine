export const CUSTOM_MENU_HEADERS = {
  FLIGHTS_PRICE_MAP: {
    component: () => import('../components/issta-engine/shared/buttons/custom-menu-header-button/custom-menu-header-button.component').then(m => m.CustomMenuHeaderButtonComponent),
    config: {
      text: 'חיפוש בעזרת מפת מחירים',
      label: 'כל היעדים',
      value: 'search-with-map-price',
      icon: 'icon-Calender1'
    }
  },
  EILAT_ALL_HOTELS: {
    component: () => import('../components/issta-engine/shared/buttons/custom-menu-header-button/custom-menu-header-button.component').then(m => m.CustomMenuHeaderButtonComponent),
    config: {
      text: 'כל המלונות באילת',
      label: 'כל המלונות באילת',
      value: 'all-hotels-eilat',
      icon: 'icon-Calender1'
    }
  }
} as const;
