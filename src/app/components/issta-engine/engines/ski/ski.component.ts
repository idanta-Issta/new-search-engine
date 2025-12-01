import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ESharedInputType } from '../../../../enums/ESharedInputType';
import { SharedInputRowComponent } from '../../shared/inputs/input-row/shared-input-row/shared-input-row.component';
import { PassangersInput } from '../../../../models/shared-passanger-input.models';
import { SearchFooterComponent } from '../../shared/footer/search-footer/search-footer.component';
import { SearchHeaderComponent } from '../../shared/header/search-header/search-header.component';
import { SKI_CONFIG } from '../../../../config/search-engine.config';
import { BaseEngineComponent } from '../base-engine.component';
import { BaseEngineService } from '../../../../services/engine.service';
import { HttpClient } from '@angular/common/http';
import { AppExternalConfig } from '../../../../config/app.external.config';
import { SharedOptionsService } from '../../../../services/shared-options.service';

@Component({
  selector: 'app-ski',
  standalone: true,
  imports: [CommonModule, SharedInputRowComponent, SearchFooterComponent, SearchHeaderComponent],
  templateUrl: './ski.component.html',
})
export class SkiComponent extends BaseEngineComponent {
  protected config = SKI_CONFIG;

  selectedDestination: any = null;
  selectedResort: any = null;
  selectedDate: { start: Date | null; end: Date | null } | null = null;
  selectedPassengers: PassangersInput | null = null;

  constructor(
    engineService: BaseEngineService,
    private http: HttpClient,
    private optionsService: SharedOptionsService
  ) {
    super(engineService);
  }

  protected updateValue(type: ESharedInputType, value: any): void {
    console.log('🔵 Ski updateValue:', { type, value });
    
    switch (type) {
      case ESharedInputType.SKI_DESTINATION:
        this.selectedDestination = value;
        console.log('🌍 Destination selected:', value?.label, 'CountryCode:', value?.CountryCode);
        
        // Reset resort selection and show loading state
        const resortInput = this.inputConfigs.find(c => c.type === ESharedInputType.SKI_RESORT);
        if (resortInput) {
          resortInput.value = { label: 'טוען אתרים...', key: 'loading' };
          resortInput.isDisabled = true;
        }
        this.selectedResort = { label: 'טוען אתרים...', key: 'loading' };
        
        // Trigger UI update
        this.inputsRow?.updateValues();
        
        // Load resorts for selected destination
        this.loadResortsForDestination(value?.CountryCode);
        break;
      case ESharedInputType.SKI_RESORT:
        this.selectedResort = value;
        console.log('⛷️ Resort selected:', value?.label, 'CityCode:', value?.CityCode);
        
        // Load suggested dates for selected resort
        if (value?.CityCode) {
          const dateInput = this.inputConfigs.find(c => c.type === ESharedInputType.SKI_DEPARTURE_DATE);
          if (dateInput) {
            dateInput.loadingSuggestions = true;
            dateInput.value = { start: null, end: null };
            try { (this.inputsRow as any).updateInstanceDataConfigPartial(ESharedInputType.SKI_DEPARTURE_DATE, { loadingSuggestions: true, value: { start: null, end: null } }); } catch(e) {}
          }
          this.inputsRow?.openInputDelayed(ESharedInputType.SKI_DEPARTURE_DATE, 0);
          
          // Load calendar dates
          this.loadCalendarDates(value.CityCode, null);
        }
        break;
      case ESharedInputType.SKI_DEPARTURE_DATE:
        this.selectedDate = value;
        console.log('📅 Date selected:', value);
        
        // Reload dates if only start date selected (for return date suggestions)
        if (value?.start && !value?.end && this.selectedResort?.CityCode) {
          console.log('🔄 Reloading dates for return suggestions');
          const dateInput = this.inputConfigs.find(c => c.type === ESharedInputType.SKI_DEPARTURE_DATE);
          if (dateInput) {
            dateInput.loadingSuggestions = true;
            dateInput.value = { start: value.start, end: null };
          }
          this.inputsRow?.openInputDelayed(ESharedInputType.SKI_DEPARTURE_DATE, 0);
          
          const departureDate = this.formatDateForAPI(value.start);
          this.loadCalendarDates(this.selectedResort.CityCode, departureDate);
        }
        break;
      case ESharedInputType.SKI_PASSENGERS:
        this.selectedPassengers = value;
        console.log('👥 Passengers selected:', value);
        break;
    }
  }

