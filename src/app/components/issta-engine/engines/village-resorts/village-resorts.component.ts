import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ESharedInputType } from '../../../../enums/ESharedInputType';
import { SharedInputRowComponent } from '../../shared/inputs/input-row/shared-input-row/shared-input-row.component';
import { PassangersInput } from '../../../../models/shared-passanger-input.models';
import { SearchFooterComponent } from '../../shared/footer/search-footer/search-footer.component';
import { SearchHeaderComponent } from '../../shared/header/search-header/search-header.component';
import { VILLAGE_RESORTS_CONFIG } from '../../../../config/search-engine.config';
import { BaseEngineComponent } from '../base-engine.component';
import { BaseEngineService } from '../../../../services/engine.service';
import { ApiService } from '../../../../services/api.service';
import { AppExternalConfig } from '../../../../config/app.external.config';
import { SharedOptionsService } from '../../../../services/shared-options.service';

@Component({
  selector: 'app-village-resorts',
  standalone: true,
  imports: [CommonModule, SharedInputRowComponent, SearchFooterComponent, SearchHeaderComponent],
  templateUrl: './village-resorts.component.html',
})
export class VillageResortsComponent extends BaseEngineComponent {
  protected config = VILLAGE_RESORTS_CONFIG;

  selectedDestination: any = null;
  selectedDate: { start: Date | null; end: Date | null } | null = null;
  selectedPassengers: PassangersInput | null = null;

  constructor(
    engineService: BaseEngineService,
    private apiService: ApiService,
    private optionsService: SharedOptionsService
  ) {
    super(engineService);
  }

