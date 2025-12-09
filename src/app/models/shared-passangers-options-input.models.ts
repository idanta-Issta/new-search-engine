export interface PassengersOption {
  label: string;
  key: string;
  adults: number;
  children: number;
  childAges?: number[];
}

export interface PassengersOptionsInput {
  maxRoomsPick?: number;
  selectedOption?: PassengersOption;
  rooms?: PassengersOption[];
}