  private formatDateForAPI(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private loadCalendarDates(cityCode: string, fromDate: string | null) {
    const url = `${AppExternalConfig.baseUrl}ski/calendardates?destinationCode=${cityCode}&from=${fromDate || 'null'}`;
    console.log('🗓️ Loading ski calendar dates:', { cityCode, fromDate, url });
    
    this.http.get<any>(url).subscribe({
      next: (response) => {
        console.log('📡 API response:', response);
        
        // Map the response to suggested dates
        const { SkiMapper } = require('../../../../mappers/ski.mapper');
        const suggestedDates = SkiMapper.mapCalendarDates(response);
        console.log('✅ Mapped suggested dates length:', suggestedDates.length, 'sample:', suggestedDates.slice(0, 3));
        
        // Update the calendar input with suggested dates
        import('../../../../config/shared-input.registry').then(module => {
          const registry = module.SharedInputRegistry;
          if (registry[ESharedInputType.SKI_DEPARTURE_DATE]?.dataConfig) {
            registry[ESharedInputType.SKI_DEPARTURE_DATE].dataConfig.suggestedDates = suggestedDates;
            console.log('📝 Updated registry with suggested dates');
            
            // Update min/max dates if provided
            if (response.FromDate) {
              registry[ESharedInputType.SKI_DEPARTURE_DATE].dataConfig.minDate = new Date(response.FromDate);
            }
            if (response.ToDate) {
              registry[ESharedInputType.SKI_DEPARTURE_DATE].dataConfig.maxDate = new Date(response.ToDate);
            }
            
            // Update instance data without re-rendering
            const dateInput = this.inputConfigs.find(c => c.type === ESharedInputType.SKI_DEPARTURE_DATE);
            if (dateInput) {
              dateInput.dataConfig = registry[ESharedInputType.SKI_DEPARTURE_DATE].dataConfig;
              console.log('Calling updateInstanceDataConfigPartial with', suggestedDates.length, 'suggestions');
              
              (this.inputsRow as any).updateInstanceDataConfigPartial(ESharedInputType.SKI_DEPARTURE_DATE, {
                suggestedDates: registry[ESharedInputType.SKI_DEPARTURE_DATE].dataConfig.suggestedDates,
                minDate: registry[ESharedInputType.SKI_DEPARTURE_DATE].dataConfig.minDate,
                maxDate: registry[ESharedInputType.SKI_DEPARTURE_DATE].dataConfig.maxDate,
                loadingSuggestions: false,
                isDisabled: false,
                value: !fromDate ? { start: null, end: null } : dateInput.value
              });
              console.log('🔄 Updated input config and UI');
            }
            
            // Ensure calendar stays open after first load
            if (!fromDate) {
              setTimeout(() => {
                this.inputsRow?.openInputDelayed(ESharedInputType.SKI_DEPARTURE_DATE);
              }, 100);
            }
          }
        });
      },
      error: (err) => {
        console.error('❌ Failed to load calendar dates:', err);
        const dateInput = this.inputConfigs.find(c => c.type === ESharedInputType.SKI_DEPARTURE_DATE);
        if (dateInput) {
          dateInput.loadingSuggestions = false;
          dateInput.isDisabled = false;
          if (!fromDate) dateInput.value = { start: null, end: null };
          this.inputsRow?.updateValues();
        }
      }
    });
  }

  private loadResortsForDestination(countryCode: string) {
    console.log('🏔️ Loading resorts for country:', countryCode);
    
    if (!countryCode || countryCode === 'all') {
      console.log('⚠️ No specific country selected, resetting to default');
      // Reset to default resorts list
      const resortInput = this.inputConfigs.find(c => c.type === ESharedInputType.SKI_RESORT);
      if (resortInput) {
        resortInput.value = { label: 'כל האתרים', key: 'all' };
        resortInput.isDisabled = false;
      }
      this.selectedResort = { label: 'כל האתרים', key: 'all' };
      
      // Remove requestUrl from registry
      import('../../../../config/shared-input.registry').then(module => {
        const registry = module.SharedInputRegistry;
        if (registry[ESharedInputType.SKI_RESORT]) {
          delete registry[ESharedInputType.SKI_RESORT].requestUrl;
        }
      });
      
      this.inputsRow?.updateValues();
      return;
    }

    // Load resorts from API
    const url = `${AppExternalConfig.baseUrl}ski/resorts?countryCode=${countryCode}`;
    console.log('📡 Loading resorts from URL:', url);
    
    this.http.get<any>(url).subscribe({
      next: (response) => {
        console.log('✅ Resorts loaded:', response);
        
        // Clear cache for resorts to force reload
        this.optionsService.clearCacheForType(ESharedInputType.SKI_RESORT);
        
        // Update registry with new URL
        import('../../../../config/shared-input.registry').then(module => {
          const registry = module.SharedInputRegistry;
          if (registry[ESharedInputType.SKI_RESORT]) {
            registry[ESharedInputType.SKI_RESORT].requestUrl = url;
            console.log('📝 Updated registry with resort URL');
          }
        });
        
        // Re-enable input and reset to default
        const resortInput = this.inputConfigs.find(c => c.type === ESharedInputType.SKI_RESORT);
        if (resortInput) {
          resortInput.value = { label: 'כל האתרים', key: 'all' };
          resortInput.isDisabled = false;
        }
        this.selectedResort = { label: 'כל האתרים', key: 'all' };
        this.inputsRow?.updateValues();
        console.log('🔄 UI updated with resorts');
      },
      error: (err) => {
        console.error('❌ Failed to load resorts:', err);
        const resortInput = this.inputConfigs.find(c => c.type === ESharedInputType.SKI_RESORT);
        if (resortInput) {
          resortInput.value = { label: 'שגיאה בטעינה', key: 'error' };
          resortInput.isDisabled = false;
        }
        this.inputsRow?.updateValues();
      }
    });
  }

  protected openNextInput(type: ESharedInputType, value: any): void {
    switch (type) {
      case ESharedInputType.SKI_DESTINATION:
        this.inputsRow?.openInputDelayed(ESharedInputType.SKI_RESORT);
        break;
      case ESharedInputType.SKI_RESORT:
        if (value) {
          this.inputsRow?.openInputDelayed(ESharedInputType.SKI_DEPARTURE_DATE);
        }
        break;
    }
  }

  buildUrl(): string {
    // TODO: Implement ski search URL building
    console.log('Ski search:', {
      destination: this.selectedDestination,
      resort: this.selectedResort,
      date: this.selectedDate,
      passengers: this.selectedPassengers
    });
    return '';
  }
}
