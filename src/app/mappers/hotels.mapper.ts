import { MenuOption } from '../models/shared-options-input.models';
import { ESharedInputType } from '../enums/ESharedInputType';

export class HotelsMapper {
  static mapDestinations(data: any): MenuOption[] {

    const destinations = data?.Destinations || [];
    return destinations.map((item: any) => {
      if (item.PlaceId) {
        return {
          label: item.CityNameEn || '',
          key: item.PlaceId,
          value: item.PlaceId,
          icon: 'icon-place',
          isPromoted: item.IsPopular || false,
          isPlaceId: true
        };
      }
      
      const label = `${item.CityNameHe}, ${item.CountryNameHe}`;
      return {
        label,
        key: item.CityCode,
        value: item.HotelLocationId || item.IataCode,
        icon: 'icon-hotel',
        isPromoted: item.IsPopular || false,
      };
    });
  }

  static mapOrigins(data: any[]): MenuOption[] {
    return (data || []).map(item => ({
      value: item.code || item.id || '',
      label: item.city || item.airportName || item.name || 'Unknown origin'
    }));
  }
}
