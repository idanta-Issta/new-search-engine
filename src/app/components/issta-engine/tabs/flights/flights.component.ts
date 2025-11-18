// src/app/features/flights/flights.component.ts
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
import { InputSizeHelper } from '../../../../utilies/input-size.helper';
import { EInputSize } from '../../../../enums/EInputSize';
import { EDropdownPosition } from '../../../../enums/EDropdownPosition';
import { InputConfig } from '../../../../models/input-config.model';

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [CommonModule, SharedInputRowComponent, SearchFooterComponent, SearchHeaderComponent],
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.scss'],
})

export class FlightsComponent implements ISearchEngine {
  @ViewChild('inputsRow') inputsRow!: SharedInputRowComponent;

  EInputType = ESharedInputType;
  ESharedInputType = ESharedInputType;

  private config = FLIGHTS_CONFIG;

  constructor(private flightUrlBuilder: FlightUrlBuilderService) {}

  getConfig(): SearchEngineConfig {
    return this.config;
  }

  get header() {
    return this.config.header;
  }

  get footer() {
    return this.config.footer;
  }

  headerState: HeaderState = {};

  readonly inputConfigs: InputConfig[] = [
    {
      type: ESharedInputType.DESTINATIONS_FLIGHTS,
      size: EInputSize.LARGE,
      position: EDropdownPosition.BOTTOM_LEFT,
      value: { label: 'תל אביב, שדה תעופה (TLV)', value: 'TLV' }
    },
    {
      type: ESharedInputType.ORIGINS_FLIGHTS,
      size: EInputSize.LARGE,
      position: EDropdownPosition.BOTTOM_LEFT,
      value: null
    },
    {
      type: ESharedInputType.PICKER_DATES,
      size: EInputSize.MEDIUM,
      position: EDropdownPosition.BOTTOM_CENTER,
      value: { start: null as Date | null, end: null as Date | null }
    },
    {
      type: ESharedInputType.PASSANGERS_FLIGHTS,
      size: EInputSize.SMALL,
      position: EDropdownPosition.BOTTOM_RIGHT,
      value: null
    }
  ];

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
  }
}