  protected updateValue(type: ESharedInputType, value: any): void {
    console.log('🔵 Village Resorts updateValue:', { type, value });
    
    switch (type) {
      case ESharedInputType.VILLAGE_RESORTS_DESTINATION:
        this.selectedDestination = value;
        console.log('🌍 Destination selected:', value?.label, 'CityCode:', value?.CityCode);
        
        // Load suggested dates for selected destination
        if (value?.CityCode) {
          const dateInput = this.inputConfigs.find(c => c.type === ESharedInputType.VILLAGE_RESORTS_DATES);
          if (dateInput) {
            dateInput.loadingSuggestions = true;
            dateInput.value = { start: null, end: null };
            try { (this.inputsRow as any).updateInstanceDataConfigPartial(ESharedInputType.VILLAGE_RESORTS_DATES, { loadingSuggestions: true, value: { start: null, end: null } }); } catch(e) {}
          }
          this.inputsRow?.openInputDelayed(ESharedInputType.VILLAGE_RESORTS_DATES, 0);
          
          // Load calendar dates
          this.loadCalendarDates(value.CityCode, null);
        }
        break;
      case ESharedInputType.VILLAGE_RESORTS_DATES:
        this.selectedDate = value;
        console.log('📅 Date selected:', value);
        
        // Reload dates if only start date selected (for return date suggestions)
        if (value?.start && !value?.end && this.selectedDestination?.CityCode) {
          console.log('🔄 Reloading dates for return suggestions');
          const dateInput = this.inputConfigs.find(c => c.type === ESharedInputType.VILLAGE_RESORTS_DATES);
          if (dateInput) {
            dateInput.loadingSuggestions = true;
            dateInput.value = { start: value.start, end: null };
          }
          this.inputsRow?.openInputDelayed(ESharedInputType.VILLAGE_RESORTS_DATES, 0);
          
          const departureDate = this.formatDateForAPI(value.start);
          this.loadCalendarDates(this.selectedDestination.CityCode, departureDate);
        }
        break;
      case ESharedInputType.VILLAGE_RESORTS_PASSENGERS:
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
    const url = `${AppExternalConfig.baseUrl}village-resorts/village-resort-options?destinationCode=${cityCode}&hotelId=&from=${fromDate || 'null'}`;
    console.log('🗓️ [VILLAGE-RESORTS] Loading calendar dates:', { cityCode, fromDate, url });
    
    // Mark as loading
    const dateInput = this.inputConfigs.find(c => c.type === ESharedInputType.VILLAGE_RESORTS_DATES);
    if (dateInput) {
      console.log('🔄 [VILLAGE-RESORTS] Setting loadingSuggestions=true, isDisabled=true');
      dateInput.loadingSuggestions = true;
      dateInput.isDisabled = true;
    }
    
    this.apiService.get<any>(url, {
      onLoading: () => {
        console.log('⏳ [VILLAGE-RESORTS] onLoading callback triggered');
      },
      onSuccess: (response) => {
        console.log('📡 [VILLAGE-RESORTS] onSuccess callback triggered, response:', response);
        
        // Map the response to suggested dates
        const { VillageResortsMapper } = require('../../../../mappers/village-resorts.mapper');
        const suggestedDates = VillageResortsMapper.mapCalendarDates(response);
        console.log('✅ [VILLAGE-RESORTS] Mapped suggested dates:', {
          length: suggestedDates.length,
          sample: suggestedDates.slice(0, 3)
        });
        
        // Update the calendar input with suggested dates
        import('../../../../config/shared-input.registry').then(module => {
          console.log('📦 [VILLAGE-RESORTS] Registry module loaded');
          const registry = module.SharedInputRegistry;
          if (registry[ESharedInputType.VILLAGE_RESORTS_DATES]?.dataConfig) {
            console.log('📝 [VILLAGE-RESORTS] Updating registry with suggestedDates');
            registry[ESharedInputType.VILLAGE_RESORTS_DATES].dataConfig.suggestedDates = suggestedDates;
            console.log('✅ [VILLAGE-RESORTS] Registry updated');
            
            // Update min/max dates if provided
            if (response.FromDate) {
              registry[ESharedInputType.VILLAGE_RESORTS_DATES].dataConfig.minDate = new Date(response.FromDate);
              console.log('📅 [VILLAGE-RESORTS] Set minDate:', response.FromDate);
            }
            if (response.ToDate) {
              registry[ESharedInputType.VILLAGE_RESORTS_DATES].dataConfig.maxDate = new Date(response.ToDate);
              console.log('📅 [VILLAGE-RESORTS] Set maxDate:', response.ToDate);
            }
            
            // Update instance data without re-rendering
            const dateInput = this.inputConfigs.find(c => c.type === ESharedInputType.VILLAGE_RESORTS_DATES);
            if (dateInput) {
              console.log('🔍 [VILLAGE-RESORTS] Found dateInput, updating config');
              dateInput.dataConfig = registry[ESharedInputType.VILLAGE_RESORTS_DATES].dataConfig;
              console.log('🎯 [VILLAGE-RESORTS] Calling updateInstanceDataConfigPartial with', suggestedDates.length, 'suggestions');
              
              (this.inputsRow as any).updateInstanceDataConfigPartial(ESharedInputType.VILLAGE_RESORTS_DATES, {
                suggestedDates: registry[ESharedInputType.VILLAGE_RESORTS_DATES].dataConfig.suggestedDates,
                minDate: registry[ESharedInputType.VILLAGE_RESORTS_DATES].dataConfig.minDate,
                maxDate: registry[ESharedInputType.VILLAGE_RESORTS_DATES].dataConfig.maxDate,
                loadingSuggestions: false,
                isDisabled: false,
                value: !fromDate ? { start: null, end: null } : dateInput.value
              });
              console.log('🎉 [VILLAGE-RESORTS] Updated input config and UI - loadingSuggestions=false, isDisabled=false');
            } else {
              console.error('❌ [VILLAGE-RESORTS] dateInput not found!');
            }
            
            // Ensure calendar stays open after first load
            if (!fromDate) {
              console.log('📖 [VILLAGE-RESORTS] Opening calendar after 100ms');
              setTimeout(() => {
                this.inputsRow?.openInputDelayed(ESharedInputType.VILLAGE_RESORTS_DATES);
                console.log('✅ [VILLAGE-RESORTS] Calendar opened');
              }, 100);
            }
          } else {
            console.error('❌ [VILLAGE-RESORTS] Registry entry not found or missing dataConfig!');
          }
        }).catch((err: any) => {
          console.error('❌ [VILLAGE-RESORTS] Failed to import registry:', err);
        });
      },
      onError: (err: any) => {
        console.error('❌ [VILLAGE-RESORTS] API Error:', err);
        const dateInput = this.inputConfigs.find(c => c.type === ESharedInputType.VILLAGE_RESORTS_DATES);
        if (dateInput) {
          console.log('🔧 [VILLAGE-RESORTS] Resetting input after error');
          dateInput.loadingSuggestions = false;
          dateInput.isDisabled = false;
          if (!fromDate) dateInput.value = { start: null, end: null };
          this.inputsRow?.updateValues();
        }
      }
    });
    
    console.log('🏁 [VILLAGE-RESORTS] loadCalendarDates function completed (request initiated)');
  }

  protected openNextInput(type: ESharedInputType, value: any): void {
    switch (type) {
      case ESharedInputType.VILLAGE_RESORTS_DESTINATION:
        this.inputsRow?.openInputDelayed(ESharedInputType.VILLAGE_RESORTS_DATES);
        break;
      case ESharedInputType.VILLAGE_RESORTS_DATES:
        if (value?.start && value?.end) {
          this.inputsRow?.openInputDelayed(ESharedInputType.VILLAGE_RESORTS_PASSENGERS);
        }
        break;
    }
  }

  buildUrl(): string {
    console.log('Village Resorts search:', {
      destination: this.selectedDestination,
      date: this.selectedDate,
      passengers: this.selectedPassengers
    });
    return '';
  }
}
