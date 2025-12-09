import { ChoiceOption } from '../components/issta-engine/shared/header/header-choices/header-choices.component';
import { DropdownOption } from '../components/issta-engine/shared/header/header-dropdown/header-dropdown.component';
import { FooterOption } from '../components/issta-engine/shared/footer/footer-options/footer-options.component';
import { TEXTS, VALUES } from '../constants/app.constants';
import { InputConfig } from '../models/input-config.model';
import { ESharedInputType } from '../enums/ESharedInputType';
import { EInputSize } from '../enums/EInputSize';
import { EDropdownPosition } from '../enums/EDropdownPosition';
import { ETypeSearchEngine } from '../enums/ETypeSearchEngine';
import { EProductCode } from '../enums/EProductCode';

export interface PopularLink {
  label: string;
  link: string;
}

export interface SearchEngineConfig {
  engineType: ETypeSearchEngine;
  productCode: string;
  customInputsComponent?: any;
  header: {
    title: string;
    choices?: ChoiceOption[];
    routeType?: DropdownOption[];
    classOptions?: DropdownOption[];
  };
  footer: {
    infoItems?: string[];
    options?: FooterOption[];
    popular?: PopularLink[];
  };
  inputs?: InputConfig[];
}

export const FLIGHTS_CONFIG: SearchEngineConfig = {
  engineType: ETypeSearchEngine.FLIGHTS,
  productCode: EProductCode.FLIGHTS,
  header: {
    title: TEXTS.HEADER.FLIGHTS_TITLE,
    choices: [
      { label: TEXTS.CHOICES.FLIGHT_ONLY, value: VALUES.CHOICES.FLIGHT_ONLY, isDefault: true },
      { label: TEXTS.CHOICES.FLIGHT_HOTEL, value: VALUES.CHOICES.FLIGHT_HOTEL, promotionText: TEXTS.PROMOTION.BEST_DEAL, 
        useEngine: ETypeSearchEngine.HOTELS_ABROAD }
    ],
    routeType: [
      { label: TEXTS.TRIP_TYPE.ROUND_TRIP, value: VALUES.TRIP_TYPE.ROUND_TRIP, isDefault: true},
      { label: TEXTS.TRIP_TYPE.ONE_WAY, value: VALUES.TRIP_TYPE.ONE_WAY },
      { label: TEXTS.TRIP_TYPE.MULTI_CITY, value: VALUES.TRIP_TYPE.MULTI_CITY, useEngine: ETypeSearchEngine.FLIGHTS_MULTI_DESTINATIONS }
    ],
    classOptions: [
      { label: TEXTS.CLASS.ECONOMY, value: VALUES.CLASS.ECONOMY, isDefault: true },
      { label: TEXTS.CLASS.PREMIUM, value: VALUES.CLASS.PREMIUM },
      { label: TEXTS.CLASS.BUSINESS, value: VALUES.CLASS.BUSINESS },
      { label: TEXTS.CLASS.FIRST, value: VALUES.CLASS.FIRST }
    ]
  },
  footer: {
    infoItems: [
      TEXTS.FOOTER.INFO.ANY_VACATION,
      TEXTS.FOOTER.INFO.PAYMENT_PLAN,
      TEXTS.FOOTER.INFO.AVAILABLE
    ],
    options: [
      { label: TEXTS.FOOTER.OPTIONS.DIRECT_FLIGHTS, value: VALUES.FOOTER_OPTIONS.DIRECT, checked: false },
      { label: TEXTS.FOOTER.OPTIONS.FLEXIBLE_SEARCH, value: VALUES.FOOTER_OPTIONS.FLEXIBLE, checked: false }
    ]
  },
  inputs: [
    {
      type: ESharedInputType.DESTINATIONS_FLIGHTS,
      size: EInputSize.LARGE,
      position: EDropdownPosition.BOTTOM_LEFT,
      value: { label: 'תל אביב, שדה תעופה (TLV)', key: 'TLV' }
    },
    {
      type: ESharedInputType.ORIGINS_FLIGHTS,
      size: EInputSize.LARGE,
      position: EDropdownPosition.BOTTOM_LEFT,
      value: null
    },
    {
      type: ESharedInputType.PICKER_DATES,
      size: EInputSize.MEDIUM,
      position: EDropdownPosition.BOTTOM_CENTER,
      value: { start: null as Date | null, end: null as Date | null }
    },
    {
      type: ESharedInputType.PASSANGERS_FLIGHTS,
      size: EInputSize.SMALL,
      position: EDropdownPosition.BOTTOM_RIGHT,
      value: null
    }
  ]
};

