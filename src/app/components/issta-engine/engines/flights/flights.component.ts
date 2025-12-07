
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuOption } from '../../../../models/shared-options-input.models';
import { ESharedInputType } from '../../../../enums/ESharedInputType';
import { SharedInputRowComponent } from '../../shared/inputs/input-row/shared-input-row/shared-input-row.component';
import { PassangersInput } from '../../../../models/shared-passanger-input.models';
import { SearchFooterComponent } from '../../shared/footer/search-footer/search-footer.component';
import { SearchHeaderComponent } from '../../shared/header/search-header/search-header.component';
import { FLIGHTS_CONFIG } from '../../../../config/search-engine.config';
import { BaseEngineService } from '../../../../services/engine.service';
import { BaseEngineComponent } from '../base-engine.component';
import { FlightsManager } from '../../../../managers/flights.manager';
import { VALUES } from '../../../../constants/app.constants';
import { CUSTOM_MENU_HEADERS } from '../../../../constants/custom-menu-headers.constants';


@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [CommonModule, SharedInputRowComponent, SearchFooterComponent, SearchHeaderComponent],
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.scss']
})
export class FlightsComponent extends BaseEngineComponent {
  protected config = FLIGHTS_CONFIG;
  private manager = new FlightsManager();

  selectedOrigin: MenuOption | null = null;
  selectedDestination: MenuOption | null = null;
  selectedDate = { start: null as Date | null, end: null as Date | null };
  selectedPassengers: PassangersInput | null = null;

  constructor(engineService: BaseEngineService) {
    super(engineService);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    // אתחול ערכי ברירת מחדל מהקונפיג
    const destinationConfig = this.inputConfigs.find(c => c.type === ESharedInputType.DESTINATIONS_FLIGHTS);
    console.log('🔍 ngOnInit - destinationConfig:', destinationConfig);
    console.log('🔍 ngOnInit - destinationConfig.value:', destinationConfig?.value);
    console.log('🔍 ngOnInit - destinationConfig.value.key:', destinationConfig?.value?.key);
    
    if (destinationConfig?.value) {
      this.selectedDestination = destinationConfig.value;
      
      // אתחול Origins input - הצג custom header רק אם Destination הוא TLV
      const originsInput = this.inputConfigs.find(c => c.type === ESharedInputType.ORIGINS_FLIGHTS);
      console.log('🔍 ngOnInit - originsInput:', originsInput);
      console.log('🔍 ngOnInit - Should show header?', destinationConfig.value.key === 'TLV');
      
      if (originsInput && destinationConfig.value.key === 'TLV') {
        console.log('✅ ngOnInit - Setting custom header (TLV detected)');
        originsInput.customMenuHeaderComponent = CUSTOM_MENU_HEADERS.FLIGHTS_PRICE_MAP.component;
        originsInput.customMenuHeaderConfig = CUSTOM_MENU_HEADERS.FLIGHTS_PRICE_MAP.config;
      } else {
        console.log('❌ ngOnInit - NOT setting custom header (not TLV)');
      }
    }
  }

  protected updateValue(type: ESharedInputType, value: any): void {
    switch (type) {
      case ESharedInputType.DESTINATIONS_FLIGHTS:
        console.log('🔄 updateValue - DESTINATIONS_FLIGHTS changed to:', value);
        console.log('🔄 updateValue - value.key:', value?.key);
        this.selectedDestination = value;
        
        const originsInput = this.inputConfigs.find(c => c.type === ESharedInputType.ORIGINS_FLIGHTS);
        console.log('🔄 updateValue - originsInput:', originsInput);
        console.log('🔄 updateValue - originsInput.customMenuHeaderComponent BEFORE:', originsInput?.customMenuHeaderComponent);
        
        if (originsInput) {
          if (value?.key === 'TLV') {
            console.log('✅ updateValue - Setting custom header (TLV)');
            // הצג את ה-custom header
            originsInput.customMenuHeaderComponent = CUSTOM_MENU_HEADERS.FLIGHTS_PRICE_MAP.component;
            originsInput.customMenuHeaderConfig = CUSTOM_MENU_HEADERS.FLIGHTS_PRICE_MAP.config;
          } else {
            console.log('❌ updateValue - Removing custom header (not TLV)');
            // הסתר את ה-custom header
            originsInput.customMenuHeaderComponent = undefined;
            originsInput.customMenuHeaderConfig = undefined;
          }
          console.log('🔄 updateValue - originsInput.customMenuHeaderComponent AFTER:', originsInput.customMenuHeaderComponent);
          // עדכן את הקומפוננטה
          this.inputsRow?.updateValues();
        }
        break;
      case ESharedInputType.ORIGINS_FLIGHTS:
        this.selectedOrigin = value;
        break;
      case ESharedInputType.PICKER_DATES:
        this.selectedDate = value;
        break;
      case ESharedInputType.PASSANGERS_FLIGHTS:
        this.selectedPassengers = value;
        break;
    }
  }

  protected openNextInput(type: ESharedInputType, value: any): void {
    switch (type) {
      case ESharedInputType.DESTINATIONS_FLIGHTS:
        this.inputsRow?.openInputDelayed(ESharedInputType.ORIGINS_FLIGHTS);
        break;
      case ESharedInputType.ORIGINS_FLIGHTS:
        this.inputsRow?.openInputDelayed(ESharedInputType.PICKER_DATES);
        break;
      case ESharedInputType.PICKER_DATES:
        if (value?.start && value?.end) {
          this.inputsRow?.openInputDelayed(ESharedInputType.PASSANGERS_FLIGHTS);
        }
        break;
    }
  }

  override onHeaderStateChange(state: any): void {
    super.onHeaderStateChange(state);
    
    if (state.selectedTripType?.value === VALUES.TRIP_TYPE.ONE_WAY) {
      if (this.activeFooter?.options) {
        this.activeFooter.options = this.activeFooter.options.map((opt: any) => {
          if (opt.value === VALUES.FOOTER_OPTIONS.FLEXIBLE) {
            return { ...opt, isHidden: true };
          }
          return opt;
        });
      }
      
      const dateInput = this.inputConfigs.find(c => c.type === ESharedInputType.PICKER_DATES);
      if (dateInput) {
        dateInput.isOneWay = true;
        this.inputsRow?.updateValues();
      }
    } else {
      if (this.activeFooter?.options) {
        this.activeFooter.options = this.activeFooter.options.map((opt: any) => {
          if (opt.value === VALUES.FOOTER_OPTIONS.FLEXIBLE) {
            return { ...opt, isHidden: false };
          }
          return opt;
        });
      }
      
      // Update calendar to range mode
      const dateInput = this.inputConfigs.find(c => c.type === ESharedInputType.PICKER_DATES);
      if (dateInput) {
        dateInput.isOneWay = false;
        this.inputsRow?.updateValues();
      }
    }
  }

  buildUrl(): string {
    const params = {
      origin: this.selectedOrigin,
      destination: this.selectedDestination,
      dates: this.selectedDate,
      passengers: this.selectedPassengers,
      headerState: this.headerState,
      footerState: this.footerState
    };
    
    const queryParams = this.manager.buildUrl(params);
    const productPathObject = this.manager.getProductPath(params);
    
    return BaseEngineService.buildRedirectUrl(productPathObject.path, queryParams, productPathObject.addResultLabel);
  }
}
