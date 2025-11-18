

export const TEXTS = {
  SEARCH: {
    BUTTON: 'חיפוש',
    PLACEHOLDER: {
      DESTINATION: 'לאן נוסעים?',
      ORIGIN: 'מאיפה יוצאים?',
      DATES: 'בחר תאריך',
      PASSENGERS: 'בחר נוסעים',
      HOTEL_DESTINATION: 'יעד, שכונה או מלון ספציפי'
    },
    INPUT_TITLES: {
      TO: 'אל',
      FROM: 'מוצא',
      WHEN: 'מתי',
      WHERE: 'איפה נופשים הפעם?'
    },
    MENU_TITLES: {
      POPULAR_DESTINATIONS: 'יעדים פופולריים'
    }
  },
  HEADER: {
    FLIGHTS_TITLE: 'חיפוש טיסות זולות לחו"ל',
    HOTEL_ABROAD_TITLE: 'חיפוש מלונות בחו"ל'
  },
  CHOICES: {
    FLIGHT_ONLY: 'טיסה בלבד',
    FLIGHT_HOTEL: 'טיסה + מלון',
    HOTEL_ONLY: 'מלון בלבד',
    HOTEL_FLIGHT: 'מלון + טיסה',
    BEST_DEAL: 'הכי משתלם'
  },
  PROMOTION: {
    BEST_DEAL: 'הכי משתלם'
  },
  TRIP_TYPE: {
    ROUND_TRIP: 'הלוך ושוב',
    ONE_WAY: 'כיוון אחד',
    MULTI_CITY: 'ריבוי יעדים'
  },
  CLASS: {
    ECONOMY: 'מחלקת תיירים',
    PREMIUM: 'מחלקת פרימיום',
    BUSINESS: 'מחלקת עסקים',
    FIRST: 'מחלקה ראשונה'
  },
  TABS: {
    RECOMMENDED_HOTELS: 'מלונות מומלצים',
    BOUTIQUE_HOTELS: 'מלונות בוטיק'
  },
  FOOTER: {
    INFO: {
      ANY_VACATION: 'כל סוג של נופש',
      PAYMENT_PLAN: 'פריסת תשלומים נוחה',
      AVAILABLE: 'זמינים בשבילכם',
      RECOMMENDED_HOTELS: 'מלונות מומלצים',
      FREE_CANCELLATION: 'ביטול חינם',
      SPECIAL_PRICES: 'מחירים מיוחדים'
    },
    OPTIONS: {
      DIRECT_FLIGHTS: 'טיסות ישירות',
      FLEXIBLE_SEARCH: 'חיפוש גמיש +/- 3 ימים',
      BOUTIQUE_ONLY: 'רק מלונות בוטיק',
      BREAKFAST_INCLUDED: 'כולל ארוחת בוקר'
    }
  },
  PASSENGERS: {
    LABEL: 'נוסעים',
    COUNT_SUFFIX: 'נוסעים'
  }
} as const;

export const ICONS = {
  CALENDAR: 'ist-icon-calendar-2',
  USER: 'icon-user',
  PASSENGER: 'icon-count-man',
  PLANE: 'ist-icon-deals-flight',
  HOTEL: 'icon-rate_sleep',
  SEARCH: 'icon-search',
  CHEVRON_DOWN: 'chevron-down',
  CHEVRON_UP: 'chevron-up'
} as const;

export const VALUES = {
  CHOICES: {
    FLIGHT_ONLY: 'flight-only',
    FLIGHT_HOTEL: 'flight-hotel',
    HOTEL_ONLY: 'hotel-only',
    HOTEL_FLIGHT: 'hotel-flight',
    BEST_DEAL: 'best'
  },
  TRIP_TYPE: {
    ROUND_TRIP: 'round-trip',
    ONE_WAY: 'one-way',
    MULTI_CITY: 'multi-city'
  },
  CLASS: {
    ECONOMY: 'economy',
    PREMIUM: 'premium',
    BUSINESS: 'business',
    FIRST: 'first'
  },
  TABS: {
    RECOMMENDED: 'recommended',
    BOUTIQUE: 'boutique'
  },
  FOOTER_OPTIONS: {
    DIRECT: 'direct',
    FLEXIBLE: 'flexible',
    BOUTIQUE: 'boutique',
    BREAKFAST: 'breakfast'
  }
} as const;
