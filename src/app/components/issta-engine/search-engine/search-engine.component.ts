import { Component, Input, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightsComponent } from '../tabs/flights/flights.component';
import { HotelAbroadComponent } from '../tabs/hotel-abroad/hotel-abroad.component';
import { ETypeSearchEngine } from '../../../enums/ETypeSearchEngine';

@Component({
  selector: 'app-search-engine',
  standalone: true,
  imports: [CommonModule, FlightsComponent, HotelAbroadComponent],
  templateUrl: './search-engine.component.html',
  styleUrls: ['./search-engine.component.scss']
})
export class SearchEngineComponent implements AfterViewInit {
  @Input() options: any;
  activeTab: any = null;
  ETypeSearchEngine = ETypeSearchEngine;

  ngAfterViewInit() {
    // נוודא שנטען אחרי שהסקריפט של window.SearchEngineConfig מוכן
    setTimeout(() => {
      if (!this.options && (window as any).SearchEngineConfig) {
        this.options = (window as any).SearchEngineConfig;
      }

      if (this.options?.defaultTab) {
        this.activeTab =
          this.options.tabs.find(
            (t: any) =>
              t.searchEngine?.typeTravel ===
              this.options.defaultTab?.typeTravel
          ) ?? this.options.tabs[0]; // fallback לטאב הראשון
      }

      console.log('✅ Tabs loaded:', this.options?.tabs);
      console.log('🎯 Active tab:', this.activeTab);
    });
  }

  selectTab(tab: any) {
    this.activeTab = tab;
  }

  getActiveType(): ETypeSearchEngine | undefined {
    return this.activeTab?.searchEngine?.typeTravel;
  }
}
