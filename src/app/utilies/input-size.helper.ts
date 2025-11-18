import { EInputSize } from '../enums/EInputSize';
import { InputConfig } from '../models/input-config.model';

export class InputSizeHelper {
  private static readonly MAX_ROW_WIDTH = 1045;
  private static readonly BUTTON_WIDTH = 150; // רוחב כפתור החיפוש
  private static readonly GAP = 8; // רווח בין אלמנטים

  /**
   * מחשב רוחב חכם לאינפוטים + כפתור
   * מחלק את 1045px בצורה שווה בין כל האלמנטים
   */
  static calculateWidths(inputConfigs: InputConfig[]): { inputWidths: number[]; buttonWidth: number } {
    const totalInputs = inputConfigs.length;
    const totalGaps = totalInputs; // gaps between inputs + gap before button
    const totalGapWidth = totalGaps * this.GAP;
    
    // רוחב זמין לאינפוטים + כפתור
    const availableWidth = this.MAX_ROW_WIDTH - totalGapWidth;
    
    // רוחב שווה לכל אחד
    const equalWidth = Math.floor(availableWidth / (totalInputs + 1));
    
    return {
      inputWidths: new Array(totalInputs).fill(equalWidth),
      buttonWidth: equalWidth
    };
  }

  /**
   * מחזיר רוחב לאינפוט בודד (fallback למצב ישן)
   */
  static getWidth(size: EInputSize): string {
    const sizeMap: Record<EInputSize, string> = {
      [EInputSize.SMALL]: '150px',
      [EInputSize.MEDIUM]: '200px',
      [EInputSize.LARGE]: '300px',
      [EInputSize.HUGE]: '500px'
    };
    return sizeMap[size];
  }

  /**
   * מחזיר רוחב כפתור ברירת מחדל
   */
  static getButtonWidth(): number {
    return this.BUTTON_WIDTH;
  }
}
