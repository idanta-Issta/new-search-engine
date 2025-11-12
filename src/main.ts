import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { App } from './app/app';

console.log('Running in browser?', typeof window !== 'undefined');


bootstrapApplication(App, {
  providers: [
    provideAnimations(),
    provideHttpClient() // ✅ תוסיף את זה כאן
  ]
});


window.addEventListener('error', (event) => {
  console.error('Global Error:', event.error || event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
});
