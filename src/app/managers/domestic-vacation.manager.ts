import { PassangersInput } from '../models/shared-passanger-input.models';

export interface DomesticVacationSearchParams {
  destination: any;
  dates: { start: Date | null; end: Date | null };
  passengers: PassangersInput;
  addFlight?: boolean;
}

export class DomesticVacationManager {
  buildUrl(params: DomesticVacationSearchParams): string {
    const queryParams: string[] = [];
    
    if (params.dates.start) {
      const checkin = this.formatDate(params.dates.start);
      queryParams.push(`fdate=${checkin}`);
    }
    if (params.dates.end) {
      const checkout = this.formatDate(params.dates.end);
      queryParams.push(`tdate=${checkout}`);
    }

    // isdomestic תמיד true
    queryParams.push('isdomestic=true');

    if( params.destination?.key == "all-hotels-eilat") {
       queryParams.push('dport=16');
    }else{
      if (params.destination?.hotelId) {
        // אם יש hotelId, dport תמיד 12
        queryParams.push('dport=12');
        queryParams.push(`hid=${params.destination.hotelId}`);
      } else if (params.destination?.key) {
        // אם אין hotelId, השתמש ב-key
        queryParams.push(`dport=${params.destination.key}`);
      }

    }

    // חדרים ונוסעים
    if (params.passengers.rooms && params.passengers.rooms.length > 0) {
      params.passengers.rooms.forEach((room, index) => {
        // מבוגרים
        if (room.adults > 0) {
          queryParams.push(`hotelrooms[${index}].adults=${room.adults}`);
        }
        
        // ילדים
        if (room.children > 0) {
          queryParams.push(`hotelrooms[${index}].children=${room.children}`);
        }
        
        // תינוקות
        if (room.infants > 0) {
          queryParams.push(`hotelrooms[${index}].infants=${room.infants}`);
        }
      });
    }

    // הוספת טיסה
    if (params.addFlight) {
      queryParams.push('addFlight=true');
    }

    return queryParams.join('&');
  }

  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }
}
