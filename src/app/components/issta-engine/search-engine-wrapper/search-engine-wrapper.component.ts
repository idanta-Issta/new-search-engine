import { Component, Input, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightsComponent } from '../engines/flights/flights.component';
import { HotelAbroadComponent } from '../engines/hotel-abroad/hotel-abroad.component';
import { SportComponent } from '../engines/sport/sport.component';
import { OrganizedToursComponent } from '../engines/organized-tours/organized-tours.component';
import { DomesticVacationComponent } from '../engines/domestic-vacation/domestic-vacation.component';
import { ETypeSearchEngine } from '../../../enums/ETypeSearchEngine';
import { getSearchEngineTabsConfig } from '../../../config/search-engine-tabs.config';

@Component({
  selector: 'app-search-engine',
  standalone: true,
  imports: [CommonModule, FlightsComponent, HotelAbroadComponent, DomesticVacationComponent, SportComponent, OrganizedToursComponent],
  templateUrl: './search-engine-wrapper.component.html',
  styleUrls: ['./search-engine-wrapper.component.scss']
})
export class SearchEngineComponent implements AfterViewInit {
  @Input() options: any;
  activeTab: any = null;
  ETypeSearchEngine = ETypeSearchEngine;
  isAnimating = false;

  ngAfterViewInit() {
    setTimeout(() => {
      // קודם נסה לקבל מ-window אם קיים
      if (!this.options && (window as any).SearchEngineConfig) {
        this.options = (window as any).SearchEngineConfig;
      }
      
      // אם אין בwindow, השתמש בפונקציה
      if (!this.options) {
        this.options = getSearchEngineTabsConfig();
      }

      if (this.options?.defaultTab) {
        this.activeTab =
          this.options.tabs.find(
            (t: any) =>
              t.searchEngine?.typeTravel ===
              this.options.defaultTab?.typeTravel
          ) ?? this.options.tabs[0]; 
      }

      console.log('✅ Tabs loaded:', this.options?.tabs);
      console.log('🎯 Active tab:', this.activeTab);
    });
  }

  selectTab(tab: any) {
    if (tab === this.activeTab) return;
    
    this.isAnimating = true;
    setTimeout(() => {
      this.activeTab = tab;
      setTimeout(() => {
        this.isAnimating = false;
      }, 20);
    }, 100);
  }

  onTabClick(tab: any, event: MouseEvent) {
    // אם יש URL - תן לקישור לעבוד
    if (tab.url) {
      return; // הדפדפן יטפל בקישור
    }
    
    // אחרת - מנע ניווט ובחר טאב
    event.preventDefault();
    this.selectTab(tab);
  }

  getActiveType(): ETypeSearchEngine | undefined {
    return this.activeTab?.searchEngine?.typeTravel;
  }
}
