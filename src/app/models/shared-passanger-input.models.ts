// 📁 shared-passanger-input.models.ts

export interface PassangersInput {
  optionsAge: OptionAge[];
  allowPickRoom: boolean;
}

export interface OptionAge {
  title: string;
  options: AgeGroup[];
}

export interface AgeGroup {
  label: string;
  value: string;
  note: string; // 👈 חדש
  minCount: number;
  maxCount: number;
}


