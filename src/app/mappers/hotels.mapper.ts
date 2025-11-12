import { MenuOption } from '../models/shared-options-input.models';
import { ESharedInputType } from '../models/shared-input-type.enum';

export class HotelsMapper {
  static mapDestinations(data: any[]): MenuOption[] {
    return (data || []).map(item => ({
      value: item.code || item.id || '',
      label: item.name || item.cityName || item.airportName || 'Unknown destination'
    }));
  }

  static mapOrigins(data: any[]): MenuOption[] {
    return (data || []).map(item => ({
      value: item.code || item.id || '',
      label: item.city || item.airportName || item.name || 'Unknown origin'
    }));
  }
}
