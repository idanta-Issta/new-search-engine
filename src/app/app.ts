import { Component, signal } from '@angular/core';
import { SearchEngineComponent } from './components/issta-engine/main-search-engine/search-engine.component';

@Component({
  selector: 'app-root',
   standalone: true,
  imports: [SearchEngineComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('issta-engine');
}
