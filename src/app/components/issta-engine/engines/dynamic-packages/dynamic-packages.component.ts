import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ESharedInputType } from '../../../../enums/ESharedInputType';
import { SharedInputRowComponent } from '../../shared/inputs/input-row/shared-input-row/shared-input-row.component';
import { PassangersInput } from '../../../../models/shared-passanger-input.models';
import { SearchFooterComponent } from '../../shared/footer/search-footer/search-footer.component';
import { SearchHeaderComponent } from '../../shared/header/search-header/search-header.component';
import { DYNAMIC_PACKAGES_CONFIG } from '../../../../config/search-engine.config';
import { BaseEngineComponent } from '../base-engine.component';
import { BaseEngineService } from '../../../../services/engine.service';
import { HotelsManager } from '../../../../managers/hotels.manager';
import { AppExternalConfig } from '../../../../config/app.external.config';
import { HttpClient } from '@angular/common/http';
import { DynamicPackagesMapper } from '../../../../mappers/dynamic-packages.mapper';
import { SharedCalendarInputComponent } from '../../shared/inputs/shared-calendar-input/shared-calendar-input.component';

@Component({
  selector: 'app-dynamic-packages',
  standalone: true,
  imports: [CommonModule, SharedInputRowComponent, SearchFooterComponent, SearchHeaderComponent],
  templateUrl: './dynamic-packages.component.html',
})
export class DynamicPackagesComponent extends BaseEngineComponent {
  protected config = DYNAMIC_PACKAGES_CONFIG;
  private manager = new HotelsManager();

  selectedDestination: any = null;
  selectedDates: { start?: Date | null; end?: Date | null } | null = null;
  selectedPassengers: PassangersInput | null = null;

  constructor(
    engineService: BaseEngineService,
    private http: HttpClient
  ) {
    super(engineService);
  }

  protected updateValue(type: ESharedInputType, value: any): void {
    console.log('🔵 updateValue called:', { type, value });
    
    switch (type) {
      case ESharedInputType.DYNAMIC_PACKAGES_DESTINATION:
        this.selectedDestination = value;
        
        if (value?.key) {
          console.log('🌍 Destination selected:', value.key);
          
          // Show loading state in the calendar (keep it visible)
          const datesInput = this.inputConfigs.find(c => c.type === ESharedInputType.DYNAMIC_PACKAGES_DATES);
          if (datesInput) {
            datesInput.loadingSuggestions = true;
            // reset previous value but keep the calendar open
            datesInput.value = { start: null, end: null };
            // Apply loading state directly to the instance to avoid re-render
            try { (this.inputsRow as any).updateInstanceDataConfigPartial(ESharedInputType.DYNAMIC_PACKAGES_DATES, { loadingSuggestions: true, value: { start: null, end: null } }); } catch(e) {}
          }
          this.inputsRow?.openInputDelayed(ESharedInputType.DYNAMIC_PACKAGES_DATES, 0);
          
          // Load available dates for the selected destination
          console.log('📡 Loading calendar dates...');
          this.loadCalendarDates(value.key, null);

        }
        break;
      case ESharedInputType.DYNAMIC_PACKAGES_DATES:
        this.selectedDates = value;
        if (value?.start && !value?.end && this.selectedDestination?.key) {
          const datesInput = this.inputConfigs.find(c => c.type === ESharedInputType.DYNAMIC_PACKAGES_DATES);
          if (datesInput) {
            datesInput.loadingSuggestions = true;
            datesInput.value = { start: value.start, end: null };
            
          }

          //keep the suggested dates in list, when keep return date, change the suggested dates to be the first options

          //for example, first suggested date is [10/10, 12/10, 13/10], user select 10/10 as start date,
          //  then load again, the suggested dates will change to [12/10, 13/10]. but when pick return date, the suggeted date return again to first option [10/10, 12/10, 13/10]

          this.inputsRow?.openInputDelayed(ESharedInputType.DYNAMIC_PACKAGES_DATES, 0);

          const departureDate = this.formatDateForAPI(value.start);
          this.loadCalendarDates(this.selectedDestination.key, departureDate);
        }
        break;
      case ESharedInputType.PASSANGERS_DYNAMIC_PACKAGES:
        this.selectedPassengers = value;
        break;
    }
  }

