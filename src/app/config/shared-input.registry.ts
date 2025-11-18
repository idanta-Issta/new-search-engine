import { ESharedInputType } from '../enums/ESharedInputType';
import { FlightsMapper } from '../mappers/flights.mapper';
import { AppExternalConfig } from '../config/app.external.config';
import { SharedInputConfig } from '../models/shared-input-config.models';
import { SharedCalendarInputConfig } from '../models/shared-calendar-input.models';
import { SharedOptionsInputComponent } from '../components/issta-engine/shared/inputs/shared-options-input/shared-options-input.component';
import { SharedCalendarInputComponent } from '../components/issta-engine/shared/inputs/shared-calendar-input/shared-calendar-input.component';
import { SharedPassangerInputComponent } from '../components/issta-engine/shared/inputs/shared-passanger-input/shared-passanger-input.component';
import { TEXTS, ICONS } from '../constants/app.constants';

export const SharedInputRegistry: Record<ESharedInputType, SharedInputConfig> = {
  [ESharedInputType.ORIGINS_FLIGHTS]: {
    requestUrl: `${AppExternalConfig.baseUrl}${AppExternalConfig.endpoints.flights.destinations}`,
    autocompleteUrl: `${AppExternalConfig.baseUrl}flights/autocomplete`,
    mapper: FlightsMapper.mapDestinations,
    uiConfig: {
      title: TEXTS.SEARCH.INPUT_TITLES.TO,
      placeholder: TEXTS.SEARCH.PLACEHOLDER.ORIGIN,
      titleMenuOptions: TEXTS.SEARCH.MENU_TITLES.POPULAR_DESTINATIONS,
      allowAutoComplete: true,
    },
    component: SharedOptionsInputComponent,
  },

  [ESharedInputType.DESTINATIONS_FLIGHTS]: {
    requestUrl: `${AppExternalConfig.baseUrl}${AppExternalConfig.endpoints.flights.destinations}`,
    autocompleteUrl: `${AppExternalConfig.baseUrl}flights/autocomplete`,
    mapper: FlightsMapper.mapDestinations,
    uiConfig: {
      title: TEXTS.SEARCH.INPUT_TITLES.FROM,
      icon: ICONS.PLANE,
      placeholder: TEXTS.SEARCH.PLACEHOLDER.DESTINATION,
      titleMenuOptions: TEXTS.SEARCH.MENU_TITLES.POPULAR_DESTINATIONS,
      allowAutoComplete: true,
    },
    component: SharedOptionsInputComponent,
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
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate());
        return yesterday;
      })(),
      maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      allowPickHours: false,
    }),
    component: SharedCalendarInputComponent,
  },

  [ESharedInputType.PASSANGERS_FLIGHTS]: {
    mapper: () => [],
    uiConfig: {
      title: TEXTS.PASSENGERS.LABEL,
      icon: ICONS.PASSENGER,
      placeholder: TEXTS.SEARCH.PLACEHOLDER.PASSENGERS,
      allowAutoComplete: false,
    },
    component: SharedPassangerInputComponent,
  },

}
