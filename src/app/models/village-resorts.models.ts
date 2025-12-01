export interface VillageResortsDestination {
  CityNameHe: string;
  CityNameEn: string;
  CityId: string;
  CityCode: string;
  IataCode: string | null;
  CountryNameHe: string | null;
  CountryNameEn: string | null;
  CountryId: number;
  RegionId: number;
  CountryCode: string | null;
  Priority: number;
  IsDefault: boolean;
  IsPopular: boolean;
  HotelLocationId: string | null;
  isDisabled: boolean;
  PlaceId: string | null;
  Phrases: string | null;
  IsCombined: boolean;
  Dport: number;
}

export interface VillageResortsOption {
  HotelId: string;
  DepartureDate: string;
  ReturnDate: string;
  DestinationCode: string;
  Currency: string;
  MinPrice: number;
  PackageType: number;
  VendorId: number;
  DepartureCode: string;
}

export interface VillageResortsSearchParams {
  destination: any;
  option: any;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
}
