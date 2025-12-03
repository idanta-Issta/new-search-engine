import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';

import { FlightsComponent } from '../engines/flights/flights.component';
import { HotelAbroadComponent } from '../engines/hotel-abroad/hotel-abroad.component';
import { SportComponent } from '../engines/sport/sport.component';
import { OrganizedToursComponent } from '../engines/organized-tours/organized-tours.component';
import { DomesticVacationComponent } from '../engines/domestic-vacation/domestic-vacation.component';
import { ETypeSearchEngine } from '../../../enums/ETypeSearchEngine';
import { getSearchEngineTabsConfig } from '../../../config/search-engine-tabs.config';
import { DynamicPackagesComponent } from '../engines/dynamic-packages/dynamic-packages.component';

import { LeadFormExtraRoomsComponent } from '../shared/modals/lead-form-extra-rooms/lead-form-extra-rooms.component';
import { LeadFormModalService } from '../../../services/lead-form-modal.service';
import { SkiComponent } from '../engines/ski/ski.component';
import { VillageResortsComponent } from '../engines/village-resorts/village-resorts.component';
import { CarComponent } from '../engines/car/car.component';


@Component({
  selector: 'app-search-engine',
  standalone: true,
  imports: [CommonModule, FlightsComponent, HotelAbroadComponent
    , DomesticVacationComponent, SportComponent, OrganizedToursComponent,
     DynamicPackagesComponent, SkiComponent, VillageResortsComponent, CarComponent, LeadFormExtraRoomsComponent],
  templateUrl: './search-engine-wrapper.component.html',
  styleUrls: ['./search-engine-wrapper.component.scss']
})
export class SearchEngineComponent implements AfterViewInit {
  @Input() options: any;
  activeTab: any = null;
  ETypeSearchEngine = ETypeSearchEngine;
  isAnimating = false;
  leadFormOpen$;
  isLoadingHtml = false;

  @ViewChild('dynamicContainer', { static: false }) dynamicContainer?: ElementRef<HTMLDivElement>;

  constructor(
    private leadFormService: LeadFormModalService,
    private apiService: ApiService
  ) {
    this.leadFormOpen$ = this.leadFormService.open$;
  }

  closeLeadForm() {
    this.leadFormService.close();
  }

  ngAfterViewInit() {
    console.log('🔵 ngAfterViewInit started');
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
      console.log('🔍 Has htmlUrl?', !!this.activeTab?.htmlUrl);
      console.log('🔍 htmlUrl value:', this.activeTab?.htmlUrl);

      // Load external HTML if the initial active tab has htmlUrl
      if (this.activeTab?.htmlUrl) {
        console.log('🚀 Loading external HTML from:', this.activeTab.htmlUrl);
        this.loadExternalHtml(this.activeTab.htmlUrl);
      } else {
        console.log('⚠️ No htmlUrl found on active tab');
      }
    });
  }

  selectTab(tab: any) {
    if (tab === this.activeTab) return;
    
    this.isAnimating = true;
    setTimeout(() => {
      this.activeTab = tab;
      
      // Load external HTML if htmlUrl is specified
      if (tab.htmlUrl) {
        this.loadExternalHtml(tab.htmlUrl);
      } else {
        if (this.dynamicContainer) {
          this.dynamicContainer.nativeElement.innerHTML = '';
        }
      }
      
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

  hasExternalHtml(): boolean {
    const result = !!this.activeTab?.htmlUrl;
    console.log('🔍 hasExternalHtml() called, result:', result, 'activeTab:', this.activeTab?.title);
    return result;
  }

  private loadExternalHtml(url: string) {
    console.log('📥 loadExternalHtml called with URL:', url);
    console.log('📦 Is URL cached?', this.apiService.isCached(url));
    
    this.apiService.get(url, {
      responseType: 'text',
      onLoading: () => {
        this.isLoadingHtml = true;
        console.log('⏳ isLoadingHtml set to true');
      },
      onSuccess: (htmlText: string) => {
        console.log('✅ HTTP Response received, length:', htmlText.length);
        console.log('📄 HTML Preview (first 200 chars):', htmlText.substring(0, 200));
        
        if (!this.dynamicContainer) {
          console.error('❌ Dynamic container not found!');
          this.isLoadingHtml = false;
          return;
        }
        console.log('✅ Dynamic container exists:', this.dynamicContainer.nativeElement);

        // Extract and inject CSS
        const styles = this.extractStyles(htmlText);
        console.log('🎨 Extracted', styles.length, 'style tags');
        styles.forEach((css, index) => {
          console.log(`🎨 Injecting style #${index + 1}, length:`, css.length);
          this.loadCSS(css);
        });

        // Extract scripts
        const scripts = this.extractScripts(htmlText);
        console.log('📜 Extracted', scripts.length, 'script tags');
        
        // Remove <style> and <script> tags from HTML
        const cleanHtml = this.sanitizeHtml(htmlText);
        console.log('🧹 Clean HTML length:', cleanHtml.length);
        console.log('🧹 Clean HTML preview:', cleanHtml.substring(0, 200));
        
        // Insert clean HTML into container
        this.dynamicContainer.nativeElement.innerHTML = cleanHtml;
        console.log('✅ HTML inserted into container');
        
        // Execute scripts AFTER HTML is inserted
        setTimeout(() => {
          scripts.forEach((js, index) => {
            console.log(`📜 Executing script #${index + 1}, length:`, js.length);
            this.loadScript(js);
          });
          console.log('✅ All scripts executed');
        }, 0);
        
        this.isLoadingHtml = false;
        console.log('✅ Loading complete, isLoadingHtml set to false');
      },
      onError: (err) => {
        console.error('❌ Failed to load external HTML:', err);
        console.error('❌ Error details:', err.message, err.status);
        if (this.dynamicContainer) {
          this.dynamicContainer.nativeElement.innerHTML = 
            '<div style="padding: 2rem; text-align: center; color: #666;">שגיאה בטעינת התוכן</div>';
        }
        this.isLoadingHtml = false;
      }
    }).subscribe();
  }

  private extractStyles(html: string): string[] {
    const styles: string[] = [];
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    let match;
    while ((match = styleRegex.exec(html)) !== null) {
      if (match[1]) styles.push(match[1]);
    }
    return styles;
  }

  private extractScripts(html: string): string[] {
    const scripts: string[] = [];
    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = scriptRegex.exec(html)) !== null) {
      if (match[1]) scripts.push(match[1]);
    }
    return scripts;
  }

  private sanitizeHtml(html: string): string {
    return html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  }

  private loadCSS(cssCode: string) {
    const style = document.createElement('style');
    style.innerHTML = cssCode;
    document.head.appendChild(style);
  }

  private loadScript(jsCode: string) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.text = jsCode;
    document.body.appendChild(script);
  }
}
