import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ESharedInputType } from '../../../../enums/ESharedInputType';
import { SharedInputRowComponent } from '../../shared/inputs/input-row/shared-input-row/shared-input-row.component';
import { SearchFooterComponent } from '../../shared/footer/search-footer/search-footer.component';
import { SearchHeaderComponent } from '../../shared/header/search-header/search-header.component';
import { CAR_RENTAL_CONFIG } from '../../../../config/search-engine.config';
import { BaseEngineComponent } from '../base-engine.component';
import { BaseEngineService } from '../../../../services/engine.service';
import { HttpClient } from '@angular/common/http';
import { AppExternalConfig } from '../../../../config/app.external.config';
import { SharedOptionsService } from '../../../../services/shared-options.service';

@Component({
  selector: 'app-car',
  standalone: true,
  imports: [CommonModule, SharedInputRowComponent, SearchFooterComponent, SearchHeaderComponent],
  templateUrl: './car.component.html',
})
export class CarComponent extends BaseEngineComponent {
  protected config = CAR_RENTAL_CONFIG;

  selectedPickupCountry: any = null;
  selectedPickupCity: any = null;
  selectedReturnCity: any = null;
  selectedDates: { start: Date | null; end: Date | null; startTime?: string; endTime?: string } | null = null;
  selectedDriverAge: number | null = null;

  constructor(
    engineService: BaseEngineService,
    private http: HttpClient,
    private optionsService: SharedOptionsService
  ) {
    super(engineService);
  }

  protected updateValue(type: ESharedInputType, value: any): void {
    console.log('🚗 Car updateValue:', { type, value });
    
    switch (type) {
      case ESharedInputType.CAR_PICKUP_COUNTRY:
        this.selectedPickupCountry = value;
        console.log('🌍 Pickup country selected:', value?.label, 'CountryCode:', value?.CountryCode);
        
        // Reset city selection and show loading state
        const cityInput = this.inputConfigs.find(c => c.type === ESharedInputType.CAR_PICKUP_CITY);
        if (cityInput) {
          cityInput.value = { label: 'טוען ערים...', key: 'loading' };
          cityInput.isDisabled = true;
        }
        this.selectedPickupCity = { label: 'טוען ערים...', key: 'loading' };
        
        // Trigger UI update
        this.inputsRow?.updateValues();
        
        // Load cities for selected country
        this.loadCitiesForCountry(value?.CountryCode);
        break;
        
      case ESharedInputType.CAR_PICKUP_CITY:
        // Combined value with both pickup and return cities
        this.selectedPickupCity = value?._pickupCity;
        this.selectedReturnCity = value?._returnCity;
        console.log('🏙️ Cities selected - Pickup:', this.selectedPickupCity?.label, 'Return:', this.selectedReturnCity?.label);
        break;
        
      case ESharedInputType.CAR_DATES:
        this.selectedDates = value;
        console.log('📅 Dates selected:', value);
        break;
        
      case ESharedInputType.CAR_DRIVER_AGE:
        this.selectedDriverAge = value;
        console.log('👤 Driver age selected:', value);
        break;
    }
  }

