import { MenuOption } from '../models/shared-options-input.models';
import { ESharedInputType } from '../enums/ESharedInputType';

export class DomesticVacationMapper {
  static mapDestinations(data: any): MenuOption[] {
    
    const hotels = data?.Hotels || [];
    const destinations = data?.Destinations || [];
    

    // Combine both hotels and destinations
    const allItems = [...hotels, ...destinations];
    console.log('[DomesticVacationMapper] Combined items count:', allItems.length);

    const mappedResults = allItems.map((item: any, index: number) => {
      console.log(`[DomesticVacationMapper] Mapping item ${index}:`, item);
      
      // For hotels, use HotelName, for destinations use CityNameHe
      const name = item.HotelName || item.CityNameHe || item.Name || item.LocationName || 'Unknown';
      const countryName = item.CountryNameHe || '';
      
      // אם זה מלון (HotelId קיים), הוסף את שם העיר
      let label;
      if (item.HotelId && item.CityNameHe) {
        label = `${name}, ${item.CityNameHe}`;
      } else {
        label = countryName ? `${name}, ${countryName}` : name;
      }
      
      // For hotels use HotelId, for destinations use IataCode - convert to string
      const key = String(item.CityCode || '');
      
      const result = {
        label,
        key,
        icon: 'icon-hotel',
        isPromoted: item.IsPopular || false
      };
      
      console.log(`[DomesticVacationMapper] Mapped result ${index}:`, result);
      return result;
    });
    
    console.log('[DomesticVacationMapper] Final mapped results:', mappedResults);
    return mappedResults;
  }

}
