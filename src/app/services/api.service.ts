import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface ApiCallOptions {
  /** Function to call while loading (e.g., show "טוען יעדים...") */
  onLoading?: () => void;
  /** Function to call on success with the response */
  onSuccess?: (data: any) => void;
  /** Function to call on error with the error object */
  onError?: (error: any) => void;
  /** Force fetch even if cached (default: false) */
  forceRefresh?: boolean;
  /** Response type (default: 'json') */
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private cache = new Map<string, any>();

  constructor(private http: HttpClient) {
    console.log('🔵 ApiService initialized');
  }

  /**
   * Perform GET request with caching
   * @param url - API endpoint URL
   * @param options - Optional callbacks and configuration
   */
  get<T = any>(url: string, options: ApiCallOptions = {}): Observable<T> {
    const {
      onLoading,
      onSuccess,
      onError,
      forceRefresh = false,
      responseType = 'json'
    } = options;

    // Check cache first (unless forceRefresh is true)
    if (!forceRefresh && this.cache.has(url)) {
      console.log('📦 Cache hit for:', url);
      const cachedData = this.cache.get(url);
      
      // Call onSuccess immediately with cached data
      if (onSuccess) {
        setTimeout(() => onSuccess(cachedData), 0);
      }
      
      return of(cachedData);
    }

    console.log('🚀 Fetching from API:', url);
    
    // Call onLoading callback
    if (onLoading) {
      onLoading();
    }

    const request$ = this.http.get<T>(url, { responseType: responseType as any }).pipe(
      tap((response) => {
        console.log('✅ API Response received for:', url);
        
        // Save to cache
        this.cache.set(url, response);
        
        // Call onSuccess callback
        if (onSuccess) {
          onSuccess(response);
        }
      }),
      catchError((error) => {
        console.error('❌ API Error for:', url, error);
        
        // Call onError callback
        if (onError) {
          onError(error);
        }
        
        // Re-throw the error
        throw error;
      })
    );

    // ⭐ Auto-subscribe if callbacks are provided
    if (onLoading || onSuccess || onError) {
      request$.subscribe({
        error: () => {} // Prevent unhandled error
      });
    }

    return request$;
  }

  /**
   * Clear all cached responses
   */
  clearCache(): void {
    console.log('🗑️ Clearing API cache');
    this.cache.clear();
  }

  /**
   * Clear specific URL from cache
   */
  clearCacheForUrl(url: string): void {
    console.log('🗑️ Clearing cache for:', url);
    this.cache.delete(url);
  }

  /**
   * Check if URL is cached
   */
  isCached(url: string): boolean {
    return this.cache.has(url);
  }
}