  private loadCitiesForCountry(countryCode: string) {
    console.log('🏙️ Loading cities for country:', countryCode);
    
    if (!countryCode) {
      console.log('⚠️ No country selected, resetting');
      const cityInput = this.inputConfigs.find(c => c.type === ESharedInputType.CAR_PICKUP_CITY);
      if (cityInput) {
        cityInput.value = null;
        cityInput.isDisabled = true;
      }
      this.selectedPickupCity = null;
      this.inputsRow?.updateValues();
      return;
    }

    // Load cities from API
    const url = `${AppExternalConfig.baseUrl}car/cities?countryCode=${countryCode}`;
    console.log('📡 Loading cities from URL:', url);
    
    this.http.get<any>(url).subscribe({
      next: (response) => {
        console.log('✅ Cities loaded:', response);
        
        // Clear cache for cities to force reload
        this.optionsService.clearCacheForType(ESharedInputType.CAR_PICKUP_CITY);
        
        // Update registry with new URL
        import('../../../../config/shared-input.registry').then(module => {
          const registry = module.SharedInputRegistry;
          if (registry[ESharedInputType.CAR_PICKUP_CITY]) {
            registry[ESharedInputType.CAR_PICKUP_CITY].requestUrl = url;
            console.log('📝 Updated registry with cities URL');
          }
        });
        
        // Re-enable input and reset to default
        const cityInput = this.inputConfigs.find(c => c.type === ESharedInputType.CAR_PICKUP_CITY);
        if (cityInput) {
          cityInput.value = null;
          cityInput.isDisabled = false;
        }
        this.selectedPickupCity = null;
        this.inputsRow?.updateValues();
        

        setTimeout(() => {
          this.inputsRow?.openInputDelayed(ESharedInputType.CAR_PICKUP_CITY, 0);
        }, 100);
        
        console.log('🔄 UI updated with cities');
      },
      error: (err) => {
        console.error('❌ Failed to load cities:', err);
        const cityInput = this.inputConfigs.find(c => c.type === ESharedInputType.CAR_PICKUP_CITY);
        if (cityInput) {
          cityInput.value = { label: 'שגיאה בטעינה', key: 'error' };
          cityInput.isDisabled = false;
        }
        this.inputsRow?.updateValues();
      }
    });
  }

  protected openNextInput(type: ESharedInputType, value: any): void {
    switch (type) {
      case ESharedInputType.CAR_PICKUP_COUNTRY:
        this.inputsRow?.openInputDelayed(ESharedInputType.CAR_PICKUP_CITY);
        break;
      case ESharedInputType.CAR_PICKUP_CITY:
        if (value) {
          this.inputsRow?.openInputDelayed(ESharedInputType.CAR_DATES);
        }
        break;
      case ESharedInputType.CAR_DATES:
        if (value?.start && value?.end) {
          // Only open driver age if it exists in config
          const driverAgeInput = this.inputConfigs.find(c => c.type === ESharedInputType.CAR_DRIVER_AGE);
          if (driverAgeInput) {
            this.inputsRow?.openInputDelayed(ESharedInputType.CAR_DRIVER_AGE);
          }
        }
        break;
    }
  }

  buildUrl(): string {
    console.log('🚗 Car search:', {
      pickupCountry: this.selectedPickupCountry,
      pickupCity: this.selectedPickupCity,
      returnCity: this.selectedReturnCity,
      dates: this.selectedDates,
      driverAge: this.selectedDriverAge
    });
    
    // Build car rental search URL
    const params: string[] = [];
    
    if (this.selectedPickupCity?.key) {
      params.push(`pickupCity=${this.selectedPickupCity.key}`);
    }
    
    if (this.selectedReturnCity?.key) {
      params.push(`returnCity=${this.selectedReturnCity.key}`);
    }
    
    if (this.selectedDates?.start) {
      const pickupDate = this.formatDateForURL(this.selectedDates.start);
      const pickupTime = this.selectedDates.startTime || '10:00';
      params.push(`pickupDate=${pickupDate}`);
      params.push(`pickupTime=${pickupTime}`);
    }
    
    if (this.selectedDates?.end) {
      const returnDate = this.formatDateForURL(this.selectedDates.end);
      const returnTime = this.selectedDates.endTime || '10:00';
      params.push(`returnDate=${returnDate}`);
      params.push(`returnTime=${returnTime}`);
    }
    
    if (this.selectedDriverAge) {
      params.push(`driverAge=${this.selectedDriverAge}`);
    }
    
    const queryString = params.length > 0 ? `?${params.join('&')}` : '';
    return `/car/search${queryString}`;
  }

  private formatDateForURL(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
