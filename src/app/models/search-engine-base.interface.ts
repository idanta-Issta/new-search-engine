// src/app/models/search-engine-base.interface.ts

import { ESharedInputType } from '../enums/ESharedInputType';
import { SearchEngineConfig } from '../config/search-engine.config';
import { HeaderState } from '../components/issta-engine/shared/header/search-header/search-header.component';

/**
 * Interface שכל מנוע חיפוש חייב לממש
 */
export interface ISearchEngine {
  /**
   * סדר ה-inputs במנוע החיפוש
   */
  readonly inputsOrder: ESharedInputType[];

  /**
   * מפת הערכים שנבחרו
   */
  valuesMap: Partial<Record<ESharedInputType, any>>;
  
  /**
   * מחזיר את הקונפיגורציה של המנוע (header + footer)
   */
  getConfig(): SearchEngineConfig;
  
  /**
   * מטפל באירוע בחירת input
   */
  onInputPicked(event: { type: ESharedInputType; value: any }): void;
  
  /**
   * מבצע חיפוש
   */
  onSearch(): void;
  
  /**
   * בונה URL לחיפוש
   */
  buildUrl(): string;
  
  /**
   * מטפל בשינוי מצב ה-header
   */
  onHeaderStateChange?(state: HeaderState): void;
  
  /**
   * מטפל בשינוי אופציות ה-footer
   */
  onFooterOptionChange?(event: { value: string; checked: boolean }): void;
}
