
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuOption } from '../../../../models/shared-options-input.models';
import { ESharedInputType } from '../../../../enums/ESharedInputType';
import { SharedInputRowComponent } from '../../shared/inputs/input-row/shared-input-row/shared-input-row.component';
import { PassangersInput } from '../../../../models/shared-passanger-input.models';
import { FlightUrlBuilderService } from '../../../../services/flight-url-builder.service';
import { ISearchEngine } from '../../../../models/search-engine-base.interface';
import { SearchFooterComponent } from '../../shared/footer/search-footer/search-footer.component';
import { SearchHeaderComponent, HeaderState } from '../../shared/header/search-header/search-header.component';
import { FLIGHTS_CONFIG, SearchEngineConfig } from '../../../../config/search-engine.config';
import { switchToEngine } from '../../../../config/engine-registry';
import { InputConfig } from '../../../../models/input-config.model';
import { ETypeSearchEngine } from '../../../../enums/ETypeSearchEngine';

@Component({
  selector: 'app-flights-multi-destinations',
  standalone: true,
  imports: [CommonModule, SharedInputRowComponent, SearchFooterComponent, SearchHeaderComponent],
  templateUrl: './flights_multi_destinations.component.html',
  styleUrls: ['./flights_multi_destinations.component.scss']
})

export class FlightsComponent implements ISearchEngine {
  @ViewChild('inputsRow') inputsRow!: SharedInputRowComponent;

  EInputType = ESharedInputType;
  ESharedInputType = ESharedInputType;

  private config = FLIGHTS_CONFIG;
  private originalConfig = FLIGHTS_CONFIG;
  
  activeHeader: any;
  activeFooter: any;
  isTransitioning = false;
  currentEngine: ETypeSearchEngine | null = null;

  constructor(private flightUrlBuilder: FlightUrlBuilderService) {
    this.inputConfigs = [...this.config.inputs];
    this.activeHeader = this.config.header;
    this.activeFooter = this.config.footer;
  }

  getConfig(): SearchEngineConfig {
    return this.config;
  }

  get header() {
    return this.activeHeader;
  }

  get footer() {
    return this.activeFooter;
  }

  headerState: HeaderState = {};
  inputConfigs: InputConfig[];
  selectedDestination: MenuOption | null = null;
  selectedOrigin: MenuOption | null = null;
  selectedDate = { start: null as Date | null, end: null as Date | null };
  selectedPassengers: PassangersInput | null = null;

  onInputPicked(event: { type: ESharedInputType; value: any }) {

    const config = this.inputConfigs.find(c => c.type === event.type);
    if (config) {
      config.value = event.value;
    }

    this.updateValue(event.type, event.value);

    switch (event.type) {
      case ESharedInputType.DESTINATIONS_FLIGHTS:
        this.openNextInput(ESharedInputType.ORIGINS_FLIGHTS);
        break;
      case ESharedInputType.ORIGINS_FLIGHTS:
        this.openNextInput(ESharedInputType.PICKER_DATES);
        break;
      case ESharedInputType.PICKER_DATES:
        if (event.value?.start && event.value?.end) {
          this.openNextInput(ESharedInputType.PASSANGERS_FLIGHTS);
        }
        break;
    }
  }

  private updateValue(type: ESharedInputType, value: any) {
    switch (type) {
      case ESharedInputType.DESTINATIONS_FLIGHTS:
        this.selectedDestination = value;
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

  private openNextInput(type: ESharedInputType) {
    this.inputsRow?.openInputDelayed(type);
  }

  buildUrl(): string {
    return this.flightUrlBuilder.buildFlightUrl({
      origin: this.selectedOrigin,
      destination: this.selectedDestination,
      dates: this.selectedDate,
      passengers: this.selectedPassengers
    });
  }

  onSearch() {
    const url = this.buildUrl();
    window.open(url, '_blank');
  }

  onFooterOptionChange(event: { value: string; checked: boolean }) {
  }

  onHeaderStateChange(state: HeaderState) {
    this.headerState = state;
    
    const targetEngine = state.selectedChoice?.useEngine || null;
    
    // רק אם יש שינוי במנוע
    if (targetEngine !== this.currentEngine) {
      if (targetEngine) {
        this.animateEngineSwitch(() => {
          const result = switchToEngine(targetEngine, this.originalConfig);
          this.activeHeader = result.header;
          this.activeFooter = result.footer;
          this.inputConfigs = result.inputs;
          this.currentEngine = targetEngine;
        });
      } else {
        this.animateEngineSwitch(() => {
          this.resetToOriginalEngine();
          this.currentEngine = null;
        });
      }
    }
  }

  private animateEngineSwitch(callback: () => void) {
    this.isTransitioning = true;
    
    // Fade out
    setTimeout(() => {
      callback();
      
      // Fade in
      setTimeout(() => {
        this.isTransitioning = false;
      }, 20);
    }, 150);
  }

  private resetToOriginalEngine() {
    this.activeHeader = this.originalConfig.header;
    this.activeFooter = this.originalConfig.footer;
    this.inputConfigs = [...this.originalConfig.inputs];
  }
}
