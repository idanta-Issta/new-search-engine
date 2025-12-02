import { MenuOption } from '../models/shared-options-input.models';

export class CarMapper {
  static mapDestinations(data: any[]): MenuOption[] {
    
    const destinations = data
      .filter(item => item.CountryCode && item.CountryNameHe)
      .map(item => ({
        label: item.CountryNameHe || item.CountryNameEn || '',
        key: item.CountryCode || '',
        CountryCode: item.CountryCode,
        CountryId: item.CountryId || undefined,
        RegionId: item.RegionId || undefined
      }));
    
    return [...destinations];
  }

  static mapCities(data: any[]): MenuOption[] {
    if (!Array.isArray(data)) return [];
    
    const cities = data
      .filter(item => item.CityCode && (item.CityNameHe || item.CityNameEn))
      .map(item => ({
        label: item.CityNameHe || item.CityNameEn || '',
        key: item.CityCode || '',
        CityCode: item.CityCode,
        CityId: item.CityId || undefined,
        CountryCode: item.CountryCode || undefined
      }));
    
    return cities;
  }

  static mapResorts(data: any[]): MenuOption[] {
    if (!Array.isArray(data)) return [{ label: 'כל האתרים', key: 'all' }];
    
    const resorts = data.map(item => ({
      label: item.CityNameHe || item.CityNameEn || '',
      key: item.CityCode || '',
      CityCode: item.CityCode,
      CityId: item.CityId
    }));
    
    return [{ label: 'כל האתרים', key: 'all' }, ...resorts];
  }

  static mapCalendarDates(data: any): any[] {
    if (!data?.Dates || !Array.isArray(data.Dates)) return [];
    
    return data.Dates.map((item: any) => {
      const date = new Date(item.Date);
      return {
        date: date,
        available: true,
        price: item.MinPrice,
        currency: item.CurrencySymbol
      };
    });
  }
}