export const HOTEL_ABROAD_CONFIG: SearchEngineConfig = {
  engineType: ETypeSearchEngine.HOTELS_ABROAD,
  productCode: EProductCode.HOTELS,
  header: {
    title: TEXTS.HEADER.HOTEL_ABROAD_TITLE
  },
  footer: {
    infoItems: [
      TEXTS.FOOTER.INFO.RECOMMENDED_HOTELS,
      TEXTS.FOOTER.INFO.FREE_CANCELLATION,
      TEXTS.FOOTER.INFO.SPECIAL_PRICES
    ]
  },
  inputs: [
    {
      type: ESharedInputType.HOTELS_DESTINATION,
      size: EInputSize.HUGE,
      position: EDropdownPosition.BOTTOM_LEFT,
      value: null
    },
    {
      type: ESharedInputType.PICKER_DATES,
      size: EInputSize.LARGE,
      position: EDropdownPosition.BOTTOM_CENTER,
      value: { start: null as Date | null, end: null as Date | null }
    },
    {
      type: ESharedInputType.PASSANGERS_ABOARD_HOTEL,
      size: EInputSize.SMALL,
      position: EDropdownPosition.BOTTOM_RIGHT,
      value: null
    }
  ]
};

export const FLIGHTS_MULTI_DESTINATIONS_CONFIG: SearchEngineConfig = {
  engineType: ETypeSearchEngine.FLIGHTS_MULTI_DESTINATIONS,
  productCode: EProductCode.FLIGHTS,
  customInputsComponent: () => import('../components/issta-engine/engines/flights/flights_multi_destinations/flights_multi_destinations.component').then(m => m.FlightsMultiDestinationsComponent),
  header: {
    title: "ריבוי יעדים",
    routeType: [
      { label: TEXTS.TRIP_TYPE.ROUND_TRIP, value: VALUES.TRIP_TYPE.ROUND_TRIP, isDefault: true },
      { label: TEXTS.TRIP_TYPE.ONE_WAY, value: VALUES.TRIP_TYPE.ONE_WAY },
      { label: TEXTS.TRIP_TYPE.MULTI_CITY, value: VALUES.TRIP_TYPE.MULTI_CITY, useEngine: ETypeSearchEngine.FLIGHTS_MULTI_DESTINATIONS }
    ]
  },
  footer: {
    infoItems: [
      TEXTS.FOOTER.INFO.ANY_VACATION,
      TEXTS.FOOTER.INFO.PAYMENT_PLAN,
      TEXTS.FOOTER.INFO.AVAILABLE
    ]
  }
};

export const DOMESTIC_VACATION_CONFIG: SearchEngineConfig = {
  engineType: ETypeSearchEngine.DOMESTIC_VACATIONS,
  productCode: EProductCode.DOMESTIC_VACATION,
  
  header: {
    title: TEXTS.HEADER.DOMESTIC_VACATION_TITLE,
     choices: [
      { label: "מלונות בארץ", value: "hotel_domestic", isDefault: true },
      { label: "חיפוש טיסות לאילת", value: "flight_to_eilat", isDefault: false, useEngine: ETypeSearchEngine.FLIGHTS_TO_EILAT },
      { label: "טיסה ומלון לאילת", value: "flight_hotel_eilat", isDefault: false, promotionText: TEXTS.PROMOTION.BEST_DEAL, useEngine: ETypeSearchEngine.FLIGHTS_AND_HOTELS_TO_EILAT }

    ],
  },
  footer: {
    infoItems: [
      TEXTS.FOOTER.INFO.RECOMMENDED_HOTELS,
      TEXTS.FOOTER.INFO.FREE_CANCELLATION,
      TEXTS.FOOTER.INFO.SPECIAL_PRICES
    ],
    options: [
      { label: "הוספת טיסה", value: "add_flight", checked: false, isHidden: true }
    ]
  },
  inputs: [
    {
      type: ESharedInputType.DOMESTIC_VACATION_DESTINATION,
      size: EInputSize.HUGE,
      position: EDropdownPosition.BOTTOM_LEFT,
      value: null
    },
    {
      type: ESharedInputType.PICKER_DATES,
      size: EInputSize.LARGE,
      position: EDropdownPosition.BOTTOM_CENTER,
      value: { start: null as Date | null, end: null as Date | null }
    },
    {
      type: ESharedInputType.PASSANGERS_DOMESTIC_VACATION,
      size: EInputSize.SMALL,
      position: EDropdownPosition.BOTTOM_CENTER,
      value: null
    }
  ]
};

