export interface SuggestedDate {
  date: Date;
  price?: string;
  currency?: string;
}

export interface ISharedCalendarInputConfig {
  suggestedDates?: any[];
  minDate?: Date | null;
  maxDate?: Date | null;
  allowPickHours?: boolean;
  forcePickOnlySuggested?: boolean;
}

export class SharedCalendarInputConfig implements ISharedCalendarInputConfig {

  suggestedDates: any[] = [];
  minDate: Date | null = null;
  maxDate: Date | null = null;
  allowPickHours: boolean = false;
  forcePickOnlySuggested: boolean = false;

  constructor(data?: Partial<ISharedCalendarInputConfig>) {
    Object.assign(this, data);
  }
}
