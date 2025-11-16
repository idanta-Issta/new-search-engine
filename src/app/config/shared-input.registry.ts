import { ESharedInputType } from '../enums/ESharedInputType';
import { FlightsMapper } from '../mappers/flights.mapper';
import { HotelsMapper } from '../mappers/hotels.mapper';
import { AppExternalConfig } from '../config/app.external.config';
import { SharedInputConfig } from '../models/shared-input-config.models';
import { SharedCalendarInputConfig } from '../models/shared-calendar-input.models';

export const SharedInputRegistry: Record<ESharedInputType, SharedInputConfig> = {
  
  // ✈ יעד טיסה
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
    defaultValue: { label: "תל אביב", key: "TLV" }

    }
  },

  // 🛫 מוצא טיסה
  [ESharedInputType.ORIGINS_FLIGHTS]: {
    requestUrl: `${AppExternalConfig.baseUrl}${AppExternalConfig.endpoints.flights.origins}`,
    autocompleteUrl: `${AppExternalConfig.baseUrl}flights/autocomplete`,
    mapper: FlightsMapper.mapOrigins,
    uiConfig: {
      title: 'אל',
      placeholder: 'בחירת יעד בארץ או בחו"ל',
      titleMenuOptions: 'יעדים פופולריים',
      allowAutoComplete: true,

    }
  },

  [ESharedInputType.DESTINATIONS_HOTELS]: {
    requestUrl: `${AppExternalConfig.baseUrl}${AppExternalConfig.endpoints.hotels.destinations}`,
    autocompleteUrl: `${AppExternalConfig.baseUrl}hotels/autocomplete`,
    mapper: HotelsMapper.mapDestinations,
    uiConfig: {
      title: 'אל',
      icon: 'icon-hotel',
      placeholder: 'לאן נוסעים?',
      titleMenuOptions: 'ערים פופולריות',
      allowAutoComplete: true,
    defaultValue: { label: "תל אביב", key: "TLV" }

    }
  },

[ESharedInputType.PASSANGERS_FLIGHTS]: {
  requestUrl: ``,
  autocompleteUrl: ``,
  mapper: () => [],
  uiConfig: {
    title: 'נוסעים',
    icon: 'icon-count-man',
    placeholder: 'בחר מספר נוסעים',
    titleMenuOptions: 'נוסעים לפי קבוצת גיל',
    allowAutoComplete: false
  }
},


[ESharedInputType.PICKER_DATES]: {
  requestUrl: '',
  mapper: () => [],
  uiConfig: {
    icon: 'ist-icon-calendar-2',
    placeholder: 'בחר תאריך',
    titleMenuOptions: '',
    allowAutoComplete: false,
    title: 'מתי',
  },
  dataConfig: new SharedCalendarInputConfig({
    suggestedDates: [],
    minDate: new Date(),
    maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    allowPickHours: false
  })
} as SharedInputConfig<SharedCalendarInputConfig>



}
