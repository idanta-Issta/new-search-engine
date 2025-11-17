import { MenuOption } from '../models/shared-options-input.models';

export const FlightsMapper = {


  /** 🛬 מיפוי מוצאים לטיסות */
  mapDestinations: (data: any[]): MenuOption[] => {
    return data.map(item => {
      const isAirport = !item.HotelLocationId;

      const label = isAirport
        ? `${item.CityNameHe}, שדה תעופה (${item.IataCode})`
        : `${item.CityNameHe}, ${item.CountryNameHe} (${item.IataCode})`;

      return {
        label,
        key: item.IataCode,
        icon: isAirport ? 'ist-icon-deals-flight' : 'icon-place',
        isPromoted: item.IsPopular || false
      };
    });
  }
};
