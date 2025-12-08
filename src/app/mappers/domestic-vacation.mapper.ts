import { MenuOption } from '../models/shared-options-input.models';
import { ESharedInputType } from '../enums/ESharedInputType';

export class DomesticVacationMapper {
  static mapDestinations(data: any): MenuOption[] {
    console.log('[DomesticVacationMapper] RAW DATA RECEIVED:', JSON.stringify(data, null, 2));
    
    const hotels = data?.Hotels || [];
    const destinations = data?.Destinations || [];
    
    console.log('[DomesticVacationMapper] Hotels array:', hotels);
    console.log('[DomesticVacationMapper] Destinations array:', destinations);

    // Combine both hotels and destinations
    const allItems = [...hotels, ...destinations];
    console.log('[DomesticVacationMapper] Combined items count:', allItems.length);

    const mappedResults = allItems.map((item: any, index: number) => {
      console.log(`[DomesticVacationMapper] ===== Mapping item ${index} =====`);
      console.log(`[DomesticVacationMapper] Item data:`, JSON.stringify(item, null, 2));
      
      // For hotels, use HotelName, for destinations use CityNameHe
      const name = item.HotelName || item.CityNameHe || item.Name || item.LocationName || 'Unknown';
      const countryName = item.CountryNameHe || '';
      
      console.log(`[DomesticVacationMapper] Extracted name: "${name}"`);
      console.log(`[DomesticVacationMapper] Extracted countryName: "${countryName}"`);
      
      // אם זה מלון (HotelId קיים), הוסף את שם העיר
      let label;
      if (item.HotelId && item.CityNameHe) {
        label = `${name}, ${item.CityNameHe}`;
      } else {
        label = countryName ? `${name}, ${countryName}` : name;
      }
      
      console.log(`[DomesticVacationMapper] Created label: "${label}"`);
      
      // For hotels use HotelId, for destinations use IataCode - convert to string
      const key = String(item.CityCode + (item?.HotelId ? item?.HotelId : ''));
      
      console.log(`[DomesticVacationMapper] Created key: "${key}"`);
      console.log(`[DomesticVacationMapper] HotelId: ${item?.HotelId}`);
      console.log(`[DomesticVacationMapper] IsPopular: ${item.IsPopular}`);
      
      const result = {
        label,
        key,
        hotelId: item?.HotelId || null,
        icon: 'icon-hotel',
        isPromoted: item.IsPopular || false
      };
      
      console.log(`[DomesticVacationMapper] ===== Final result ${index}:`, JSON.stringify(result, null, 2));
      return result;
    });
    
    console.log('[DomesticVacationMapper] ===== ALL MAPPED RESULTS =====');
    console.log(JSON.stringify(mappedResults, null, 2));
    return mappedResults;
  }

}
