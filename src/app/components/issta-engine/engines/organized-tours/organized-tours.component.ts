import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ESharedInputType } from '../../../../enums/ESharedInputType';
import { SharedInputRowComponent } from '../../shared/inputs/input-row/shared-input-row/shared-input-row.component';
import { PassangersInput } from '../../../../models/shared-passanger-input.models';
import { SearchFooterComponent } from '../../shared/footer/search-footer/search-footer.component';
import { SearchHeaderComponent } from '../../shared/header/search-header/search-header.component';
import { ORGANIZED_TOURS_CONFIG } from '../../../../config/search-engine.config';
import { BaseEngineComponent } from '../base-engine.component';
import { BaseEngineService } from '../../../../services/engine.service';
import { HotelsManager } from '../../../../managers/hotels.manager';
import { AppExternalConfig } from '../../../../config/app.external.config';
import { HttpClient } from '@angular/common/http';
import { OrganizedToursMapper } from '../../../../mappers/organized-tours.mapper';
import { SharedOptionsService } from '../../../../services/shared-options.service';

@Component({
  selector: 'app-organized-tours',
  standalone: true,
  imports: [CommonModule, SharedInputRowComponent, SearchFooterComponent, SearchHeaderComponent],
  templateUrl: './organized-tours.component.html',
})
export class OrganizedToursComponent extends BaseEngineComponent {
  protected config = ORGANIZED_TOURS_CONFIG;
  private manager = new HotelsManager();

  selectedRegion: any = null;
  selectedCountry: any = null;
  selectedCategory: any = null;
  selectedMonth: any = null;

  constructor(
    engineService: BaseEngineService,
    private http: HttpClient,
    private optionsService: SharedOptionsService
  ) {
    super(engineService);
  }

  protected updateValue(type: ESharedInputType, value: any): void {
    switch (type) {
      case ESharedInputType.ORGANIZED_REGIONS:
        this.selectedRegion = value;
        
        // Reset countries selection and show loading state
        const countriesInput = this.inputConfigs.find(c => c.type === ESharedInputType.ORGANIZED_COUNTRIES);
        if (countriesInput) {
          countriesInput.value = { label: 'טוען מדינות...', key: 'loading' };
          countriesInput.isDisabled = true;
        }
        this.selectedCountry = { label: 'טוען מדינות...', key: 'loading' };
        
        // Trigger UI update
        this.inputsRow?.updateValues();
        
        // Load countries
        this.loadCountriesForRegion(value?.key);
        break;
      case ESharedInputType.ORGANIZED_COUNTRIES:
        this.selectedCountry = value;
        break;
      case ESharedInputType.ORGANIZED_CATEGORIES:
        this.selectedCategory = value;
        break;
      case ESharedInputType.DATES_PICKER_MONTHS:
        this.selectedMonth = value;
        break;
    }
  }

  private loadCountriesForRegion(regionId: string) {
    if (!regionId || regionId === 'all') {
      // Reset to default countries list - no URL needed
      const countriesInput = this.inputConfigs.find(c => c.type === ESharedInputType.ORGANIZED_COUNTRIES);
      if (countriesInput) {
        countriesInput.value = { label: 'כל המדינות', key: 'all' };
        countriesInput.isDisabled = false;
      }
      this.selectedCountry = { label: 'כל המדינות', key: 'all' };
      
      // Remove requestUrl from registry
      import('../../../../config/shared-input.registry').then(module => {
        const registry = module.SharedInputRegistry;
        if (registry[ESharedInputType.ORGANIZED_COUNTRIES]) {
          delete registry[ESharedInputType.ORGANIZED_COUNTRIES].requestUrl;
        }
      });
      
      this.inputsRow?.updateValues();
      return;
    }

    // Load countries from API
    const url = `${AppExternalConfig.baseUrl}trips/countriesbyregion?regionid=${regionId}`;
    
    this.http.get<any>(url).subscribe({
      next: (response) => {
        // Clear cache for countries to force reload
        this.optionsService.clearCacheForType(ESharedInputType.ORGANIZED_COUNTRIES);
        
        // Update registry with new URL
        import('../../../../config/shared-input.registry').then(module => {
          const registry = module.SharedInputRegistry;
          if (registry[ESharedInputType.ORGANIZED_COUNTRIES]) {
            registry[ESharedInputType.ORGANIZED_COUNTRIES].requestUrl = url;
          }
        });
        
        // Re-enable input and reset to default
        const countriesInput = this.inputConfigs.find(c => c.type === ESharedInputType.ORGANIZED_COUNTRIES);
        if (countriesInput) {
          countriesInput.value = { label: 'כל המדינות', key: 'all' };
          countriesInput.isDisabled = false;
        }
        this.selectedCountry = { label: 'כל המדינות', key: 'all' };
        this.inputsRow?.updateValues();
      },
      error: (err) => {
        console.error('Failed to load countries:', err);
        // Re-enable even on error
        const countriesInput = this.inputConfigs.find(c => c.type === ESharedInputType.ORGANIZED_COUNTRIES);
        if (countriesInput) {
          countriesInput.value = { label: 'שגיאה בטעינה', key: 'error' };
          countriesInput.isDisabled = false;
        }
        this.inputsRow?.updateValues();
      }
    });
  }

  protected openNextInput(type: ESharedInputType, value: any): void {
    switch (type) {
      case ESharedInputType.ORGANIZED_REGIONS:
        // Don't auto-open countries to avoid showing loading state
        break;
      case ESharedInputType.ORGANIZED_COUNTRIES:
        if (value) {
          this.inputsRow?.openInputDelayed(ESharedInputType.ORGANIZED_CATEGORIES);
        }
        break;
      case ESharedInputType.ORGANIZED_CATEGORIES:
        if (value) {
          this.inputsRow?.openInputDelayed(ESharedInputType.DATES_PICKER_MONTHS);
        }
        break;
    }
  }

  buildUrl(): string {
    const queryParams = this.manager.buildUrl({
      destination: this.selectedCountry,
      dates: { start: null, end: null },
      passengers: null
    });
    return BaseEngineService.buildRedirectUrl(this.config.productCode, queryParams);
  }
}