export const FLIGHTS_TO_EILAT_CONFIG: SearchEngineConfig = {
  engineType: ETypeSearchEngine.FLIGHTS_TO_EILAT,
  productCode: EProductCode.FLIGHTS,
  header: {
    title: 'טיסות לאילת',
    routeType: [
      { label: TEXTS.TRIP_TYPE.ROUND_TRIP, value: VALUES.TRIP_TYPE.ROUND_TRIP, isDefault: true },
      { label: TEXTS.TRIP_TYPE.ONE_WAY, value: VALUES.TRIP_TYPE.ONE_WAY }
    ]
  },
  footer: {
    infoItems: [
      TEXTS.FOOTER.INFO.ANY_VACATION,
      TEXTS.FOOTER.INFO.PAYMENT_PLAN,
      TEXTS.FOOTER.INFO.AVAILABLE
    ]
  },
  inputs: [
    {
      type: ESharedInputType.DESTINATIONS_FLIGHTS_EILAT,
      size: EInputSize.LARGE,
      position: EDropdownPosition.BOTTOM_LEFT,
      value: { label: 'תל אביב, נתב"ג', value: 'TLV' }
    },
    {
      type: ESharedInputType.ORIGINS_FLIGHTS_EILAT,
      size: EInputSize.LARGE,
      position: EDropdownPosition.BOTTOM_LEFT,
        value: { label: 'אילת, נמל תעופה רמון', value: 'ETM' }
    },
    {
      type: ESharedInputType.PICKER_DATES,
      size: EInputSize.MEDIUM,
      position: EDropdownPosition.BOTTOM_CENTER,
      value: { start: null as Date | null, end: null as Date | null }
    },
    {
      type: ESharedInputType.PASSANGERS_FLIGHTS_EILAT,
      size: EInputSize.SMALL,
      position: EDropdownPosition.BOTTOM_CENTER,
      value: null
    }
  ]
};

export const FLIGHTS_AND_HOTELS_TO_EILAT_CONFIG: SearchEngineConfig = {
  engineType: ETypeSearchEngine.FLIGHTS_AND_HOTELS_TO_EILAT,
  productCode: EProductCode.DOMESTIC_VACATION,
  header: {
    title: 'טיסה ומלון לאילת',
  },
  footer: {
    infoItems: [
      TEXTS.FOOTER.INFO.ANY_VACATION,
      TEXTS.FOOTER.INFO.PAYMENT_PLAN,
      TEXTS.FOOTER.INFO.AVAILABLE
    ]
  },
  inputs: [
    {
      type: ESharedInputType.DESTINATIONS_FLIGHTS_HOTEL_EILAT,
      size: EInputSize.HUGE,
      position: EDropdownPosition.BOTTOM_LEFT,
      value: null
    },
    {
      type: ESharedInputType.PICKER_DATES,
      size: EInputSize.LARGE,
      position: EDropdownPosition.BOTTOM_CENTER,
      value: { start: null as Date | null, end: null as Date | null }
    },
    {
      type: ESharedInputType.PASSANGERS_FLIGHTS_AND_HOTEL_EILAT,
      size: EInputSize.SMALL,
      position: EDropdownPosition.BOTTOM_CENTER,
      value: null
    }
  ]
};

export const SPORT_CONFIG: SearchEngineConfig = {
  engineType: ETypeSearchEngine.SPORT,
  productCode: EProductCode.SPORT,
  header: {
    title: "חיפוש חבילות ספורט"
  },
  footer: {
    infoItems: [
      TEXTS.FOOTER.INFO.RECOMMENDED_HOTELS,
      TEXTS.FOOTER.INFO.FREE_CANCELLATION,
      TEXTS.FOOTER.INFO.SPECIAL_PRICES
    ],
    popular: [
      { label: 'ליגה ספרדית', link: '/sportcategory/soccer/spanish-league' },
      { label: 'ליגת האלופות', link: '/soccer/champions-league' },
      { label: 'יורובאסקט', link: '/sportcategory/basketball/eurobasket' }
    ]
  },
  inputs: [
    {
      type: ESharedInputType.SPORT_EVENT_TYPE,
      size: EInputSize.MEDIUM,
      position: EDropdownPosition.BOTTOM_LEFT,
      value: { label: 'אירועי ספורט', key: 'sport-events' }
    },
    {
      type: ESharedInputType.SPORT_LEAGUES,
      size: EInputSize.LARGE,
      position: EDropdownPosition.BOTTOM_LEFT,
      value: { label: 'כל הליגות', key: 'all' }
    },
    {
      type: ESharedInputType.SPORT_TEAMS,
      size: EInputSize.LARGE,
      position: EDropdownPosition.BOTTOM_LEFT,
      value: { label: 'כל הקבוצות', key: 'all' }
    },
    {
      type: ESharedInputType.DATES_PICKER_MONTHS,
      size: EInputSize.SMALL,
      position: EDropdownPosition.BOTTOM_CENTER,
      value: { label: 'כל התאריכים', key: 'all' },
      dataConfig: {
        allowPickAllMonths: true
      }
    },

  ]
};

