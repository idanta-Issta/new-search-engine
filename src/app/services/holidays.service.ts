import { Injectable } from '@angular/core';
import { HOLIDAYS, Holiday } from '../constants/holidays';

@Injectable({
  providedIn: 'root'
})
export class HolidaysService {
  private holidayMap = new Map<string, string>();

  constructor() {
    this.buildHolidayMap();
  }

  /**
   * Build a fast lookup map: "YYYY-MM-DD" -> "חג name"
   */
  private buildHolidayMap(): void {
    Object.values(HOLIDAYS).forEach(yearHolidays => {
      yearHolidays.forEach(h => {
        // Normalize date to YYYY-MM-DD format
        const dateKey = this.normalizeDateString(h.date);
        this.holidayMap.set(dateKey, h.hebrew);
      });
    });
  }

  /**
   * Normalize date string to YYYY-MM-DD format
   */
  private normalizeDateString(dateStr: string): string {
    // Handle dates with time (e.g., "2025-01-01T17:05:00+02:00")
    if (dateStr.includes('T')) {
      return dateStr.split('T')[0];
    }
    return dateStr;
  }

  /**
   * Convert Date object to YYYY-MM-DD string
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Get holiday name for a specific date
   * @param date - Date object
   * @returns Holiday name in Hebrew or null if no holiday
   */
  getHoliday(date: Date): string | null {
    const dateKey = this.formatDate(date);
    return this.holidayMap.get(dateKey) || null;
  }

  /**
   * Check if a date is a holiday
   * @param date - Date object
   * @returns true if it's a holiday
   */
  isHoliday(date: Date): boolean {
    return this.getHoliday(date) !== null;
  }

  /**
   * Get all holidays for a specific year
   * @param year - Year number (e.g., 2025)
   * @returns Array of holidays for that year
   */
  getHolidaysForYear(year: number): Holiday[] {
    return HOLIDAYS[year] || [];
  }

  /**
   * Get simplified holiday name (remove only less important details)
   * @param holidayName - Full holiday name
   * @returns Simplified name
   */
  getSimplifiedName(holidayName: string): string {
    let simplified = holidayName;
    
    // Remove "ערב " prefix only
    simplified = simplified.replace(/^ערב\s+/, '');
    
    // Remove content in parentheses like "(חוה״מ)" or "(נדחה)"
    simplified = simplified.replace(/\s*\([^)]+\)/g, '');
    
    // Keep everything else including "– נר ראשון" etc.
    
    return simplified.trim();
  }
}
