import { ChoiceOption } from '../components/issta-engine/shared/header/header-choices/header-choices.component';
import { TabOption } from '../components/issta-engine/shared/header/header-tabs/header-tabs.component';
import { DropdownOption } from '../components/issta-engine/shared/header/header-dropdown/header-dropdown.component';
import { FooterOption } from '../components/issta-engine/shared/footer/footer-options/footer-options.component';

export interface SearchEngineConfig {
  header: {
    title: string;
    choices: ChoiceOption[];
    defaultChoice: string;
    tabs: TabOption[];
    tripTypeOptions: DropdownOption[];
    defaultTripType: string;
    classOptions: DropdownOption[];
    defaultClass: string;
  };
  footer: {
    infoItems: string[];
    options: FooterOption[];
  };
}

export const FLIGHTS_CONFIG: SearchEngineConfig = {
  header: {
    title: 'חיפוש טיסות זולות לחו"ל',
    choices: [
      { label: 'טיסה בלבד', value: 'flight-only' },
      { label: 'טיסה + מלון', value: 'flight-hotel' }
    ],
    defaultChoice: 'flight-only',
    tabs: [],
    tripTypeOptions: [
      { label: 'הלוך ושוב', value: 'round-trip' },
      { label: 'כיוון אחד', value: 'one-way' },
      { label: 'ריבוי יעדים', value: 'multi-city' }
    ],
    defaultTripType: 'round-trip',
    classOptions: [
      { label: 'מחלקת תיירים', value: 'economy' },
      { label: 'מחלקת פרימיום', value: 'premium' },
      { label: 'מחלקת עסקים', value: 'business' },
      { label: 'מחלקה ראשונה', value: 'first' }
    ],
    defaultClass: 'economy'
  },
  footer: {
    infoItems: [
      'כל סוג של נופש',
      'פריסת תשלומים נוחה',
      'דילים גמישים בשבלכם'
    ],
    options: [
      { label: 'טיסות ישירות', value: 'direct', checked: false },
      { label: 'חיפוש גמיש ±3 ימים', value: 'flexible', checked: false }
    ]
  }
};

export const HOTEL_ABROAD_CONFIG: SearchEngineConfig = {
  header: {
    title: 'חיפוש מלונות בחו"ל',
    choices: [
      { label: 'הכי משתלם', value: 'best' },
      { label: 'מלון בלבד', value: 'hotel-only' },
      { label: 'מלון + טיסה', value: 'hotel-flight' }
    ],
    defaultChoice: 'best',
    tabs: [
      { label: 'מלונות מומלצים', value: 'recommended', active: true },
      { label: 'מלונות בוטיק', value: 'boutique', active: false }
    ],
    tripTypeOptions: [],
    defaultTripType: '',
    classOptions: [],
    defaultClass: ''
  },
  footer: {
    infoItems: [
      'מלונות מומלצים',
      'ביטול חינם',
      'מחירים מיוחדים'
    ],
    options: [
      { label: 'רק מלונות בוטיק', value: 'boutique', checked: false },
      { label: 'כולל ארוחת בוקר', value: 'breakfast', checked: false }
    ]
  }
};
