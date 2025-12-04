import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { App } from './app/app';



bootstrapApplication(App, {
  providers: [
    provideAnimations(),
    provideHttpClient()
  ]
});


window.addEventListener('error', (event) => {
  console.error('Global Error:', event.error || event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
});
