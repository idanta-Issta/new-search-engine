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
  getProductPath(params: FlightSearchParams): { path: string; addResultLabel: boolean } {

    if (params.origin?.key === 'search-with-map-price') {
      return { path: 'flights/master', addResultLabel: false };
    }
    return { path: 'flights', addResultLabel: true };
  }

  buildUrl(params: FlightSearchParams): string {
    const queryParams: string[] = [];

    // תאריכים
    if (params.dates.start) {
      queryParams.push(`fdate=${this.formatDate(params.dates.start)}`);
    }
    if (params.dates.end) {
      queryParams.push(`tdate=${this.formatDate(params.dates.end)}`);
    }

    // route - 1 לכיוון אחד, 2 להלוך חזור
    const isOneWay = params.headerState.selectedTripType?.value === 'one-way';
    queryParams.push(`route=${isOneWay ? '1' : '2'}`);

    // יעד ומוצא
    if (params.origin?.key && params.origin.key !== 'search-with-map-price') {
      queryParams.push(`aport=${params.origin.key}`);
    }
 // יעד ומוצא
    if (params.origin?.key == 'search-with-map-price') {
      queryParams.push(`aport=allDes`);
    }
    if (params.destination?.key) {
      queryParams.push(`dport=${params.destination.key}`);
    }


    // נוסעים
    if (params.passengers) {
      const passengerParams = this.buildPassengerParams(params.passengers);
      queryParams.push(...passengerParams);
    } else {
      // ברירת מחדל: 2 מבוגרים
      queryParams.push('padt=2');
    }

    // Class (מחלקה) - רק אם לא תיירים
    if (params.headerState.selectedClass?.value) {
      const classValue = params.headerState.selectedClass.value;
      if (classValue === 'premium') {
        queryParams.push('cls=5');
      } else if (classValue === 'business') {
        queryParams.push('cls=2');
      } else if (classValue === 'first') {
        queryParams.push('cls=3');
      }
      // תיירים (economy) - אין צורך לציין
    }

    // Footer options
    if (params.footerState['direct']) {
      queryParams.push('fdirect=true');
    }
    if (params.footerState['flexible'] || params?.origin?.key == 'search-with-map-price')  {
      queryParams.push('mode=flex');
    }

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

    // הוספת כל הגילאים למערך אחד - chdr1a1, chdr1a2, chdr1a3...
    const allAges: number[] = [];
    
    if (teen && teen.selectedAges && teen.selectedAges.length > 0) {
      allAges.push(...teen.selectedAges);
    }
    if (child && child.selectedAges && child.selectedAges.length > 0) {
      allAges.push(...child.selectedAges);
    }

    // הוספת כל הגילאים עם אינדקס רץ
    allAges.forEach((age, index) => {
      params.push(`chdr1a${index + 1}=${age}`);
    });

    return params;
  }
}
