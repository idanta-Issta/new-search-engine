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
            { label: 'מבוגר', value: 'adult', minAge: 24, maxAge: 64, minCount: 2, maxCount: 9 },
            { label: 'צעיר', value: 'teen', minAge: 12, maxAge: 23, minCount: 0, maxCount: 9 },
            { label: 'ילד', value: 'child', minAge: 2, maxAge: 11, minCount: 0, maxCount: 9 },
            { label: 'תינוק', value: 'infant', minAge: 0, maxAge: 2, minCount: 0, maxCount: 9 },
            { label: 'פנסיונר', value: 'senior', minAge: 65, maxAge: 120, minCount: 0, maxCount: 9 }
          ]
        }
      ]
    };
  }
}
