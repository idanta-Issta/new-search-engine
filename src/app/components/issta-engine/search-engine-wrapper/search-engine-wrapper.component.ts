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
import { ValidationModalComponent } from '../shared/modals/validation-modal/validation-modal.component';
import { ValidationModalService } from '../../../services/validation-modal.service';
import { SkiComponent } from '../engines/ski/ski.component';
import { VillageResortsComponent } from '../engines/village-resorts/village-resorts.component';
import { CarComponent } from '../engines/car/car.component';


@Component({
  selector: 'app-search-engine',
  standalone: true,
  imports: [CommonModule, FlightsComponent, HotelAbroadComponent
    , DomesticVacationComponent, SportComponent, OrganizedToursComponent,
     DynamicPackagesComponent, SkiComponent, VillageResortsComponent, CarComponent, LeadFormExtraRoomsComponent, ValidationModalComponent],
  templateUrl: './search-engine-wrapper.component.html',
  styleUrls: ['./search-engine-wrapper.component.scss']
})
export class SearchEngineComponent implements AfterViewInit {
  @Input() options: any;
  activeTab: any = null;
  ETypeSearchEngine = ETypeSearchEngine;
  isAnimating = false;
  leadFormOpen$;
  validationModalOpen$;
  isLoadingHtml = false;
  private htmlCache = new Map<string, string>();

  @ViewChild('dynamicContainer', { static: false }) dynamicContainer?: ElementRef<HTMLDivElement>;

  constructor(
    private leadFormService: LeadFormModalService,
    private validationModalService: ValidationModalService,
    private apiService: ApiService
  ) {
    this.leadFormOpen$ = this.leadFormService.open$;
    this.validationModalOpen$ = this.validationModalService.open$;
  }

  closeLeadForm() {
    this.leadFormService.close();
  }

  closeValidationModal() {
    this.validationModalService.close();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (!this.options && (window as any).SearchEngineConfig) {
        this.options = (window as any).SearchEngineConfig;
      }
      
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

      if (this.activeTab?.htmlUrl) {
        this.loadExternalHtml(this.activeTab.htmlUrl);
      } else if (this.activeTab?.partialPath) {
        this.loadPartialHtml(this.activeTab.partialPath);
      }
    });
  }

  selectTab(tab: any) {
    if (tab === this.activeTab) return;
    
    this.isAnimating = true;
    setTimeout(() => {
      this.activeTab = tab;
      
      if (tab.htmlUrl) {
        this.loadExternalHtml(tab.htmlUrl);
      } else if (tab.partialPath) {
        this.loadPartialHtml(tab.partialPath);
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
    if (tab.url) {
      return; 
    }
    
    event.preventDefault();
    this.selectTab(tab);
  }

  getActiveType(): ETypeSearchEngine | undefined {
    return this.activeTab?.searchEngine?.typeTravel;
  }

  hasExternalHtml(): boolean {
    const result = !!this.activeTab?.htmlUrl || !!this.activeTab?.partialPath;
   
    return result;
  }

  private loadPartialHtml(partialPath: string) {
    console.log('[WRAPPER] Loading partial HTML from:', partialPath);
    
    // Check cache first
    if (this.htmlCache.has(partialPath)) {
      console.log('[WRAPPER] ✅ Using cached partial HTML for:', partialPath);
      const cachedHtml = this.htmlCache.get(partialPath)!;
      // Use setTimeout to ensure DOM is ready even when using cache
      setTimeout(() => {
        this.renderHtml(cachedHtml);
      }, 0);
      return;
    }
    
    fetch(partialPath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load partial: ${response.statusText}`);
        }
        return response.text();
      })
      .then(htmlText => {
        // Cache the HTML
        this.htmlCache.set(partialPath, htmlText);
        console.log('[WRAPPER] 💾 Cached partial HTML for:', partialPath);
        
        this.renderHtml(htmlText);
      })
      .catch(error => {
        console.error('[WRAPPER] Error loading partial HTML:', error);
      });
  }
  
  private renderHtml(htmlText: string) {
    if (!this.dynamicContainer) {
      console.error('❌ Dynamic container not found!');
      return;
    }

    const styles = this.extractStyles(htmlText);
    styles.forEach((css) => {
      this.loadCSS(css);
    });

    const scripts = this.extractScripts(htmlText);
    const cleanHtml = this.sanitizeHtml(htmlText);

    this.dynamicContainer.nativeElement.innerHTML = cleanHtml;
    
    setTimeout(() => {
      scripts.forEach((js) => {
        this.loadScript(js);
      });
    }, 0);
    
    console.log('[WRAPPER] Partial HTML loaded successfully');
  } 

  private loadExternalHtml(url: string) {

    
    this.apiService.get(url, {
      responseType: 'text',
      onLoading: () => {
        this.isLoadingHtml = true;
      },
      onSuccess: (htmlText: string) => {
        
        if (!this.dynamicContainer) {
          console.error('❌ Dynamic container not found!');
          this.isLoadingHtml = false;
          return;
        }
    

        const styles = this.extractStyles(htmlText);
        styles.forEach((css, index) => {
          this.loadCSS(css);
        });

        const scripts = this.extractScripts(htmlText);
        const cleanHtml = this.sanitizeHtml(htmlText);
    
        this.dynamicContainer.nativeElement.innerHTML = cleanHtml;
        setTimeout(() => {
          scripts.forEach((js, index) => {
            this.loadScript(js);
          });
        }, 0);
        
        this.isLoadingHtml = false;
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
