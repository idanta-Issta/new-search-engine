export interface OrganizedToursSearchParams {
  region: any;
  country: any;
  category: any;
  month: any;
}

export class OrganizedToursManager {
  buildUrl(params: OrganizedToursSearchParams): string {
    const queryParams: string[] = [];

    // Region
    if (params.region?.key && params.region.key !== 'all') {
      queryParams.push(`region=${params.region.key}`);
    }

    if (params.country?.key && params.country.key !== 'all') {
      queryParams.push(`country=${params.country.key}`);
    }


    if (params.category?.key && params.category.key !== 'all') {
      queryParams.push(`type=${params.category.key}`);
    }

    if (params.month?.key) {
      const monthNumber = this.calculateMonthsFromNow(params.month.key);
      if (monthNumber !== null) {
        queryParams.push(`month=${monthNumber}`);
      }
    }

    // Passengers - קבוע
    queryParams.push('roompax[0].adt=2');

    return queryParams.join('&');
  }

  private calculateMonthsFromNow(monthKey: string): number | null {
    if (!monthKey) return null;

    // monthKey format: "2026-02" (YYYY-MM)
    const [year, month] = monthKey.split('-').map(Number);
    if (!year || !month) return null;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-12

    // Calculate difference in months
    const monthsDiff = (year - currentYear) * 12 + (month - currentMonth);

    return monthsDiff;
  }

  getProductPath(): { path: string; addResultLabel: boolean } {
    return {
      path: 'trips/results.aspx',
      addResultLabel: false
    };
  }
}
