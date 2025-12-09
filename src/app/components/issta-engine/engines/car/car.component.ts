import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ESharedInputType } from '../../../../enums/ESharedInputType';
import { SharedInputRowComponent } from '../../shared/inputs/input-row/shared-input-row/shared-input-row.component';
import { SearchFooterComponent } from '../../shared/footer/search-footer/search-footer.component';
import { SearchHeaderComponent } from '../../shared/header/search-header/search-header.component';
import { CAR_RENTAL_CONFIG } from '../../../../config/search-engine.config';
import { BaseEngineComponent } from '../base-engine.component';
import { BaseEngineService } from '../../../../services/engine.service';
import { CarManager } from '../../../../managers/car.manager';
import { ApiService } from '../../../../services/api.service';
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
  private manager = new CarManager();

  selectedPickupCountry: any = null;
  selectedPickupCity: any = null;
  selectedReturnCity: any = null;
  selectedDates: { start: Date | null; end: Date | null; startTime?: string; endTime?: string } | null = null;
  selectedDriverAge: number | null = 30;

  constructor(
    engineService: BaseEngineService,
    private apiService: ApiService,
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
        
        const cityInput = this.inputConfigs.find(c => c.type === ESharedInputType.CAR_PICKUP_CITY);
        
        // אם אין מדינה נבחרת - נעילה מוחלטת
        if (!value || !value.CountryCode) {
          if (cityInput) {
            cityInput.value = null;
            cityInput.isDisabled = true;
          }
          this.selectedPickupCity = null;
          this.inputsRow?.updateValues();
          return;
        }
        
        // יש מדינה - טוען ערים
        if (cityInput) {
          cityInput.value = { label: 'טוען ערים...', key: 'loading' };
          cityInput.isDisabled = true;
        }
        this.selectedPickupCity = { label: 'טוען ערים...', key: 'loading' };
        
        // Trigger UI update
        this.inputsRow?.updateValues();
        
        // Load cities for selected country
        this.loadCitiesForCountry(value.CountryCode);
        break;
        
      case ESharedInputType.CAR_PICKUP_CITY:
        // Combined value with both pickup and return cities
        this.selectedPickupCity = value?._pickupCity;
        this.selectedReturnCity = value?._returnCity;
        console.log('🏙️ Cities selected - Pickup:', this.selectedPickupCity?.label, 'Return:', this.selectedReturnCity?.label);
        
        // Update the input config value
        const cityInputConfig = this.inputConfigs.find(c => c.type === ESharedInputType.CAR_PICKUP_CITY);
        if (cityInputConfig) {
          cityInputConfig.value = value;
        }
        this.inputsRow?.updateValues();
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
    
    const cityInput = this.inputConfigs.find(c => c.type === ESharedInputType.CAR_PICKUP_CITY);
    
    this.apiService.get<any>(url, {
      onLoading: () => {
        if (cityInput) {
          cityInput.value = { label: 'טוען ערים...', key: 'loading' };
          cityInput.isDisabled = true;
        }
        this.inputsRow?.updateValues();
      },
      onSuccess: (response) => {
        console.log('✅ Cities loaded raw response:', response);
      
        const { CarMapper } = require('../../../../mappers/car.mapper');
        const mappedCities = CarMapper.mapCities(response);
        console.log('🗺️ Mapped cities:', mappedCities);
        
        this.optionsService.clearCacheForType(ESharedInputType.CAR_PICKUP_CITY);
        
        import('../../../../config/shared-input.registry').then(module => {
          const registry = module.SharedInputRegistry;
          if (registry[ESharedInputType.CAR_PICKUP_CITY]) {
            registry[ESharedInputType.CAR_PICKUP_CITY].listMenuOption = mappedCities;
          }
        });
        
        // Re-enable input and reset to default
        if (cityInput) {
          cityInput.value = null;
          cityInput.isDisabled = false;
        }
        this.selectedPickupCity = null;
        this.inputsRow?.updateValues();
        
        // Open the city input automatically
        setTimeout(() => {
          this.inputsRow?.openInputDelayed(ESharedInputType.CAR_PICKUP_CITY, 0);
        }, 100);
        
        console.log('🔄 UI updated with cities');
      },
      onError: (err) => {
        console.error('❌ Failed to load cities:', err);
        if (cityInput) {
          cityInput.value = { label: 'שגיאה בטעינה', key: 'error' };
          cityInput.isDisabled = false;
        }
        this.inputsRow?.updateValues();
      }
    }).subscribe();
  }

  protected openNextInput(type: ESharedInputType, value: any): void {
    switch (type) {
      case ESharedInputType.CAR_PICKUP_COUNTRY:
        this.inputsRow?.openInputDelayed(ESharedInputType.CAR_PICKUP_CITY);
        break;
      case ESharedInputType.CAR_PICKUP_CITY:
        // if (value) {
        //   this.inputsRow?.openInputDelayed(ESharedInputType.CAR_DATES);
        // }
        break;
      case ESharedInputType.CAR_DATES:
        if (value?.start && value?.end) {
          const driverAgeInput = this.inputConfigs.find(c => c.type === ESharedInputType.CAR_DRIVER_AGE);
          if (driverAgeInput) {
            this.inputsRow?.openInputDelayed(ESharedInputType.CAR_DRIVER_AGE);
          }
        }
        break;
    }
  }

  buildUrl(): string {
    const queryParams = this.manager.buildUrl({
      pickupCountry: this.selectedPickupCountry,
      pickupCity: this.selectedPickupCity,
      returnCity: this.selectedReturnCity,
      dates: this.selectedDates,
      driverAge: this.selectedDriverAge
    });
    
    const productInfo = this.manager.getProductPath();
    return BaseEngineService.buildRedirectUrl(
      productInfo.path,
      queryParams,
      productInfo.addResultLabel
    );
  }
}
