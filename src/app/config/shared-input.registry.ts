import { ESharedInputType } from '../enums/ESharedInputType';
import { FlightsMapper } from '../mappers/flights.mapper';
import { HotelsMapper } from '../mappers/hotels.mapper';
import { AppExternalConfig } from '../config/app.external.config';
import { SharedInputConfig } from '../models/shared-input-config.models';

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
      title: 'יעד',
      icon: 'icon-hotel',
      placeholder: 'לאן נוסעים?',
      titleMenuOptions: 'ערים פופולריות',
      allowAutoComplete: true,
    defaultValue: { label: "תל אביב", key: "TLV" }

    }
  },

    [ESharedInputType.PICKER_DATES]: {
    requestUrl: '',         
    mapper: () => [],          // לא רלוונטי לקלנדר
    uiConfig: {
      icon: 'icon-calendar',
      placeholder: 'בחר תאריך',
      titleMenuOptions: '',
      allowAutoComplete: false,
      title: 'תאריך יציאה',
    }
  }

  
};
