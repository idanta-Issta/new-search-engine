import { ChoiceOption } from '../components/issta-engine/shared/header/header-choices/header-choices.component';
import { DropdownOption } from '../components/issta-engine/shared/header/header-dropdown/header-dropdown.component';
import { FooterOption } from '../components/issta-engine/shared/footer/footer-options/footer-options.component';
import { TEXTS, VALUES } from '../constants/app.constants';
import { InputConfig } from '../models/input-config.model';
import { ESharedInputType } from '../enums/ESharedInputType';
import { EInputSize } from '../enums/EInputSize';
import { EDropdownPosition } from '../enums/EDropdownPosition';
import { ETypeSearchEngine } from '../enums/ETypeSearchEngine';

export interface SearchEngineConfig {
  engineType: ETypeSearchEngine;
  customInputsComponent?: any;
  header: {
    title: string;
    choices?: ChoiceOption[];
    tripTypeOptions?: DropdownOption[];
    classOptions?: DropdownOption[];
  };
  footer: {
    infoItems?: string[];
    options?: FooterOption[];
   
  };
  inputs?: InputConfig[];
}

export const FLIGHTS_CONFIG: SearchEngineConfig = {
  engineType: ETypeSearchEngine.FLIGHTS,
  header: {
    title: TEXTS.HEADER.FLIGHTS_TITLE,
    choices: [
      { label: TEXTS.CHOICES.FLIGHT_ONLY, value: VALUES.CHOICES.FLIGHT_ONLY, isDefault: true },
      { label: TEXTS.CHOICES.FLIGHT_HOTEL, value: VALUES.CHOICES.FLIGHT_HOTEL, promotionText: TEXTS.PROMOTION.BEST_DEAL, 
        useEngine: ETypeSearchEngine.HOTELS_ABROAD }
    ],
    tripTypeOptions: [
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
      value: { label: 'תל אביב, שדה תעופה (TLV)', value: 'TLV' }
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
  customInputsComponent: () => import('../components/issta-engine/regional-engines/flights_multi_destinations/flights_multi_destinations.component').then(m => m.FlightsMultiDestinationsComponent),
  header: {
    title: "ריבוי יעדים",
    tripTypeOptions: [
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
  header: {
    title: TEXTS.HEADER.DOMESTIC_VACATION_TITLE
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

export const ALL_CONFIGS: SearchEngineConfig[] = [
  FLIGHTS_CONFIG,
  HOTEL_ABROAD_CONFIG,
  FLIGHTS_MULTI_DESTINATIONS_CONFIG,
  DOMESTIC_VACATION_CONFIG
];

export const ENGINE_REGISTRY: Partial<Record<ETypeSearchEngine, SearchEngineConfig>> = 
  ALL_CONFIGS.reduce((registry, config) => {
    registry[config.engineType] = config;
    return registry;
  }, {} as Partial<Record<ETypeSearchEngine, SearchEngineConfig>>);