import { SuggestedDate } from '../models/shared-calendar-input.model.ts';

export interface SharedCalendarInputConfig {
  suggestedDates: SuggestedDate[];
  minDate?: Date;
  maxDate?: Date;
  allowPickHours?: boolean;
}
