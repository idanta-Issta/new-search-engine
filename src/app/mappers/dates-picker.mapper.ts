import { MenuOption } from '../models/shared-options-input.models';

export class DatesPickerMapper {
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
