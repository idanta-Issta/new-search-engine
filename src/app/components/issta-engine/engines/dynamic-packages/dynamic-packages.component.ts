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
          
          // Show loading state
          const datesInput = this.inputConfigs.find(c => c.type === ESharedInputType.DYNAMIC_PACKAGES_DATES);
          if (datesInput) {
            console.log('⏳ Setting isDisabled = true');
            datesInput.isDisabled = true;
          }
          
          // Trigger UI update to show "טוען תאריכים..."
          console.log('🔄 Calling updateValues...');
          this.inputsRow?.updateValues();
          
          // Load available dates for the selected destination
          console.log('📡 Loading calendar dates...');
          this.loadCalendarDates(value.key, null);

        }
        break;
      case ESharedInputType.DYNAMIC_PACKAGES_DATES:
        this.selectedDates = value;
        
        // If departure date is selected, load return dates
        // if (value?.start && !value?.end && this.selectedDestination?.key) {
        //   const departureDate = this.formatDateForAPI(value.start);
        //   this.loadCalendarDates(this.selectedDestination.key, departureDate);
        // }
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
        // Update the calendar input with suggested dates and date limits
        import('../../../../config/shared-input.registry').then(module => {
          const registry = module.SharedInputRegistry;
          if (registry[ESharedInputType.DYNAMIC_PACKAGES_DATES]?.dataConfig) {
            registry[ESharedInputType.DYNAMIC_PACKAGES_DATES].dataConfig.suggestedDates = suggestedDates;
            if (response.FromDate) {
              registry[ESharedInputType.DYNAMIC_PACKAGES_DATES].dataConfig.minDate = new Date(response.FromDate);
            }
            if (response.ToDate) {
              registry[ESharedInputType.DYNAMIC_PACKAGES_DATES].dataConfig.maxDate = new Date(response.ToDate);
            }
            this.inputsRow?.updateValues();
            const datesInput = this.inputConfigs.find(c => c.type === ESharedInputType.DYNAMIC_PACKAGES_DATES);
            if (datesInput) {
              datesInput.value = { start: null, end: null };
              datesInput.isDisabled = false;
            }
            this.inputsRow?.updateValues();
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
          datesInput.value = { start: null, end: null };
          datesInput.isDisabled = false;
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