export const ORGANIZED_TOURS_CONFIG: SearchEngineConfig = {
  engineType: ETypeSearchEngine.ORGANIZED_TOURS,
  productCode: EProductCode.ORGANIZED_TOURS,
  header: {
    title: "חיפוש טיולים מאורגנים"
  },
  footer: {
    infoItems: [
      TEXTS.FOOTER.INFO.RECOMMENDED_HOTELS,
      TEXTS.FOOTER.INFO.FREE_CANCELLATION,
      TEXTS.FOOTER.INFO.SPECIAL_PRICES
    ],
    popular: [
      { label: 'איטליה', link: '/trips/to-italy.aspx' },
      { label: 'גאורגיה', link: 'trips/results.aspx?region=2&rname=מזרח%20אירופה&country=74&cname=גאורגיה' },
      { label: 'משפחות', link: '/trips/family.aspx' }
    ]
  },
  inputs: [
    {
      type: ESharedInputType.ORGANIZED_REGIONS,
      size: EInputSize.SMALL,
      position: EDropdownPosition.BOTTOM_LEFT,
      value: { label: 'כל היעדים', key: 'all' }
    },
    {
      type: ESharedInputType.ORGANIZED_COUNTRIES,
      size: EInputSize.SMALL,
      position: EDropdownPosition.BOTTOM_LEFT,
      value: { label: 'כל המדינות', key: 'all' }
    },
    {
      type: ESharedInputType.ORGANIZED_CATEGORIES,
      size: EInputSize.MEDIUM,
      position: EDropdownPosition.BOTTOM_LEFT,
      value: { label: 'כל הקטגוריות', key: 'all' }
    },
    {
      type: ESharedInputType.DATES_PICKER_MONTHS,
      size: EInputSize.SMALL,
      position: EDropdownPosition.BOTTOM_CENTER,
      dataConfig: {
        allowPickAllMonths: false
      }
    },
    {
    type: ESharedInputType.PASSANGERS_DOMESTIC_VACATION,
    size: EInputSize.MEDIUM,
    position: EDropdownPosition.BOTTOM_LEFT,
  },
  ]
};

export const DYNAMIC_PACKAGES_CONFIG: SearchEngineConfig = {
  engineType: ETypeSearchEngine.DYNAMIC_PACKAGES,
  productCode: EProductCode.DYNAMIC_PACKAGES,
  header: {
    title: 'חבילות נופש',
  },
  footer: {
    infoItems: [
      'חבילות נופש משתלמות',
      'טיסה + מלון במחיר אחד',
      'תשלום בעד 36 תשלומים'
    ],
  },
  inputs: [
    {
      type: ESharedInputType.DYNAMIC_PACKAGES_DESTINATION,
      size: EInputSize.HUGE,
      position: EDropdownPosition.BOTTOM_LEFT,
      value: null
    },
    {
      type: ESharedInputType.DYNAMIC_PACKAGES_DATES,
      size: EInputSize.LARGE,
      position: EDropdownPosition.BOTTOM_CENTER,
      value: { start: null as Date | null, end: null as Date | null }
    },
    {
      type: ESharedInputType.PASSANGERS_DYNAMIC_PACKAGES,
      size: EInputSize.SMALL,
      position: EDropdownPosition.BOTTOM_RIGHT,
      value: null
    }
  ]
};

