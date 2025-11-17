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
  note: string;
  minCount: number;
  maxCount: number;
  requiresSpecificAge: boolean; // האם חייב לבחור גיל ספציפי
  specificAgeOptions?: number[]; // רשימת הגילאים האפשריים
  selectedAges?: number[]; // הגילאים שנבחרו (אחד לכל נוסע)
}


