import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ESharedInputType } from '../enums/ESharedInputType';
import { SharedInputRegistry } from '../config/shared-input.registry';
import { MenuOption } from '../models/shared-options-input.models';

@Injectable({ providedIn: 'root' })
export class SharedOptionsService {
  private cache: Record<string, MenuOption[]> = {};

  constructor(private apiService: ApiService) {}

getOptionsByType(type: ESharedInputType, excludeValues?: string[], dataConfig?: any): Observable<MenuOption[]> {
  const config = SharedInputRegistry[type];
  
  // אם יש listMenuOption מוגדר - נחזיר אותו ישירות ללא בקשת HTTP
  if (config?.listMenuOption) {
    const filtered = this.filterExcludedValues(config.listMenuOption, excludeValues);
    return of(filtered);
  }
  
  if (!config?.mapper && !config?.requestUrl) {
    console.warn(`⚠️ Missing mapper or requestUrl for input type: ${type}`);
    return of([]);
  }

  // אם אין requestUrl אבל יש mapper - קורא למapper ישירות
  if (!config?.requestUrl && config?.mapper) {
    const options = config.mapper(null, dataConfig);
    const filtered = this.filterExcludedValues(options, excludeValues);
    return of(filtered);
  }

  return this.apiService
    .get<any[]>(config.requestUrl!)
    .pipe(
      map(data => config.mapper ? config.mapper(data, dataConfig) : data),
      map(options => this.filterExcludedValues(options, excludeValues))
    );
}

private filterExcludedValues(options: MenuOption[], excludeValues?: string[]): MenuOption[] {
  if (!excludeValues || excludeValues.length === 0) return options;
  return options.filter(opt => {
    const optValue = opt.value || opt.key;
    return !excludeValues.includes(optValue || '');
  });
}

getOptionsWithCurrentValue(type: ESharedInputType, currentValue?: string, dataConfig?: any): Observable<MenuOption[]> {
  const config = SharedInputRegistry[type];
  
  // אם יש listMenuOption מוגדר
  if (config?.listMenuOption) {
    // סנן את excludeValues אבל השאר את הערך הנוכחי
    const excludeList = (config.excludeValues || []).filter(v => v !== currentValue);
    const filtered = this.filterExcludedValues(config.listMenuOption, excludeList);
    return of(filtered);
  }
  
  // אם אין requestUrl אבל יש mapper - קורא למapper ישירות
  if (!config?.requestUrl && config?.mapper) {
    const options = config.mapper(null, dataConfig);
    const excludeList = (config.excludeValues || []).filter(v => v !== currentValue);
    const filtered = this.filterExcludedValues(options, excludeList);
    return of(filtered);
  }
  
  if (!config?.requestUrl) {
    console.warn(`⚠️ Missing requestUrl for input type: ${type}`);
    return of([]);
  }

  const excludeList = (config.excludeValues || []).filter(v => v !== currentValue);
  return this.apiService
    .get<any[]>(config.requestUrl!)
    .pipe(
      map(data => config.mapper ? config.mapper(data, dataConfig) : data),
      map(options => this.filterExcludedValues(options, excludeList))
    );
}


/** 🪄 AutoComplete חכם עם cache ומיזוג */
searchAutocomplete(type: ESharedInputType, term: string): Observable<MenuOption[]> {
  const config = SharedInputRegistry[type];
  if (!config?.autocompleteUrl) return of([]);

  const normalizedTerm = this.normalizeTerm(term);
  const url = `${config.autocompleteUrl}?term=${encodeURIComponent(term)}`;
  const cacheKey = `${type}_${normalizedTerm}`;

  // fallback mapper — תמיד פונקציה אמיתית
  const mapper = config.mapper ?? ((data: any[]) => data);

  // אם יש cache מלא למונח המדויק – נחזיר אותו מיד
  if (this.cache[cacheKey]?.length) {
    return of(this.cache[cacheKey]);
  }

  // אם אין cache מדויק – ננסה למצוא prefix קרוב
  const prefixKey = this.findClosestCacheKey(type, normalizedTerm);

  if (prefixKey) {
    const cachedSubset = this.filterCachedForTerm(this.cache[prefixKey], normalizedTerm);
    // מחזירים את subset מיד, ומריצים קריאה ברקע לעדכן
    this.fetchAndMerge(type, url, normalizedTerm, mapper);
    return of(cachedSubset);
  }

  // אם אין בכלל cache — נשלח בקשה רגילה
  return this.apiService.get<any[]>(url).pipe(
    map(data => {
      const mapped = mapper(data || []);
      this.cache[cacheKey] = mapped;
      return mapped;
    })
  );
}


  /** 🔍 מחפש key קרוב בקאש (prefix) */
  private findClosestCacheKey(type: ESharedInputType, term: string): string | null {
    const normalized = this.normalizeTerm(term);
    const keys = Object.keys(this.cache)
      .filter(k => k.startsWith(`${type}_`))
      .sort((a, b) => b.length - a.length);

    for (const key of keys) {
      const searchTerm = key.replace(`${type}_`, '');
      if (normalized.startsWith(searchTerm)) return key;
    }
    return null;
  }

  /** 🧩 מסנן תוצאות קיימות בקאש שמתאימות למונח הנוכחי */
  private filterCachedForTerm(cached: MenuOption[], term: string): MenuOption[] {
    const t = term.toLowerCase();
    return cached.filter(opt =>
      opt.label.toLowerCase().includes(t) ||
      (typeof opt.key === 'string' && opt.key.toLowerCase().includes(t)) ||
      opt.note?.toLowerCase().includes(t)
    );
  }

  /** 🔄 מביא תוצאות חדשות וממזג רק מה שחסר */
  private fetchAndMerge(
    type: ESharedInputType,
    url: string,
    term: string,
    mapper: (data: any[]) => MenuOption[]
  ) {
    this.apiService.get<any[]>(url).pipe(
      map(data => mapper(data || [])),
      tap(newResults => {
        const key = `${type}_${term}`;
        const current = this.cache[key] || [];

        const merged = [
          ...current,
          ...newResults.filter(r => !current.some(c => c.key === r.key))
        ];

        this.cache[key] = merged;
      })
    ).subscribe();
  }

  /** 🧼 מנרמל מחרוזות כדי למנוע רווחים / אותיות גדולות */
  private normalizeTerm(term: string): string {
    return term.trim().toLowerCase();
  }

  /** 🗑️ מנקה cache עבור סוג input ספציפי */
  clearCacheForType(type: ESharedInputType): void {
    const prefix = `${type}_`;
    Object.keys(this.cache)
      .filter(key => key.startsWith(prefix))
      .forEach(key => delete this.cache[key]);
  }
}
