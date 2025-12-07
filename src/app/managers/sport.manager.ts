import { PassangersInput } from '../models/shared-passanger-input.models';

export interface SportSearchParams {
  eventType?: any;
  league?: any;
  team?: any;
  month?: any;
}

export class SportManager {
  buildUrl(params: SportSearchParams): string {
    const urlParams: string[] = [];
    
    // leagueCode - אם לא בחרו "כל הליגות"
    if (params.league?.key && params.league.key !== 'all') {
      urlParams.push(`leaguecode=${params.league.key}`);
    }
    
    // teamCode - אם לא בחרו "כל הקבוצות"
    if (params.team?.key && params.team.key !== 'all') {
      urlParams.push(`teamcode=${params.team.key}`);
    }
    
    // month - מספר החודשים מהחודש הנוכחי (רק אם לא בחרו "כל התאריכים")
    if (params.month?.date && params.month.key !== 'all') {
      const now = new Date();
      const selectedDate = new Date(params.month.date);
      
      // חישוב ההפרש בחודשים
      const monthDiff = (selectedDate.getFullYear() - now.getFullYear()) * 12 
                      + (selectedDate.getMonth() - now.getMonth());
      
      urlParams.push(`month=${monthDiff}`);
    }

    return urlParams.join('&');
  }
}
