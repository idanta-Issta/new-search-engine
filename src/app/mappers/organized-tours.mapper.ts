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
}
