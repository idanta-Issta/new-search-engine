import { MenuOption } from '../models/shared-options-input.models';

export class SportMapper {
  static mapLeagues(data: any[]): MenuOption[] {
    if (!Array.isArray(data)) return [{ label: 'כל הליגות', key: 'all' }];
    
    const leagues = data.map(item => ({
      label: item.GroupNameHe || '',
      key: String(item.GroupCode || ''),
    }));
    
    // Always include 'all' option at the beginning
    return [{ label: 'כל הליגות', key: 'all' }, ...leagues];
  }

  static mapTeams(data: any[]): MenuOption[] {
    if (!Array.isArray(data)) return [{ label: 'כל הקבוצות', key: 'all' }];
    
    const teams = data.map(item => ({
      label: item.GroupNameHe || '',
      key: String(item.GroupCode || ''),
    }));
    
    // Always include 'all' option at the beginning
    return [{ label: 'כל הקבוצות', key: 'all' }, ...teams];
  }
}
