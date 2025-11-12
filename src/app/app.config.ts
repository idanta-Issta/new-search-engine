// File: src/app/app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// ✅ HttpClient
import { provideHttpClient, withFetch } from '@angular/common/http';

// ✅ Hydration (עוזר ל־SSR/CSR)
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

// ✅ אנימציות — השתמש בגרסה הא־סינכרונית אם זמינה (Angular 17+)
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
// במקרה שהפרויקט שלך לא תומך ב־async, תוכל להחליף בשורה הזאת:
// import { provideAnimations } from '@angular/platform-browser/animations';

// ✅ טיפול בשגיאות דפדפן
import { provideBrowserGlobalErrorListeners } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
  provideHttpClient(), 
    provideAnimationsAsync()
  ]
};
