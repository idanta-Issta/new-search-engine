import { MenuOption } from '../models/shared-options-input.models';

export class OrganizedToursMapper {
  static mapRegions(data: any[]): MenuOption[] {
    if (!Array.isArray(data)) return [{ label: 'כל היעדים', key: 'all' }];
    
    const regions = data.map(item => ({
      label: item.RegionNameHe || '',
      key: String(item.RegionId || ''),
    }));
    
    // Always include 'all' option at the beginning
    return [{ label: 'כל היעדים', key: 'all' }, ...regions];
  }

  static mapCountries(data: any[]): MenuOption[] {
    if (!Array.isArray(data)) return [{ label: 'כל המדינות', key: 'all' }];
    
    const countries = data.map(item => ({
      label: item.CountryNameHe || '',
      key: String(item.CountryId || ''),
    }));
    
    // Always include 'all' option at the beginning
    return [{ label: 'כל המדינות', key: 'all' }, ...countries];
  }

  static mapCategories(data: any[]): MenuOption[] {
    if (!Array.isArray(data)) return [{ label: 'כל הקטגוריות', key: 'all' }];
    
    const categories = data.map(item => ({
      label: item.Name || '',
      key: String(item.Id || ''),
    }));
    
    // Always include 'all' option at the beginning
    return [{ label: 'כל הקטגוריות', key: 'all' }, ...categories];
  }

  static mapMonths(): MenuOption[] {
    const months = [];
    const monthNames = [
      'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
      'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
    ];
    
    // Add 'all dates' option first
    months.push({
      label: 'כל התאריכים',
      key: 'all'
    });
    
    const currentDate = new Date();
    
    for (let i = 0; i < 10; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const monthName = monthNames[date.getMonth()];
      const year = date.getFullYear();
      const monthValue = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      months.push({
        label: `${monthName} ${year}`,
        key: monthValue
      });
    }
    
    return months;
  }
}
