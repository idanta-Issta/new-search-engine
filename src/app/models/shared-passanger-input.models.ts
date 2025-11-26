// 📁 shared-passanger-input.models.ts

export interface PassangersInput {
  optionsAge: OptionAge[];
  allowPickRoom: boolean;
  maxRoomsPick?: number;
  maxTotalPassengers?: number;
  maxPassengersInRoom?: number;
  rooms?: RoomPassengers[];
}

export interface RoomPassengers {
  roomNumber: number;
  adults: number;
  children: number;
  infants: number;
}

export interface OptionAge {
  title: string;
  options: AgeGroup[];
}

export interface AgeOption {
  label: string;
  key: string;
}

export interface AgeGroup {
  label: string;
  value: string;
  note: string;
  minCount: number;
  maxCount: number;
  count?: number;
  defaultValue?: number;
  requiresSpecificAge: boolean;
  specificAgeOptions?: AgeOption[];
  selectedAges?: number[];
}


