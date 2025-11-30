import { MenuOption } from '../models/shared-options-input.models';
import { SuggestedDate } from '../models/shared-calendar-input.models';

export class DynamicPackagesMapper {
  static mapDestinations(data: any[]): MenuOption[] {
    if (!Array.isArray(data)) return [];
    
    const destinations = data.map(item => {
      // Build label: "CityName, CountryName (CODE)"
      const cityName = item.CityNameHe || '';
      const countryName = item.CountryNameHe || '';
      const cityCode = item.CityCode || '';
      
      const label = `${cityName}, ${countryName} (${cityCode})`;
      
      return {
        label: label,
        key: item.CityCode || '',
        extraData: {
          countryNameHe: item.CountryNameHe,
          cityId: item.CityId,
          dport: item.Dport,
          isCombined: item.IsCombined
        }
      };
    });
    
    return destinations;
  }

  static mapCalendarDates(response: any): SuggestedDate[] {
    if (!response || !Array.isArray(response.Dates)) return [];
    
    return response.Dates.map((item: any) => ({
      date: new Date(item.Date),
      price: item.MinPrice?.toString(),
      currency: item.CurrencySymbol || '$'
    }));
  }
}
