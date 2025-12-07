import { MenuOption } from '../models/shared-options-input.models';
import { PassangersInput } from '../models/shared-passanger-input.models';

interface FlightSegment {
  origin: MenuOption | null;
  destination: MenuOption | null;
  date: { start: Date | null; end: Date | null };
}

interface FlightsMultiDestinationParams {
  segments: FlightSegment[];
  passengers: PassangersInput | null;
}

export class FlightsMultiDestinationManager {
  
  buildUrl(params: FlightsMultiDestinationParams): string {
    const queryParams: string[] = [];
    debugger
    // בדיקה שיש לפחות segment אחד עם כל הפרטים
    if (!params.segments || params.segments.length === 0) {
      return '';
    }

    const firstSegment = params.segments[0];
    if (!firstSegment.origin || !firstSegment.destination || !firstSegment.date.start) {
      return '';
    }

    // route=3 (multi-destination)
    queryParams.push('route=3');

    // Segment ראשון
    queryParams.push(`dport=${firstSegment.origin.key}`);
    queryParams.push(`aport=${firstSegment.destination.key}`);
    queryParams.push(`fdate=${this.formatDate(firstSegment.date.start)}`);

    // Segments נוספים (2, 3, 4...)
    for (let i = 1; i < params.segments.length; i++) {
      const segment = params.segments[i];
      
      // רק אם יש origin, destination ו-date
      if (segment.origin && segment.destination && segment.date.start) {
        queryParams.push(`dport${i + 1}=${segment.origin.key}`);
        queryParams.push(`aport${i + 1}=${segment.destination.key}`);
        queryParams.push(`fdate${i + 1}=${this.formatDate(segment.date.start)}`);
      }
    }

    // נוסעים
    if (params.passengers) {
      const passengerParams = this.buildPassengerParams(params.passengers);
      queryParams.push(...passengerParams);
    }

    return queryParams.join('&');
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

  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }
}