  private loadCalendarDates(destinationCode: string, fromDate: string | null) {
    const url = `${AppExternalConfig.baseUrl}packages/calendardates?destinationCode=${destinationCode}&hotelId=&from=${fromDate || 'null'}&fromDateLimit=null&toDateLimit=null`;
    this.http.get<any>(url).subscribe({
      next: (response) => {
        console.log('API url:', url, 'response:', response);
        // Map the response to suggested dates
        const suggestedDates = DynamicPackagesMapper.mapCalendarDates(response);
        console.log('Mapped suggestedDates length:', suggestedDates.length);
        // Update the calendar input with suggested dates and date limits
        import('../../../../config/shared-input.registry').then(module => {
          const registry = module.SharedInputRegistry;
          if (registry[ESharedInputType.DYNAMIC_PACKAGES_DATES]?.dataConfig) {
            console.log('Registry before update suggestedDates length:', registry[ESharedInputType.DYNAMIC_PACKAGES_DATES].dataConfig.suggestedDates?.length || 0);
            registry[ESharedInputType.DYNAMIC_PACKAGES_DATES].dataConfig.suggestedDates = suggestedDates;
            console.log('Assigned suggestedDates to registry, sample:', suggestedDates.slice(0,3));
            if (response.FromDate) {
              registry[ESharedInputType.DYNAMIC_PACKAGES_DATES].dataConfig.minDate = new Date(response.FromDate);
            }
            if (response.ToDate) {
              registry[ESharedInputType.DYNAMIC_PACKAGES_DATES].dataConfig.maxDate = new Date(response.ToDate);
            }
            // Update instances: if this was a return-date load (fromDate provided), keep the selected start
            const datesInput = this.inputConfigs.find(c => c.type === ESharedInputType.DYNAMIC_PACKAGES_DATES);
            // Instead of re-rendering the whole row (which resets open state), update only partial instance data
            if (datesInput) {
              console.log('datesInput prior dataConfig suggestedDates length:', datesInput.dataConfig?.suggestedDates?.length || 0);
              // push updates into registry (source-of-truth)
              datesInput.dataConfig = registry[ESharedInputType.DYNAMIC_PACKAGES_DATES].dataConfig;
              console.log('Calling updateInstanceDataConfigPartial with', registry[ESharedInputType.DYNAMIC_PACKAGES_DATES].dataConfig.suggestedDates.length, 'suggestions');
              // use the row helper to patch instance data without re-creating components
              // pass suggestedDates, min/max dates and loader flags
              (this.inputsRow as any).updateInstanceDataConfigPartial(ESharedInputType.DYNAMIC_PACKAGES_DATES, {
                suggestedDates: registry[ESharedInputType.DYNAMIC_PACKAGES_DATES].dataConfig.suggestedDates,
                minDate: registry[ESharedInputType.DYNAMIC_PACKAGES_DATES].dataConfig.minDate,
                maxDate: registry[ESharedInputType.DYNAMIC_PACKAGES_DATES].dataConfig.maxDate,
                loadingSuggestions: false,
                isDisabled: false,
                value: !fromDate ? { start: null, end: null } : datesInput.value
              });
              console.log('datesInput after partial update suggestedDates length:', datesInput.dataConfig?.suggestedDates?.length || 0);
            }
            // ensure initial open after first load
            if (!fromDate) {
              setTimeout(() => {
                this.inputsRow?.openInputDelayed(ESharedInputType.DYNAMIC_PACKAGES_DATES);
              }, 100);
            }
          }
        });
      },
      error: (err) => {
        const datesInput = this.inputConfigs.find(c => c.type === ESharedInputType.DYNAMIC_PACKAGES_DATES);
        if (datesInput) {
          // stop loader and enable input
          datesInput.loadingSuggestions = false;
          datesInput.isDisabled = false;
          if (!fromDate) datesInput.value = { start: null, end: null };
        }
        this.inputsRow?.updateValues();
      }
    });
  }

  private formatDateForAPI(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  protected openNextInput(type: ESharedInputType, value: any): void {
    switch (type) {
      case ESharedInputType.DYNAMIC_PACKAGES_DESTINATION:
        // Don't auto-open dates input - it will open after loading completes
        break;
      case ESharedInputType.DYNAMIC_PACKAGES_DATES:
        if (value?.start && value?.end) {
          this.inputsRow?.openInputDelayed(ESharedInputType.PASSANGERS_DYNAMIC_PACKAGES);
        }
        break;
    }
  }

  buildUrl(): string {
    const dates = this.selectedDates 
      ? { start: this.selectedDates.start ?? null, end: this.selectedDates.end ?? null }
      : { start: null as Date | null, end: null as Date | null };
      
    return this.manager.buildUrl({
      destination: this.selectedDestination,
      dates: dates,
      passengers: this.selectedPassengers
    });
  }
}
