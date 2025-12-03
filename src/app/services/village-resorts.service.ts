import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MenuOption } from '../models/shared-options-input.models';
import { VillageResortsMapper } from '../mappers/village-resorts.mapper';

@Injectable({ providedIn: 'root' })
export class VillageResortsService {
  private readonly baseUrl = '/village-resorts';

  constructor(private apiService: ApiService) {}

  getDestinations(): Observable<MenuOption[]> {
    return this.apiService.get<any[]>(`${this.baseUrl}/all-destinations`).pipe(
      map(data => VillageResortsMapper.mapDestinations(data)),
      catchError(error => {
        console.error('Error fetching village resorts destinations:', error);
        return of([]);
      })
    );
  }

  getCalendarDates(destinationCode: string, hotelId: string = '', from: string | null = null): Observable<any[]> {
    const url = `${this.baseUrl}/village-resort-options?destinationCode=${destinationCode}&hotelId=${hotelId}&from=${from || 'null'}`;
    return this.apiService.get<any>(url).pipe(
      map(data => VillageResortsMapper.mapCalendarDates(data)),
      catchError(error => {
        console.error('Error fetching village resort dates:', error);
        return of([]);
      })
    );
  }
}
