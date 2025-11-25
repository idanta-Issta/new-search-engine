import { ESharedInputType } from '../enums/ESharedInputType';
import { FlightsMapper } from '../mappers/flights.mapper';
import { HotelsMapper } from '../mappers/hotels.mapper';
import { DomesticVacationMapper } from '../mappers/domestic-vacation.mapper';
import { AppExternalConfig } from '../config/app.external.config';
import { SharedInputConfig } from '../models/shared-input-config.models';
import { SharedCalendarInputConfig } from '../models/shared-calendar-input.models';
import { TEXTS, ICONS } from '../constants/app.constants';

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
       customMenuHeaderComponent: () => import('../components/issta-engine/sub-engines/flights/map-price-search-header/map-price-search-header.component').then(m => m.MapPriceSearchHeaderComponent),
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

}
