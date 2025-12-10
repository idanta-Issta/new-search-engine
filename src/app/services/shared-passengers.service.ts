// 📄 src/app/services/shared-passengers.service.ts

import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { ESharedInputType } from '../enums/ESharedInputType';
import { EPassengerType } from '../enums/EPassengerType';
import { 
  PassangersInput, 
  PassengersRule, 
  PassengersValidationContext 
} from '../models/shared-passanger-input.models';
import { PASSENGERS_VALIDATION_RULES } from '../config/passengers-validation-rules';

@Injectable({
  providedIn: 'root'
})
export class SharedPassengersService {
  // Shift (px) applied per room (desktop only)
  readonly ROOMS_MARGIN_SHIFT = 230;

  // Calculate cumulative right margin for given rooms count
  getRoomsMargin(roomsCount: number): number {
    if (roomsCount <= 1) return 0;
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      return - (roomsCount - 1) * this.ROOMS_MARGIN_SHIFT; // negative to push left
    }
    return 0;
  }

  /**
   * בדיקת חוקי ולידציה על נוסעים
   * @returns מערך של הודעות שגיאה (ריק אם הכל תקין)
   */
  validatePassengers(
    input: PassangersInput,
    countsByType: Record<string, number>,
    countsByAge?: Record<string, number>
  ): string[] {
    console.log('validatePassengers called');
    console.log('input.rules:', input.rules);
    console.log('countsByType:', countsByType);
    console.log('countsByAge:', countsByAge);
    
    if (!input.rules || input.rules.length === 0) {
      console.log('No rules found, returning empty errors');
      return [];
    }

    const totalPassengers = Object.values(countsByType).reduce((sum, count) => sum + count, 0);
    const context: PassengersValidationContext = {
      countsByType,
      countsByAge,
      totalPassengers
    };
    console.log('Validation context:', context);

    const errors: string[] = [];
    for (const rule of input.rules) {
      console.log('Checking rule:', rule.name);
      const isValid = rule.validate(context);
      console.log('Rule', rule.name, 'result:', isValid);
      if (!isValid) {
        console.log('Rule failed, adding error:', rule.errorMessage);
        errors.push(rule.errorMessage);
      }
    }

    console.log('Final errors:', errors);
    return errors;
  }

  /**
   * בדיקה האם ניתן להוסיף נוסע מסוג מסוים
   * @returns אובייקט עם allowed (true/false) והודעת שגיאה אם יש
   */
  canIncrease(
    input: PassangersInput,
    passengerType: string,
    countsByType: Record<string, number>,
    countsByAge?: Record<string, number>
  ): { allowed: boolean; errorMessage?: string } {
    console.log('canIncrease called for type:', passengerType);
    console.log('Current countsByType:', countsByType);
    
    // צור עותק עם הנוסע הנוסף
    const simulatedCounts = { ...countsByType };
    simulatedCounts[passengerType] = (simulatedCounts[passengerType] || 0) + 1;
    console.log('Simulated countsByType:', simulatedCounts);

    // הרץ ולידציה על המצב המדומה
    const errors = this.validatePassengers(input, simulatedCounts, countsByAge);

    if (errors.length > 0) {
      console.log('canIncrease returning false with error:', errors[0]);
      return { allowed: false, errorMessage: errors[0] };
    }

    console.log('canIncrease returning true');
    return { allowed: true };
  }

  /**
   * בניית countsByType מתוך PassangersInput
   */
  getCountsByType(input: PassangersInput): Record<string, number> {
    const counts: Record<string, number> = {};

    if (input.allowPickRoom && input.rooms) {
      // מצב חדרים - ספור מתוך rooms
      input.rooms.forEach(room => {
        counts[EPassengerType.ADULT] = (counts[EPassengerType.ADULT] || 0) + room.adults;
        counts[EPassengerType.CHILD] = (counts[EPassengerType.CHILD] || 0) + room.children;
        counts[EPassengerType.INFANT] = (counts[EPassengerType.INFANT] || 0) + room.infants;
      });
    } else {
      // מצב רגיל - ספור מתוך optionsAge
      input.optionsAge.forEach(group => {
        group.options.forEach(option => {
          if (option.count && option.count > 0) {
            counts[option.value] = (counts[option.value] || 0) + option.count;
          }
        });
      });
    }

    return counts;
  }

  /**
   * בניית countsByAge מתוך PassangersInput (רק אם יש selectedAges)
   */
  getCountsByAge(input: PassangersInput): Record<string, number> | undefined {
    const counts: Record<string, number> = {};
    let hasAges = false;

    input.optionsAge.forEach(group => {
      group.options.forEach(option => {
        if (option.selectedAges && option.selectedAges.length > 0) {
          hasAges = true;
          option.selectedAges.forEach(age => {
            const ageKey = age.toString();
            counts[ageKey] = (counts[ageKey] || 0) + 1;
          });
        }
      });
    });

    return hasAges ? counts : undefined;
  }

  getPassengersByType(type: ESharedInputType): Observable<PassangersInput> {
    switch (type) {
      case ESharedInputType.PASSANGERS_FLIGHTS:
        return of(this.getFlightPassengers());
        case ESharedInputType.PASSANGERS_MULTI_FLIGHTS:
        return of(this.getMultiFlightPassengers());
      case ESharedInputType.PASSANGERS_ABOARD_HOTEL:
        return of(this.getAboardHotelPassengers());
      case ESharedInputType.PASSANGERS_DOMESTIC_VACATION:
        return of(this.getDomesticVacationPassengers(true, 36, 9, 2));
      case ESharedInputType.PASSANGERS_FLIGHTS_EILAT:
        return of(this.getDomesticVacationPassengers(false, 9, 0));
      case ESharedInputType.PASSANGERS_FLIGHTS_AND_HOTEL_EILAT:
        return of(this.getDomesticVacationPassengers(true, 7, 7, 1));
      case ESharedInputType.SKI_PASSENGERS:
        return of(this.getSkiPassengers());
      default:
        return of({ optionsAge: [], allowPickRoom: false });
    }
  }

