import { ESharedInputType } from '../models/shared-input-type.enum';
import { FlightsMapper } from '../mappers/flights.mapper';
import { HotelsMapper } from '../mappers/hotels.mapper';
import { AppExternalConfig } from '../config/app.external.config';
import { SharedInputConfig } from '../interfaces/shared-input-config.interface'

export const SharedInputRegistry: Record<ESharedInputType, SharedInputConfig> = {
  [ESharedInputType.DESTINATIONS_FLIGHTS]: {
    requestUrl: `${AppExternalConfig.baseUrl}${AppExternalConfig.endpoints.flights.destinations}`,
    autocompleteUrl: `${AppExternalConfig.baseUrl}flights/autocomplete`,
    mapper: FlightsMapper.mapDestinations,
    uiConfig: {
      icon: 'icon-flight',
      placeholder: 'לאן טסים?',
      titleMenuOptions: 'יעדים פופולריים',
      allowAutoComplete: true
    }
  },

 [ESharedInputType.ORIGINS_FLIGHTS]: {
  requestUrl: `${AppExternalConfig.baseUrl}${AppExternalConfig.endpoints.flights.origins}`,
    autocompleteUrl: `${AppExternalConfig.baseUrl}flights/autocomplete`,
  mapper: FlightsMapper.mapOrigins,
  uiConfig: {
    icon: 'icon-flight-takeoff',
    placeholder: 'מאיפה ממריאים?',
    titleMenuOptions: 'שדות תעופה מובילים',
    allowAutoComplete: true,

  }
},


  [ESharedInputType.DESTINATIONS_HOTELS]: {
    requestUrl: `${AppExternalConfig.baseUrl}${AppExternalConfig.endpoints.hotels.destinations}`,
    autocompleteUrl: `${AppExternalConfig.baseUrl}hotels/autocomplete`,
    mapper: HotelsMapper.mapDestinations,
    uiConfig: {
      icon: 'icon-hotel',
      placeholder: 'לאן נוסעים?',
      titleMenuOptions: 'ערים פופולריות',
      allowAutoComplete: true
    }
  }
};
