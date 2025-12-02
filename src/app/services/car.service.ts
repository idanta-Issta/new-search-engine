import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MenuOption } from '../models/shared-options-input.models';
import { CarMapper } from '../mappers/car.mapper';

@Injectable({ providedIn: 'root' })
export class CarService {
  private readonly baseUrl = '/car';

  constructor(private http: HttpClient) {}

  getCountries(): Observable<MenuOption[]> {
    return this.http.get<any[]>(`${this.baseUrl}/countries`).pipe(
      map(data => CarMapper.mapDestinations(data)),
      catchError(error => {
        console.error('Error fetching car countries:', error);
        return of([]);
      })
    );
  }

  getCities(countryCode: string): Observable<MenuOption[]> {
    return this.http.get<any[]>(`${this.baseUrl}/cities?countryCode=${countryCode}`).pipe(
      map(data => CarMapper.mapCities(data)),
      catchError(error => {
        console.error('Error fetching car cities:', error);
        return of([]);
      })
    );
  }
}
