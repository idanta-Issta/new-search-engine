import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MenuOption } from '../models/shared-options-input.models';
import { SkiMapper } from '../mappers/ski.mapper';

@Injectable({ providedIn: 'root' })
export class SkiService {
  private readonly baseUrl = '/ski';

  constructor(private http: HttpClient) {}

  getDestinations(): Observable<MenuOption[]> {
    return this.http.get<any[]>(`${this.baseUrl}/destinations`).pipe(
      map(data => SkiMapper.mapDestinations(data)),
      catchError(error => {
        console.error('Error fetching ski destinations:', error);
        return of([]);
      })
    );
  }

  getResorts(countryCode: string): Observable<MenuOption[]> {
    return this.http.get<any[]>(`${this.baseUrl}/resorts?countryCode=${countryCode}`).pipe(
      map(data => SkiMapper.mapResorts(data)),
      catchError(error => {
        console.error('Error fetching ski resorts:', error);
        return of([]);
      })
    );
  }

  getSuggestedDates(resortCode: string, departureDate: Date): Observable<Date[]> {
    // Mock implementation - replace with actual API call
    return of([
      new Date(departureDate.getTime() + 7 * 24 * 60 * 60 * 1000),
      new Date(departureDate.getTime() + 14 * 24 * 60 * 60 * 1000),
      new Date(departureDate.getTime() + 21 * 24 * 60 * 60 * 1000)
    ]);
  }
}