private getFlightPassengers(): PassangersInput {
  return {
    allowPickRoom: false,
    maxTotalPassengers: 9,
    rules: [
      PASSENGERS_VALIDATION_RULES.infantsNotExceedAdults,
      PASSENGERS_VALIDATION_RULES.atLeastOneAdult
    ],
    optionsAge: [
      {
        title: 'קבוצות גיל',
        options: [
          { 
            label: 'מבוגר', 
            value: EPassengerType.ADULT, 
            note: '(גיל 24–64)', 
            minCount: 0,
            defaultValue: 2,
            maxCount: 9,
            requiresSpecificAge: false
          },
          { 
            label: 'צעיר', 
            value: EPassengerType.TEEN, 
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
            value: EPassengerType.CHILD, 
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
            value: EPassengerType.INFANT, 
            note: '(מתחת ל־2)', 
            minCount: 0, 
            maxCount: 9,
            requiresSpecificAge: false
          },
          { 
            label: 'פנסיונר', 
            value: EPassengerType.SENIOR, 
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


private getMultiFlightPassengers(): PassangersInput {
  return {
    allowPickRoom: false,
    maxTotalPassengers: 9,
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
            requiresSpecificAge: false,
            selectedAges: []
          },
          { 
            label: 'ילד', 
            value: 'child', 
            note: '(גיל 2–11)', 
            minCount: 0, 
            maxCount: 9,
            requiresSpecificAge: false,
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
              { label: '0-1', key: '0-1' },
              { label: '2', key: '2' },
              { label: '3', key: '3' },
              { label: '4', key: '4' },
              { label: '5', key: '5' },
              { label: '6', key: '6' },
              { label: '7', key: '7' },
              { label: '8', key: '8' },
              { label: '9', key: '9' },
              { label: '10', key: '10' },
              { label: '11', key: '11' },
              { label: '12', key: '12' },
              { label: '13', key: '13' },
              { label: '14', key: '14' },
              { label: '15', key: '15' },
              { label: '16', key: '16' },
              { label: '17', key: '17' }
            ],
            selectedAges: []
          },
        ]
      }
    ]
  };
}

private getDomesticVacationPassengers(
  includeRooms: boolean = true,
  maxTotalPassengers: number = 9, 
  maxPassengersInRoom: number = 9,
maxRoomsPick = 4): PassangersInput {
  return {
    allowPickRoom: includeRooms,
    maxRoomsPick: includeRooms ? maxRoomsPick : 1,
    maxTotalPassengers: maxTotalPassengers,
    maxPassengersInRoom: includeRooms ? maxPassengersInRoom : undefined,
    rooms: [
      {
        roomNumber: 1,
        adults: 2,
        children: 0,
        infants: 0
      }
    ],
    optionsAge: [
      {
        title: 'קבוצות גיל',
        options: [
          { 
            label: 'מבוגר', 
            value: 'adult', 
            note: '(גיל 12+)', 
            minCount: 1, 
            maxCount: 6,
            defaultValue: 2,
            requiresSpecificAge: false
          },
          { 
            label: 'ילד', 
            value: 'child', 
            note: '(גיל 2-11)', 
            minCount: 0, 
            maxCount: 4,
            defaultValue: 0,
            requiresSpecificAge: false,
            selectedAges: []
          },
          { 
            label: 'תינוק', 
            value: 'infant', 
            note: '(מתחת ל-2)', 
            minCount: 0, 
            maxCount: 2,
            defaultValue: 0,
            requiresSpecificAge: false
          }
        ]
      }
    ]
  };
}

private getSkiPassengers(): PassangersInput {
  return {
    allowPickRoom: false,
    maxTotalPassengers: 9,
    optionsAge: [
      {
        title: 'נוסעים',
        options: [
          { 
            label: 'מבוגר', 
            value: 'adult', 
            note: '(מעל גיל 12)', 
            minCount: 1, 
            maxCount: 9,
            defaultValue: 2,
            requiresSpecificAge: false
          },
          { 
            label: 'ילד', 
            value: 'child', 
            note: '(גיל 2-11)', 
            minCount: 0, 
            maxCount: 4,
            defaultValue: 0,
            requiresSpecificAge: false,
            selectedAges: []
          },
          { 
            label: 'תינוק', 
            value: 'infant', 
            note: '(מתחת ל-2)', 
            minCount: 0, 
            maxCount: 2,
            defaultValue: 0,
            requiresSpecificAge: false
          }
        ]
      }
    ]
  };
}
}
