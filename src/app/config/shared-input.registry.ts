import { ESharedInputType } from '../enums/ESharedInputType';
import { FlightsMapper } from '../mappers/flights.mapper';
import { HotelsMapper } from '../mappers/hotels.mapper';
import { AppExternalConfig } from '../config/app.external.config';
import { SharedInputConfig } from '../models/shared-input-config.models';
import { SharedCalendarInputConfig } from '../models/shared-calendar-input.models';
import { SharedOptionsInputComponent } from '../components/issta-engine/shared/inputs/shared-options-input/shared-options-input.component';
import { SharedCalendarInputComponent } from '../components/issta-engine/shared/inputs/shared-calendar-input/shared-calendar-input.component';
import { SharedPassangerInputComponent } from '../components/issta-engine/shared/inputs/shared-passanger-input/shared-passanger-input.component';

export const SharedInputRegistry: Record<ESharedInputType, SharedInputConfig> = {
  [ESharedInputType.ORIGINS_FLIGHTS]: {
    requestUrl: `${AppExternalConfig.baseUrl}${AppExternalConfig.endpoints.flights.destinations}`,
    autocompleteUrl: `${AppExternalConfig.baseUrl}flights/autocomplete`,
    mapper: FlightsMapper.mapDestinations,
    uiConfig: {
      title: 'אל',
      placeholder: 'בחר יעד בארץ או בחו"ל',
      titleMenuOptions: 'יעדים פופולריים',
      allowAutoComplete: true,
    },
    component: SharedOptionsInputComponent, // 👈 זה האינפוט המתאים
  },

  [ESharedInputType.DESTINATIONS_FLIGHTS]: {
    requestUrl: `${AppExternalConfig.baseUrl}${AppExternalConfig.endpoints.flights.destinations}`,
    autocompleteUrl: `${AppExternalConfig.baseUrl}flights/autocomplete`,
    mapper: FlightsMapper.mapDestinations,
    uiConfig: {
      title: 'מוצא',
      icon: 'ist-icon-deals-flight',
      placeholder: 'לאן טסים?',
      titleMenuOptions: 'יעדים פופולריים',
      allowAutoComplete: true,
    },
    component: SharedOptionsInputComponent,
  },

  [ESharedInputType.PICKER_DATES]: {
    mapper: () => [],
    uiConfig: {
      title: 'מתי',
      icon: 'ist-icon-calendar-2',
      placeholder: 'בחר תאריך',
      titleMenuOptions: '',
      allowAutoComplete: false,
    },
    dataConfig: new SharedCalendarInputConfig({
      suggestedDates: [],
      minDate: new Date(),
      maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      allowPickHours: false,
    }),
    component: SharedCalendarInputComponent, // 👈 קישור ברור לקומפוננטת הקלנדר
  },

  [ESharedInputType.PASSANGERS_FLIGHTS]: {
    mapper: () => [],
    uiConfig: {
      title: 'נוסעים',
      icon: 'icon-count-man',
      placeholder: 'בחר נוסעים',
      allowAutoComplete: false,
    },
    component: SharedPassangerInputComponent,
  },

}
