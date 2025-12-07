import { PassangersInput } from '../models/shared-passanger-input.models';

export interface HotelSearchParams {
  destination: any;
  dates: { start: Date | null; end: Date | null };
  passengers: PassangersInput | null;
}

export class HotelsManager {
  buildUrl(params: HotelSearchParams): string {
    const queryParams: string[] = [];
    debugger
    // תאריכים
    if (params.dates.start) {
      const checkin = this.formatDate(params.dates.start);
      queryParams.push(`fdate=${checkin}`);
    }
    if (params.dates.end) {
      const checkout = this.formatDate(params.dates.end);
      queryParams.push(`tdate=${checkout}`);
    }

    // isdomestic תמיד false
    queryParams.push('isdomestic=false');

    // יעד - dport
    if (params.destination?.key) {
      queryParams.push(`${params.destination?.isPlaceId ? 'placeId' : 'dport'}=${params.destination.key}`);
    }

    // חדרים ונוסעים - תמיד rooms=1
    queryParams.push('rooms=1');

    // אם יש נוסעים
    console.log('🏨 passengers:', params.passengers);
    console.log('🏨 passengers.optionsAge:', params.passengers?.optionsAge);
    
    if (params.passengers?.optionsAge) {
      const allOptions = params.passengers.optionsAge.flatMap(group => group.options);
      console.log('🏨 allOptions:', allOptions);
      
      const adultOption = allOptions.find(opt => opt.value === 'adult');
      const childOption = allOptions.find(opt => opt.value === 'teen');
      
      console.log('🏨 adultOption:', adultOption);
      console.log('🏨 childOption:', childOption);

      
      // מבוגרים - adt1
      const adults = adultOption?.count || 2;
      console.log('🏨 adults count:', adults);
      queryParams.push(`adt1=${adults}`);
      
      // ילדים - chd1 (סך הכל)
      const children = (childOption?.count || 0) ;
      console.log('🏨 children count:', children);


      
      if (children > 0) {
        queryParams.push(`chd1=${children}`);
        
        // גילאי ילדים - chdr1a1, chdr1a2, chdr1a3...
        const allAges: number[] = [];
        
        console.log('🏨 childOption.selectedAges:', childOption?.selectedAges);
  
        
        if (childOption?.selectedAges) {
          allAges.push(...childOption.selectedAges);
        }
  
        
        console.log('🏨 allAges:', allAges);
        
        allAges.forEach((age, index) => {
          const ageValue = age == 0 ? 1 : age; // מינימום גיל תינוק הוא 1
          queryParams.push(`chdr1a${index + 1}=${ageValue}`);
        });
      }
    } else {
      console.log('❌ NO passengers.optionsAge - using default');
      // ברירת מחדל - 2 מבוגרים
      queryParams.push('adt1=2');
    }


    return queryParams.join('&');
  }

  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }
}
