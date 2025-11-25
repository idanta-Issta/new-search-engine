// 📄 src/app/services/shared-passengers.service.ts

import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { ESharedInputType } from '../enums/ESharedInputType';
import { PassangersInput } from '../models/shared-passanger-input.models';

@Injectable({
  providedIn: 'root'
})
export class SharedPassengersService {

  getPassengersByType(type: ESharedInputType): Observable<PassangersInput> {
    switch (type) {
      case ESharedInputType.PASSANGERS_FLIGHTS:
        return of(this.getFlightPassengers());
             case ESharedInputType.PASSANGERS_ABOARD_HOTEL:
        return of(this.getAboardHotelPassengers());
      default:
        return of({ optionsAge: [], allowPickRoom: false });
    }
  }

private getFlightPassengers(): PassangersInput {
  return {
    allowPickRoom: false,
    optionsAge: [
      {
        title: 'קבוצות גיל',
        options: [
          { 
            label: 'מבוגר', 
            value: 'adult', 
            note: '(גיל 24–64)', 
            minCount: 2, 
            maxCount: 9,
            requiresSpecificAge: false
          },
          { 
            label: 'צעיר', 
            value: 'teen', 
            note: '(גיל 12–23)', 
            minCount: 0, 
            maxCount: 9,
            requiresSpecificAge: true,
            specificAgeOptions: [
              { label: '12', key: '12' },
              { label: '13', key: '13' },
              { label: '14', key: '14' },
              { label: '15', key: '15' },
              { label: '16', key: '16' },
              { label: '17', key: '17' },
              { label: '18', key: '18' },
              { label: '19', key: '19' },
              { label: '20', key: '20' },
              { label: '21', key: '21' },
              { label: '22', key: '22' },
              { label: '23', key: '23' }
            ],
            selectedAges: []
          },
          { 
            label: 'ילד', 
            value: 'child', 
            note: '(גיל 2–11)', 
            minCount: 0, 
            maxCount: 9,
            requiresSpecificAge: true,
            specificAgeOptions: [
              { label: '2', key: '2' },
              { label: '3', key: '3' },
              { label: '4', key: '4' },
              { label: '5', key: '5' },
              { label: '6', key: '6' },
              { label: '7', key: '7' },
              { label: '8', key: '8' },
              { label: '9', key: '9' },
              { label: '10', key: '10' },
              { label: '11', key: '11' }
            ],
            selectedAges: []
          },
          { 
            label: 'תינוק', 
            value: 'infant', 
            note: '(מתחת ל־2)', 
            minCount: 0, 
            maxCount: 9,
            requiresSpecificAge: false
          },
          { 
            label: 'פנסיונר', 
            value: 'senior', 
            note: '(גיל 65+)', 
            minCount: 0, 
            maxCount: 9,
            requiresSpecificAge: false
          }
        ]
      }
    ]
  };
}

private getAboardHotelPassengers(): PassangersInput {
  return {
    allowPickRoom: false,
    optionsAge: [
      {
        title: 'קבוצות גיל',
        options: [
          { 
            label: 'מבוגר', 
            value: 'adult', 
            note: '(גיל 18+)', 
            minCount: 2, 
            maxCount: 4,
            requiresSpecificAge: false
          },
          { 
            label: 'ילד', 
            value: 'teen', 
            note: '(מתחת ל18)', 
            minCount: 0, 
            maxCount: 5,
            requiresSpecificAge: true,
            specificAgeOptions: [
              { label: '0-1', key: '1' },
              { label: '13', key: '13' },
              { label: '14', key: '14' },
              { label: '15', key: '15' },
              { label: '16', key: '16' },
              { label: '17', key: '17' },
              { label: '18', key: '18' },
              { label: '19', key: '19' },
              { label: '20', key: '20' },
              { label: '21', key: '21' },
              { label: '22', key: '22' },
              { label: '23', key: '23' }
            ],
            selectedAges: []
          },
        ]
      }
    ]
  };
}
}
