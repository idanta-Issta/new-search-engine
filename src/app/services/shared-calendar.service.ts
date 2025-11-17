import { Injectable } from '@angular/core';
import { SuggestedDate } from '../models/shared-calendar-input.models';

export interface CalendarDay {
  date: Date;
  other: boolean;
  suggested?: SuggestedDate | null;
  disabled?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SharedCalendarService {

     /** מחזיר תאריך חדש של חודש + offset */
  shiftMonth(base: Date, offset: number): Date {
    return new Date(base.getFullYear(), base.getMonth() + offset, 1);
  }

  /** בדיקת תאריך זהה בדיוק */
  isSameDate(d1?: Date, d2?: Date): boolean {
    if (!d1 || !d2) return false;
    return d1.toDateString() === d2.toDateString();
  }


  /** כמות ימים בחודש */
  daysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  /** יצירת רשימת ימים עבור חודש כולל ימים מהחודש הקודם/הבא */
  generateMonthDays(
    year: number,
    month: number,
    suggested: SuggestedDate[] = [],
    minDate?: Date | null,
    maxDate?: Date | null
  ): CalendarDay[] {

    const total = this.daysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay(); // 0–6

    const days: CalendarDay[] = [];

    // ימים מהחודש הקודם
    for (let i = 0; i < firstDay; i++) {
      const d = new Date(year, month, -(firstDay - 1 - i));
      days.push({ date: d, other: true });
    }

    // ימים בחודש הנוכחי
    for (let d = 1; d <= total; d++) {
      const date = new Date(year, month, d);

      const match = suggested.find(s =>
        this.isSameDate(new Date(s.date), date)
      );

      // בדיקה אם התאריך מחוץ לטווח המותר
      let disabled = false;
      if (minDate) {
        const minDateOnly = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
        const currentDateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        if (currentDateOnly < minDateOnly) disabled = true;
      }
      if (maxDate && !disabled) {
        const maxDateOnly = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
        const currentDateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        if (currentDateOnly > maxDateOnly) disabled = true;
      }

      days.push({
        date,
        other: false,
        suggested: match,
        disabled
      });
    }

    return days;
  }

  /** Days in a month */
  getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  /** First weekday of a month (0–6) */
  getFirstDay(year: number, month: number): number {
    return new Date(year, month, 1).getDay();
  }

  /** Check if a date is between start and end */
  isInRange(date: Date, start?: Date, end?: Date): boolean {
    if (!start || !end) return false;
    return date > start && date < end;
  }

  /** Returns suggested matching date if found */
  getSuggested(date: Date, suggestions: SuggestedDate[]): SuggestedDate | null {
    return suggestions.find(x =>
      new Date(x.date).toDateString() === date.toDateString()
    ) || null;
  }


}
