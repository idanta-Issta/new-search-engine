// 📁 shared-passanger-input.models.ts

export interface PassangersInput {
  optionsAge: OptionAge[];
  allowPickRoom: boolean;
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
  requiresSpecificAge: boolean;
  specificAgeOptions?: AgeOption[];
  selectedAges?: number[];
}


