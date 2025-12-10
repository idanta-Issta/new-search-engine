

import { PassengersRule, PassengersValidationContext } from '../models/shared-passanger-input.models';
import { EPassengerType } from '../enums/EPassengerType';

export const infantsNotExceedAdultsRule: PassengersRule = {
  name: 'infantsNotExceedAdults',
  errorMessage: 'מספר התינוקות לא יכול לעלות על מספר המבוגרים',
  validate: (context: PassengersValidationContext): boolean => {
    const adults = context.countsByType[EPassengerType.ADULT] || 0;
    const teens = context.countsByType[EPassengerType.TEEN] || 0;
    const seniors = context.countsByType[EPassengerType.SENIOR] || 0;
    const infants = context.countsByType[EPassengerType.INFANT] || 0;
    
    let infantsFromAge = 0;
    if (context.countsByAge) {
      infantsFromAge = (context.countsByAge['0'] || 0) + (context.countsByAge['1'] || 0);
    }
    
    const totalInfants = Math.max(infants, infantsFromAge);
    const totalAdults = adults + teens + seniors;
    
    return totalInfants <= totalAdults;
  }
};

export const atLeastOneAdultRule: PassengersRule = {
  name: 'atLeastOneAdult',
  errorMessage: 'חייב לפחות מבוגר אחד (מבוגר או צעיר)',
  validate: (context: PassengersValidationContext): boolean => {
    const adults = context.countsByType[EPassengerType.ADULT] || 0;
    const teens = context.countsByType[EPassengerType.TEEN] || 0;
    
    return (adults + teens) > 0;
  }
};

/**
 * רשימת כל חוקי הולידציה הזמינים
 */
export const PASSENGERS_VALIDATION_RULES = {
  infantsNotExceedAdults: infantsNotExceedAdultsRule,
  atLeastOneAdult: atLeastOneAdultRule
} as const;
