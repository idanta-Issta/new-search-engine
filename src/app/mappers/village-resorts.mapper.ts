import { MenuOption } from '../models/shared-options-input.models';

export class VillageResortsMapper {
  static mapDestinations(data: any[]): MenuOption[] {
    if (!Array.isArray(data)) return [{ label: 'כל היעדים', key: 'all' }];
    
    const destinations = data.map(item => ({
      label: item.CityNameHe || item.CityNameEn || '',
      key: item.CityCode || '',
      CityCode: item.CityCode,
      CityId: item.CityId
    }));
    
    return [{ label: 'כל היעדים', key: 'all' }, ...destinations];
  }

  static mapCalendarDates(data: any): any[] {
    if (!data?.VillageResortOptions || !Array.isArray(data.VillageResortOptions)) {
      return [];
    }
    
    // Create a map to store all unique dates (both departure and return)
    const allDates = new Map<string, any>();
    
    data.VillageResortOptions.forEach((item: any) => {
      const departureDate = new Date(item.DepartureDate);
      const returnDate = new Date(item.ReturnDate);
      
      // Add departure date
      const depKey = item.DepartureDate;
      if (!allDates.has(depKey) || allDates.get(depKey).price > item.MinPrice) {
        allDates.set(depKey, {
          date: departureDate,
          available: true,
          price: item.MinPrice,
          currency: item.Currency
        });
      }
      
      // Add return date
      const retKey = item.ReturnDate;
      if (!allDates.has(retKey) || allDates.get(retKey).price > item.MinPrice) {
        allDates.set(retKey, {
          date: returnDate,
          available: true,
          price: item.MinPrice,
          currency: item.Currency
        });
      }
    });
    
    // Convert to array of suggested dates
    return Array.from(allDates.values());
  }
}
