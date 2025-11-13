export interface SuggestedDate {
  date: Date;
  price?: string;
  currency?: string;
}

export interface CalendarConfig {
  suggestedDates?: SuggestedDate[];
  minDate?: Date;
  maxDate?: Date;
  allowPickHours?: boolean;
}
