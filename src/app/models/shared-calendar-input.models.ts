export interface SuggestedDate {
  date: Date;
  price?: string;
  currency?: string;
}

export interface SharedCalendarInputConfig {
  suggestedDates: SuggestedDate[];
  minDate?: Date;
  maxDate?: Date;
  allowPickHours?: boolean;
}
