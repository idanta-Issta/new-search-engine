import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ESharedInputType } from '../enums/ESharedInputType';
import { SharedInputRegistry } from '../config/shared-input.registry';
import { MenuOption } from '../models/shared-options-input.models';

@Injectable({ providedIn: 'root' })
export class SharedOptionsService {
  private cache: Record<string, MenuOption[]> = {};

  constructor(private http: HttpClient) {}

  /** 🧭 טעינה רגילה של רשימת אפשרויות לפי סוג */
  getOptionsByType(type: ESharedInputType): Observable<MenuOption[]> {
    const config = SharedInputRegistry[type];
    if (!config) throw new Error(`❌ Unknown input type: ${type}`);

    return this.http.get<any[]>(config.requestUrl).pipe(map(config.mapper));
  }

  /** 🪄 AutoComplete חכם עם cache ומיזוג */
  searchAutocomplete(type: ESharedInputType, term: string): Observable<MenuOption[]> {
    const config = SharedInputRegistry[type];
    if (!config?.autocompleteUrl) return of([]);

    const normalizedTerm = this.normalizeTerm(term);
    const url = `${config.autocompleteUrl}?term=${encodeURIComponent(term)}`;
    const cacheKey = `${type}_${normalizedTerm}`;

    // אם יש cache מלא למונח המדויק – נחזיר אותו מיד
    if (this.cache[cacheKey]?.length) {
      return of(this.cache[cacheKey]);
    }

    // אם אין cache מדויק – ננסה למצוא prefix קרוב
    const prefixKey = this.findClosestCacheKey(type, normalizedTerm);

    if (prefixKey) {
      const cachedSubset = this.filterCachedForTerm(this.cache[prefixKey], normalizedTerm);
      // מחזירים את subset מיד, ומריצים קריאה ברקע לעדכן
      this.fetchAndMerge(type, url, normalizedTerm, config.mapper);
      return of(cachedSubset);
    }

    // אם אין בכלל cache — נשלח בקשה רגילה
    return this.http.get<any[]>(url).pipe(
      map(data => {
        const mapped = config.mapper(data || []);
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
      opt.key?.toLowerCase().includes(t) ||
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
    this.http.get<any[]>(url).pipe(
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
}
