import { PassangersInput } from '../models/shared-passanger-input.models';

export interface DomesticVacationSearchParams {
  destination: any;
  dates: { start: Date | null; end: Date | null };
  passengers: PassangersInput | null;
  addFlight?: boolean;
}

export class DomesticVacationManager {
  buildUrl(params: DomesticVacationSearchParams): string {
    const urlParams = new URLSearchParams();
    
    if (params.dates.start) {
      urlParams.append('checkIn', params.dates.start.toISOString().split('T')[0]);
    }
    if (params.dates.end) {
      urlParams.append('checkOut', params.dates.end.toISOString().split('T')[0]);
    }
    if (params.passengers) {
      urlParams.append('passengers', JSON.stringify(params.passengers));
    }
    if (params.addFlight) {
      urlParams.append('addFlight', 'true');
    }

    return urlParams.toString();
  }
}
