import { MenuOption } from '../models/shared-options-input.models';
import { PassangersInput } from '../models/shared-passanger-input.models';
import { AppExternalConfig } from '../config/app.external.config';
import { HeaderState } from '../components/issta-engine/shared/header/search-header/search-header.component';

export interface FlightSearchParams {
  origin: MenuOption | null;
  destination: MenuOption | null;
  dates: { start: Date | null; end: Date | null };
  passengers: PassangersInput | null;
  headerState: HeaderState;
  footerState: { [key: string]: boolean };
}

export class FlightsManager {
  buildUrl(params: FlightSearchParams): string {
    const queryParams: string[] = [];

    // תאריכים
    if (params.dates.start) {
      queryParams.push(`fdate=${this.formatDate(params.dates.start)}`);
    }
    if (params.dates.end) {
      queryParams.push(`tdate=${this.formatDate(params.dates.end)}`);
    }

    // route תמיד 2
    queryParams.push('route=2');

    // יעד ומוצא (משתמשים ב-key שמכיל את קוד שדה התעופה)
    if (params.destination?.key) {
      queryParams.push(`dport=${params.destination.key}`);
    }
    if (params.origin?.key) {
      queryParams.push(`aport=${params.origin.key}`);
    }

    // נוסעים
    if (params.passengers) {
      const passengerParams = this.buildPassengerParams(params.passengers);
      queryParams.push(...passengerParams);
    } else {
      // אם אין נוסעים, ברירת מחדל
      const passengerParams = this.buildPassengerParams(null);
      queryParams.push(...passengerParams);
    }

    // Class (מדרגה)
    if (params.headerState.selectedClass?.value) {
      queryParams.push(`class=${params.headerState.selectedClass.value}`);
    }

    // Footer options
    if (params.footerState['direct']) {
      queryParams.push('direct=1');
    }
    if (params.footerState['flexible']) {
      queryParams.push('flexible=1');
    }

    // תמיד main_sort=price
    queryParams.push('main_sort=price');

    return queryParams.join('&');
  }

  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }

  private buildPassengerParams(passengers: PassangersInput | null): string[] {
    const params: string[] = [];
    
    // אם אין נוסעים, ברירת מחדל: 2 מבוגרים
    if (!passengers || !passengers.optionsAge || passengers.optionsAge.length === 0) {
      params.push('padt=2');
      return params;
    }

    const allOptions = passengers.optionsAge.flatMap(group => group.options);

    // ספירת כל סוג נוסע
    const adult = allOptions.find(opt => opt.value === 'adult');
    const teen = allOptions.find(opt => opt.value === 'teen');
    const child = allOptions.find(opt => opt.value === 'child');
    const infant = allOptions.find(opt => opt.value === 'infant');
    const senior = allOptions.find(opt => opt.value === 'senior');

    // הוספת כמויות
    if (adult && adult.minCount > 0) {
      params.push(`padt=${adult.minCount}`);
    }
    if (teen && teen.minCount > 0) {
      params.push(`pyou=${teen.minCount}`);
    }
    if (child && child.minCount > 0) {
      params.push(`pchd=${child.minCount}`);
    }
    if (infant && infant.minCount > 0) {
      params.push(`pinf=${infant.minCount}`);
    }
    if (senior && senior.minCount > 0) {
      params.push(`psnr=${senior.minCount}`);
    }

    // הוספת גילאי צעירים
    if (teen && teen.selectedAges && teen.selectedAges.length > 0) {
      teen.selectedAges.forEach((age, index) => {
        params.push(`chdr1a${index + 1}=${age}`);
      });
    }

    // הוספת גילאי ילדים
    if (child && child.selectedAges && child.selectedAges.length > 0) {
      child.selectedAges.forEach((age, index) => {
        params.push(`chdr2a${index + 1}=${age}`);
      });
    }

    return params;
  }
}
