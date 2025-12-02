import { ESharedInputType } from '../enums/ESharedInputType';
import { FlightsMapper } from '../mappers/flights.mapper';
import { HotelsMapper } from '../mappers/hotels.mapper';
import { DomesticVacationMapper } from '../mappers/domestic-vacation.mapper';
import { SportMapper } from '../mappers/sport.mapper';
import { OrganizedToursMapper } from '../mappers/organized-tours.mapper';
import { DatesPickerMapper } from '../mappers/dates-picker.mapper';
import { DynamicPackagesMapper } from '../mappers/dynamic-packages.mapper';
import { VillageResortsMapper } from '../mappers/village-resorts.mapper';
import { AppExternalConfig } from '../config/app.external.config';
import { SharedInputConfig } from '../models/shared-input-config.models';
import { SharedCalendarInputConfig } from '../models/shared-calendar-input.models';
import { TEXTS, ICONS } from '../constants/app.constants';
import { EILAT_AIRPORTS } from '../constants/destinations.constants';

export const SharedInputRegistry: Record<ESharedInputType, SharedInputConfig> = {
  [ESharedInputType.DESTINATIONS_FLIGHTS]: {
    requestUrl: `${AppExternalConfig.baseUrl}${AppExternalConfig.endpoints.flights.destinations}`,
    autocompleteUrl: `${AppExternalConfig.baseUrl}flights/autocomplete`,
    mapper: FlightsMapper.mapDestinations,
    uiConfig: {
      title: TEXTS.SEARCH.INPUT_TITLES.TO,
      icon: ICONS.PLANE,
      placeholder: TEXTS.SEARCH.PLACEHOLDER.DESTINATION,
      titleMenuOptions: TEXTS.SEARCH.MENU_TITLES.POPULAR_DESTINATIONS,
      allowAutoComplete: true,
    },
    component: () => import('../components/issta-engine/shared/inputs/shared-options-input/shared-options-input.component').then(m => m.SharedOptionsInputComponent),
 
  },

  [ESharedInputType.DESTINATIONS_FLIGHTS_EILAT]: {
    listMenuOption: EILAT_AIRPORTS,
    mapper: (data: any) => data,
    uiConfig: {
      title: "מ",
      icon: ICONS.PLANE,
      placeholder: TEXTS.SEARCH.PLACEHOLDER.DESTINATION,
      titleMenuOptions: 'יעדים פופולריים',
      allowAutoComplete: false,
    },
    component: () => import('../components/issta-engine/shared/inputs/shared-options-input/shared-options-input.component').then(m => m.SharedOptionsInputComponent),
  },

  [ESharedInputType.DESTINATIONS_FLIGHTS_HOTEL_EILAT]: {
   requestUrl: `${AppExternalConfig.baseUrl}${AppExternalConfig.endpoints.domesticDynamicPackages.destinations}`,
    mapper: DomesticVacationMapper.mapDestinations,
    uiConfig: {
      title: TEXTS.SEARCH.INPUT_TITLES.WHERE,
      icon: ICONS.HOTEL,
      placeholder: TEXTS.SEARCH.PLACEHOLDER.HOTEL_DESTINATION,
      titleMenuOptions: TEXTS.SEARCH.MENU_TITLES.POPULAR_DESTINATIONS,
      allowAutoComplete: false,
    },
      customMenuHeaderComponent: () => import('../components/issta-engine/shared/buttons/custom-menu-header-button/custom-menu-header-button.component').then(m => m.CustomMenuHeaderButtonComponent),
    customMenuHeaderConfig: {
      text: 'כל המלונות באילת',
      label: 'כל המלונות באילת',
      value: 'all-hotels-eilat',
      icon: 'icon-Calender1'
    },
    component: () => import('../components/issta-engine/shared/inputs/shared-options-input/shared-options-input.component').then(m => m.SharedOptionsInputComponent),
  },

    [ESharedInputType.ORIGINS_FLIGHTS_EILAT]: {
    listMenuOption: EILAT_AIRPORTS,
    mapper: (data: any) => data,
    uiConfig: {
      title: "אל",
      icon: ICONS.PLANE,
      placeholder: TEXTS.SEARCH.PLACEHOLDER.DESTINATION,
      titleMenuOptions: 'יעדים פופולריים',
      allowAutoComplete: false,
    },
    component: () => import('../components/issta-engine/shared/inputs/shared-options-input/shared-options-input.component').then(m => m.SharedOptionsInputComponent),
  },

  [ESharedInputType.ORIGINS_FLIGHTS]: {
    requestUrl: `${AppExternalConfig.baseUrl}${AppExternalConfig.endpoints.flights.destinations}`,
    autocompleteUrl: `${AppExternalConfig.baseUrl}flights/autocomplete`,
    mapper: FlightsMapper.mapDestinations,
    uiConfig: {
      title: "יעד",
      placeholder: TEXTS.SEARCH.PLACEHOLDER.ORIGIN,
      titleMenuOptions: TEXTS.SEARCH.MENU_TITLES.POPULAR_DESTINATIONS,
      allowAutoComplete: true,
    },
    customMenuHeaderComponent: () => import('../components/issta-engine/shared/buttons/custom-menu-header-button/custom-menu-header-button.component').then(m => m.CustomMenuHeaderButtonComponent),
    customMenuHeaderConfig: {
      text: 'חיפוש בעזרת מפת מחירים',
      label: 'כל היעדים',
      value: 'search-with-map-price',
      icon: 'icon-Calender1'
    },
    component: () => import('../components/issta-engine/shared/inputs/shared-options-input/shared-options-input.component').then(m => m.SharedOptionsInputComponent),
  },

    [ESharedInputType.MULTI_DESTINATION_ORIGINS_FLIGHTS]: {
    requestUrl: `${AppExternalConfig.baseUrl}${AppExternalConfig.endpoints.flights.destinations}`,
    autocompleteUrl: `${AppExternalConfig.baseUrl}flights/autocomplete`,
    mapper: FlightsMapper.mapDestinations,
    uiConfig: {
      title: TEXTS.SEARCH.INPUT_TITLES.FROM,
      placeholder: TEXTS.SEARCH.PLACEHOLDER.ORIGIN,
      titleMenuOptions: TEXTS.SEARCH.MENU_TITLES.POPULAR_DESTINATIONS,
      allowAutoComplete: true,
    },
    component: () => import('../components/issta-engine/shared/inputs/shared-options-input/shared-options-input.component').then(m => m.SharedOptionsInputComponent),
  },

  [ESharedInputType.PICKER_DATES]: {
    mapper: () => [],
    uiConfig: {
      title: TEXTS.SEARCH.INPUT_TITLES.WHEN,
      icon: ICONS.CALENDAR,
      placeholder: TEXTS.SEARCH.PLACEHOLDER.DATES,
      titleMenuOptions: '',
      allowAutoComplete: false,
    },
    dataConfig: new SharedCalendarInputConfig({
      suggestedDates: [],
      minDate: (() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // אפס שעה למניעת בעיות השוואה
        return today;
      })(),
      maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      allowPickHours: false,
    }),
    component: () => import('../components/issta-engine/shared/inputs/shared-calendar-input/shared-calendar-input.component').then(m => m.SharedCalendarInputComponent),
  },

  [ESharedInputType.PASSANGERS_FLIGHTS]: {
    mapper: () => [],
    uiConfig: {
      title: TEXTS.PASSENGERS.LABEL,
      icon: ICONS.PASSENGER,
      placeholder: TEXTS.SEARCH.PLACEHOLDER.PASSENGERS,
      allowAutoComplete: false,
    },
    component: () => import('../components/issta-engine/shared/inputs/shared-passanger-input/shared-passanger-input.component').then(m => m.SharedPassangerInputComponent),
  },

  [ESharedInputType.PASSANGERS_ABOARD_HOTEL]: {
    mapper: () => [],
    uiConfig: {
      title: TEXTS.PASSENGERS.LABEL,
      icon: ICONS.PASSENGER,
      placeholder: TEXTS.SEARCH.PLACEHOLDER.PASSENGERS,
      allowAutoComplete: false,
    },
    component: () => import('../components/issta-engine/shared/inputs/shared-passanger-input/shared-passanger-input.component').then(m => m.SharedPassangerInputComponent),
  },

    [ESharedInputType.PASSANGERS_FLIGHTS_EILAT]: {
    mapper: () => [],
    uiConfig: {
      title: TEXTS.PASSENGERS.LABEL,
      icon: ICONS.PASSENGER,
      placeholder: TEXTS.SEARCH.PLACEHOLDER.PASSENGERS,
      allowAutoComplete: false,
    },
    component: () => import('../components/issta-engine/shared/inputs/shared-passanger-input/shared-passanger-input.component').then(m => m.SharedPassangerInputComponent),
  },

   [ESharedInputType.PASSANGERS_FLIGHTS_AND_HOTEL_EILAT]: {
    mapper: () => [],
    uiConfig: {
      title: TEXTS.PASSENGERS.LABEL,
      icon: ICONS.PASSENGER,
      placeholder: TEXTS.SEARCH.PLACEHOLDER.PASSENGERS,
      allowAutoComplete: false,
    },
    component: () => import('../components/issta-engine/shared/inputs/shared-passanger-input/shared-passanger-input.component').then(m => m.SharedPassangerInputComponent),
  },

  [ESharedInputType.HOTELS_DESTINATION]: {
    requestUrl: `${AppExternalConfig.baseUrl}${AppExternalConfig.endpoints.hotels.destinations}`,
    autocompleteUrl: `${AppExternalConfig.baseUrl}abroad-hotels/autocomplete`,
    mapper: HotelsMapper.mapDestinations,
    uiConfig: {
      title: TEXTS.SEARCH.INPUT_TITLES.WHERE,
      icon: ICONS.HOTEL,
      placeholder: TEXTS.SEARCH.PLACEHOLDER.HOTEL_DESTINATION,
      titleMenuOptions: TEXTS.SEARCH.MENU_TITLES.POPULAR_DESTINATIONS,
      allowAutoComplete: true,
    },
    component: () => import('../components/issta-engine/shared/inputs/shared-options-input/shared-options-input.component').then(m => m.SharedOptionsInputComponent),
  },

  [ESharedInputType.DOMESTIC_VACATION_DESTINATION]: {
    requestUrl: `${AppExternalConfig.baseUrl}${AppExternalConfig.endpoints.domesticVacation.destinations}`,
    autocompleteUrl: `${AppExternalConfig.baseUrl}domestic-hotels/autocomplete`,
    mapper: DomesticVacationMapper.mapDestinations,
    uiConfig: {
      title: TEXTS.SEARCH.INPUT_TITLES.WHERE,
      icon: ICONS.HOTEL,
      placeholder: TEXTS.SEARCH.PLACEHOLDER.HOTEL_DESTINATION,
      titleMenuOptions: TEXTS.SEARCH.MENU_TITLES.POPULAR_DESTINATIONS,
      allowAutoComplete: true,
    },
    component: () => import('../components/issta-engine/shared/inputs/shared-options-input/shared-options-input.component').then(m => m.SharedOptionsInputComponent),
  },

  [ESharedInputType.PASSANGERS_DOMESTIC_VACATION]: {
   
    mapper: () => [],
    uiConfig: {
      title: TEXTS.PASSENGERS.LABEL,
      icon: ICONS.PASSENGER,
      placeholder: TEXTS.SEARCH.PLACEHOLDER.PASSENGERS,
      allowAutoComplete: false,
    },
    component: () => import('../components/issta-engine/shared/inputs/shared-passanger-input/shared-passanger-input.component').then(m => m.SharedPassangerInputComponent),
  },

  [ESharedInputType.SPORT_EVENT_TYPE]: {
    isDisabled: true,

    mapper: (data: any) => data,
    uiConfig: {
      title: 'סוג אירוע',
      icon: 'ist-icon-soccer',
      isBoldIcon: true,
      placeholder: 'סוג אירוע',
      titleMenuOptions: '',
      allowAutoComplete: false,
    },
    component: () => import('../components/issta-engine/shared/inputs/shared-options-input/shared-options-input.component').then(m => m.SharedOptionsInputComponent),
  },

  [ESharedInputType.SPORT_LEAGUES]: {
    requestUrl: `${AppExternalConfig.baseUrl}sport/leagues`,
    mapper: SportMapper.mapLeagues,
    uiConfig: {
      title: 'ליגה',
      placeholder: 'בחר ליגה',
      titleMenuOptions: 'ליגות',
      allowAutoComplete: false,
    },
    component: () => import('../components/issta-engine/shared/inputs/shared-options-input/shared-options-input.component').then(m => m.SharedOptionsInputComponent),
  },

  [ESharedInputType.SPORT_TEAMS]: {
    mapper: SportMapper.mapTeams,
    uiConfig: {
      title: 'קבוצה',
      placeholder: 'בחר קבוצה',
      titleMenuOptions: 'קבוצות',
      allowAutoComplete: false,
    },
    component: () => import('../components/issta-engine/shared/inputs/shared-options-input/shared-options-input.component').then(m => m.SharedOptionsInputComponent),
  },

  [ESharedInputType.ORGANIZED_REGIONS]: {
    requestUrl: `${AppExternalConfig.baseUrl}trips/worldregions`,
    mapper: OrganizedToursMapper.mapRegions,
    uiConfig: {
      title: 'יעד',
      placeholder: 'בחר יעד',
      titleMenuOptions: 'יעדים',
      allowAutoComplete: false,
    },
    component: () => import('../components/issta-engine/shared/inputs/shared-options-input/shared-options-input.component').then(m => m.SharedOptionsInputComponent),
  },

  [ESharedInputType.ORGANIZED_COUNTRIES]: {
    mapper: OrganizedToursMapper.mapCountries,
    uiConfig: {
      title: 'מדינה',
      placeholder: 'בחר מדינה',
      titleMenuOptions: 'מדינות',
      allowAutoComplete: false,
    },
    component: () => import('../components/issta-engine/shared/inputs/shared-options-input/shared-options-input.component').then(m => m.SharedOptionsInputComponent),
  },

  [ESharedInputType.ORGANIZED_CATEGORIES]: {
    requestUrl: `${AppExternalConfig.baseUrl}trips/tourtypes`,
    mapper: OrganizedToursMapper.mapCategories,
    uiConfig: {
      title: 'קטגוריה',
      placeholder: 'בחר קטגוריה',
      titleMenuOptions: 'קטגוריות',
      allowAutoComplete: false,
    },
    component: () => import('../components/issta-engine/shared/inputs/shared-options-input/shared-options-input.component').then(m => m.SharedOptionsInputComponent),
  },

  [ESharedInputType.DATES_PICKER_MONTHS]: {
    listMenuOption: DatesPickerMapper.mapMonths(),
    mapper: (data: any) => data,
    uiConfig: {
      title: 'חודש',
      icon: ICONS.CALENDAR,
      placeholder: 'בחר חודש',
      titleMenuOptions: 'חודשים',
      allowAutoComplete: false,
    },
    component: () => import('../components/issta-engine/shared/inputs/shared-options-input/shared-options-input.component').then(m => m.SharedOptionsInputComponent),
  },

  [ESharedInputType.DYNAMIC_PACKAGES_DESTINATION]: {
    requestUrl: `${AppExternalConfig.baseUrl}packages/populardestinations`,
    autocompleteUrl: `${AppExternalConfig.baseUrl}packages/autocomplete`,
    mapper: DynamicPackagesMapper.mapDestinations,
    uiConfig: {
      title: TEXTS.SEARCH.INPUT_TITLES.WHERE,
      icon: ICONS.PLANE,
      placeholder: TEXTS.SEARCH.PLACEHOLDER.DESTINATION,
      titleMenuOptions: TEXTS.SEARCH.MENU_TITLES.POPULAR_DESTINATIONS,
      allowAutoComplete: true,
    },
    component: () => import('../components/issta-engine/shared/inputs/shared-options-input/shared-options-input.component').then(m => m.SharedOptionsInputComponent),
  },

  [ESharedInputType.DYNAMIC_PACKAGES_DATES]: {
    mapper: () => [],
    uiConfig: {
      title: TEXTS.SEARCH.INPUT_TITLES.WHEN,
      icon: ICONS.CALENDAR,
      placeholder: TEXTS.SEARCH.PLACEHOLDER.DATES,
      titleMenuOptions: '',
      allowAutoComplete: false,
    },
    dataConfig: new SharedCalendarInputConfig({
      suggestedDates: [],
      minDate: (() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
      })(),
      maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      allowPickHours: false,
    }),
    component: () => import('../components/issta-engine/shared/inputs/shared-calendar-input/shared-calendar-input.component').then(m => m.SharedCalendarInputComponent),
  },

  [ESharedInputType.PASSANGERS_DYNAMIC_PACKAGES]: {
    mapper: () => [],
    uiConfig: {
      title: TEXTS.PASSENGERS.LABEL,
      icon: ICONS.PASSENGER,
      placeholder: TEXTS.SEARCH.PLACEHOLDER.PASSENGERS,
      allowAutoComplete: false,
    },
    component: () => import('../components/issta-engine/shared/inputs/shared-passanger-input/shared-passanger-input.component').then(m => m.SharedPassangerInputComponent),
  },

  [ESharedInputType.SKI_DESTINATION]: {
    requestUrl: `${AppExternalConfig.baseUrl}ski/destinations`,
    mapper: (data: any) => {
      const { SkiMapper } = require('../mappers/ski.mapper');
      return SkiMapper.mapDestinations(data);
    },
    uiConfig: {
      title: 'יעד',
      icon: ICONS.PLANE,
      placeholder: 'בחר מדינה',
      titleMenuOptions: 'מדינות',
      allowAutoComplete: false,
    },
    component: () => import('../components/issta-engine/shared/inputs/shared-options-input/shared-options-input.component').then(m => m.SharedOptionsInputComponent),
  },

  [ESharedInputType.SKI_RESORT]: {
    mapper: (data: any) => {
      const { SkiMapper } = require('../mappers/ski.mapper');
      return SkiMapper.mapResorts(data);
    },
    uiConfig: {
      title: 'אתר סקי',
      icon: ICONS.HOTEL,
      placeholder: 'בחר אתר סקי',
      titleMenuOptions: 'אתרי סקי',
      allowAutoComplete: false,
    },
    component: () => import('../components/issta-engine/shared/inputs/shared-options-input/shared-options-input.component').then(m => m.SharedOptionsInputComponent),
  },

  [ESharedInputType.SKI_DEPARTURE_DATE]: {
    mapper: () => [],
    uiConfig: {
      title: 'תאריך יציאה',
      icon: ICONS.CALENDAR,
      placeholder: 'בחר תאריך',
      titleMenuOptions: '',
      allowAutoComplete: false,
    },
    dataConfig: new SharedCalendarInputConfig({
      suggestedDates: [],
      minDate: (() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
      })(),
      maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      allowPickHours: false,
         forcePickOnlySuggested: true,
    }),
    component: () => import('../components/issta-engine/shared/inputs/shared-calendar-input/shared-calendar-input.component').then(m => m.SharedCalendarInputComponent),
  },

  [ESharedInputType.SKI_PASSENGERS]: {
    mapper: () => [],
    uiConfig: {
      title: 'נוסעים',
      icon: ICONS.PASSENGER,
      placeholder: 'בחר מספר נוסעים',
      allowAutoComplete: false,
    },
    component: () => import('../components/issta-engine/shared/inputs/shared-passanger-input/shared-passanger-input.component').then(m => m.SharedPassangerInputComponent),
  },

  [ESharedInputType.VILLAGE_RESORTS_DESTINATION]: {
    requestUrl: `${AppExternalConfig.baseUrl}village-resorts/all-destinations`,
    mapper: (data: any) => {
      const { VillageResortsMapper } = require('../mappers/village-resorts.mapper');
      return VillageResortsMapper.mapDestinations(data);
    },
    uiConfig: {
      title: 'יעד',
      icon: ICONS.PLANE,
      placeholder: 'בחר יעד',
      titleMenuOptions: 'יעדים',
      allowAutoComplete: false,
    },
    component: () => import('../components/issta-engine/shared/inputs/shared-options-input/shared-options-input.component').then(m => m.SharedOptionsInputComponent),
  },

  [ESharedInputType.VILLAGE_RESORTS_DATES]: {
    mapper: () => [],
    uiConfig: {
      title: 'תאריך יציאה',
      icon: ICONS.CALENDAR,
      placeholder: 'בחר תאריך',
      titleMenuOptions: '',
      allowAutoComplete: false,
    },
    dataConfig: new SharedCalendarInputConfig({
      suggestedDates: [],
      minDate: (() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
      })(),
      maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      allowPickHours: false,
      forcePickOnlySuggested: true,
    }),
    component: () => import('../components/issta-engine/shared/inputs/shared-calendar-input/shared-calendar-input.component').then(m => m.SharedCalendarInputComponent),
  },

  [ESharedInputType.VILLAGE_RESORTS_PASSENGERS]: {
    mapper: () => [],
    uiConfig: {
      title: 'נוסעים',
      icon: ICONS.PASSENGER,
      placeholder: 'בחר מספר נוסעים',
      allowAutoComplete: false,
    },
    component: () => import('../components/issta-engine/shared/inputs/shared-passanger-input/shared-passanger-input.component').then(m => m.SharedPassangerInputComponent),
  },

  [ESharedInputType.CAR_PICKUP_COUNTRY]: {
    requestUrl: `${AppExternalConfig.baseUrl}car/countries`,
    mapper: (data: any) => {
      const { CarMapper } = require('../mappers/car.mapper');
      return CarMapper.mapDestinations(data);
    },
    uiConfig: {
      title: 'מדינת איסוף',
      icon: ICONS.PLANE,
      placeholder: 'בחר מדינה',
      titleMenuOptions: 'מדינות',
      allowAutoComplete: false,
    },
    component: () => import('../components/issta-engine/shared/inputs/shared-options-input/shared-options-input.component').then(m => m.SharedOptionsInputComponent),
  },

  [ESharedInputType.CAR_PICKUP_CITY]: {
    isDisabled: true,
    mapper: (data: any) => {
      const { CarMapper } = require('../mappers/car.mapper');
      return CarMapper.mapCities(data);
    },
    uiConfig: {
      title: 'עיר',
      icon: 'ist-icon-car',
      placeholder: 'בחר עיר',
      titleMenuOptions: 'ערים',
      allowAutoComplete: false,
    },
    component: () => import('../components/issta-engine/engines/car/car-location-input/car-location-input.component').then(m => m.CarLocationInputComponent),
  },

  [ESharedInputType.CAR_DATES]: {
    mapper: () => [],
    uiConfig: {
      title: 'תאריכי שכירות',
      icon: ICONS.CALENDAR,
      placeholder: 'בחר תאריכים',
      titleMenuOptions: '',
      allowAutoComplete: false,
    },
    dataConfig: new SharedCalendarInputConfig({
      suggestedDates: [],
      minDate: (() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
      })(),
      maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      allowPickHours: true,
    }),
    component: () => import('../components/issta-engine/shared/inputs/shared-calendar-input/shared-calendar-input.component').then(m => m.SharedCalendarInputComponent),
  },

  [ESharedInputType.CAR_DRIVER_AGE]: {
    mapper: () => [],
    uiConfig: {
      title: 'גיל הנהג',
      icon: 'ist-icon-user',
      placeholder: 'בחר גיל',
      allowAutoComplete: false,
    },
    component: () => import('../components/issta-engine/engines/car/driver-age-input/driver-age-input.component').then(m => m.DriverAgeInputComponent),
  },

}