export const SKI_CONFIG: SearchEngineConfig = {
  engineType: ETypeSearchEngine.SKI,
  productCode: EProductCode.SKI,
  header: {
    title: 'חיפוש חבילות סקי',
  },
  footer: {
    infoItems: [
      'אתרי סקי מובילים',
      'חבילות כולל ציוד',
      'תשלום עד 36 תשלומים'
    ],
  },
  inputs: [
    {
      type: ESharedInputType.SKI_DESTINATION,
      size: EInputSize.LARGE,
      position: EDropdownPosition.BOTTOM_LEFT,
      value: { label: 'כל המדינות', key: 'all' }
    },
    {
      type: ESharedInputType.SKI_RESORT,
      size: EInputSize.LARGE,
      position: EDropdownPosition.BOTTOM_LEFT,
      value: { label: 'כל האתרים', key: 'all' }
    },
    {
      type: ESharedInputType.SKI_DEPARTURE_DATE,
      size: EInputSize.MEDIUM,
      position: EDropdownPosition.BOTTOM_CENTER,
      value: { start: null as Date | null, end: null as Date | null }
    },
    {
      type: ESharedInputType.PASSANGERS_OPTIONS,
      size: EInputSize.SMALL,
      position: EDropdownPosition.BOTTOM_RIGHT,
      value: null
    }
  ]
};

export const VILLAGE_RESORTS_CONFIG: SearchEngineConfig = {
  engineType: ETypeSearchEngine.VILLAGE_RESORTS,
  productCode: EProductCode.VILLAGE_RESORTS,
  header: {
    title: 'כפרי נופש',
  },
  footer: {
    infoItems: [
      'כפרי נופש מובילים',
      'חבילות משפחתיות',
      'תשלום עד 36 תשלומים'
    ],
  },
  inputs: [
    {
      type: ESharedInputType.VILLAGE_RESORTS_DESTINATION,
      size: EInputSize.HUGE,
      position: EDropdownPosition.BOTTOM_LEFT,
    },
    {
      type: ESharedInputType.VILLAGE_RESORTS_DATES,
      size: EInputSize.LARGE,
      position: EDropdownPosition.BOTTOM_CENTER,
      value: { start: null as Date | null, end: null as Date | null }
    },
    {
      type: ESharedInputType.VILLAGE_RESORTS_PASSENGERS,
      size: EInputSize.SMALL,
      position: EDropdownPosition.BOTTOM_RIGHT,
      value: null
    }
  ]
};

export const CAR_RENTAL_CONFIG: SearchEngineConfig = {
  engineType: ETypeSearchEngine.CAR_RENTAL,
  productCode: EProductCode.CARS,
  header: {
    title: 'השכרת רכב',
  },
  footer: {
    infoItems: [
      'רכבים ממיטב החברות',
      'ביטול חינם',
      'תשלום עד 36 תשלומים'
    ],
  },
  inputs: [
    {
      type: ESharedInputType.CAR_PICKUP_COUNTRY,
      size: EInputSize.LARGE,
      position: EDropdownPosition.BOTTOM_LEFT,
    },
    {
      type: ESharedInputType.CAR_PICKUP_CITY,
      size: EInputSize.LARGE,
      position: EDropdownPosition.BOTTOM_LEFT,
      value: null,
      isDisabled: true
    },
    {
      type: ESharedInputType.CAR_DATES,
      size: EInputSize.MEDIUM,
      position: EDropdownPosition.BOTTOM_CENTER,
      value: { start: null as Date | null, end: null as Date | null, startTime: '10:00', endTime: '10:00' },
      allowPickHours: true
    },
    {
      type: ESharedInputType.CAR_DRIVER_AGE,
      size: EInputSize.SMALL,
      position: EDropdownPosition.BOTTOM_RIGHT,
      value: null
    }
  ]
};


export const ALL_CONFIGS: SearchEngineConfig[] = [
  FLIGHTS_CONFIG,
  HOTEL_ABROAD_CONFIG,
  FLIGHTS_MULTI_DESTINATIONS_CONFIG,
  FLIGHTS_TO_EILAT_CONFIG,
  FLIGHTS_AND_HOTELS_TO_EILAT_CONFIG,
  DOMESTIC_VACATION_CONFIG,
  SPORT_CONFIG,
  ORGANIZED_TOURS_CONFIG,
  DYNAMIC_PACKAGES_CONFIG,
  SKI_CONFIG,
  VILLAGE_RESORTS_CONFIG,
  CAR_RENTAL_CONFIG,
];

export const ENGINE_REGISTRY: Partial<Record<ETypeSearchEngine, SearchEngineConfig>> = 
  ALL_CONFIGS.reduce((registry, config) => {
    registry[config.engineType] = config;
    return registry;
  }, {} as Partial<Record<ETypeSearchEngine, SearchEngineConfig>>);