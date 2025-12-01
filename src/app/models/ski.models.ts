export interface SkiDestination {
  CityNameHe: string | null;
  CityNameEn: string | null;
  CityId: string | null;
  CityCode: string | null;
  IataCode: string | null;
  CountryNameHe: string;
  CountryNameEn: string;
  CountryId: number;
  RegionId: number;
  CountryCode: string;
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

export interface SkiResort {
  CityNameHe: string;
  CityNameEn: string | null;
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

export interface SkiPassengers {
  adults: number;
  children: number;
  infants: number;
}

export interface SkiSearchParams {
  destination: SkiDestination | null;
  resort: SkiResort | null;
  departureDate: Date | null;
  passengers: SkiPassengers;
}
