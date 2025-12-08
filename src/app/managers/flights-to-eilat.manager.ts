import { PassangersInput } from '../models/shared-passanger-input.models';

export interface FlightsToEilatSearchParams {
  origin: any;
  destination: any;
  dates: { start: Date | null; end: Date | null };
  passengers: PassangersInput;
  routeType: string;
}

export class FlightsToEilatManager {
  buildUrl(params: FlightsToEilatSearchParams): string {
    const queryParams: string[] = [];

    // תאריכים
    if (params.dates.start) {
      const departureDate = this.formatDate(params.dates.start);
      queryParams.push(`fdate=${departureDate}`);
    }

    if (params.dates.end && params.routeType === 'round_trip') {
      const returnDate = this.formatDate(params.dates.end);
      queryParams.push(`tdate=${returnDate}`);
    }

    // סוג מסלול
    const route = params.routeType === 'one_way' ? '1' : '2';
    queryParams.push(`route=${route}`);

    // נמל יציאה (origin הוא החזור, destination הוא ההלוך בטיסות אילת)
    if (params.destination?.value) {
      queryParams.push(`dport=${params.destination.value}`);
    }

    // נמל יעד (origin הוא החזור)
    if (params.origin?.value) {
      queryParams.push(`aport=${params.origin.value}`);
    }

    // נוסעים - בטיסות אילת יש חדרים, אבל בURL של טיסות רק מספר נוסעים
    if (params.passengers.rooms && params.passengers.rooms.length > 0) {
      const totalAdults = params.passengers.rooms.reduce((sum, room) => sum + room.adults, 0);
      const totalChildren = params.passengers.rooms.reduce((sum, room) => sum + room.children, 0);
      const totalInfants = params.passengers.rooms.reduce((sum, room) => sum + room.infants, 0);

      if (totalAdults > 0) {
        queryParams.push(`padt=${totalAdults}`);
      }
      if (totalChildren > 0) {
        queryParams.push(`pchd=${totalChildren}`);
      }
      if (totalInfants > 0) {
        queryParams.push(`pinf=${totalInfants}`);
      }
    }

    return queryParams.join('&');
  }

  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }

  getProductPath(): { path: string; addResultLabel: boolean } {
    return {
      path: 'israel/flightsresults.aspx',
      addResultLabel: false
    };
  }
}
