

export interface SportSearchParams {
  eventType?: any;
  league?: any;
  team?: any;
  month?: any;
}

export class SportManager {
  buildUrl(params: SportSearchParams): string {
    const urlParams: string[] = [];
    
    if (params.league?.key && params.league.key !== 'all') {
      urlParams.push(`leaguecode=${params.league.key}`);
    }
    
    if (params.team?.key && params.team.key !== 'all') {
      urlParams.push(`teamcode=${params.team.key}`);
    }

    if (params.month?.key && params.month.key !== 'all') {
      const [selectedYear, selectedMonth] = params.month.key.split('-').map(Number);
      const now = new Date();
      const monthDiff = (selectedYear - now.getFullYear()) * 12 
                      + (selectedMonth - (now.getMonth() + 1));
      
      urlParams.push(`month=${monthDiff}`);
    }
    return urlParams.join('&');
  }
}
