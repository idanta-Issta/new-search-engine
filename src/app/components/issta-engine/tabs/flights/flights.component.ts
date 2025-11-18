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

  readonly inputsOrder: ESharedInputType[] = [
    ESharedInputType.DESTINATIONS_FLIGHTS,
    ESharedInputType.ORIGINS_FLIGHTS,
    ESharedInputType.PICKER_DATES,
    ESharedInputType.PASSANGERS_FLIGHTS,
  ];

  readonly inputWidths: Partial<Record<ESharedInputType, string>> = {
    [ESharedInputType.DESTINATIONS_FLIGHTS]: InputSizeHelper.getWidth(EInputSize.LARGE),
    [ESharedInputType.ORIGINS_FLIGHTS]: InputSizeHelper.getWidth(EInputSize.LARGE),
    [ESharedInputType.PICKER_DATES]: InputSizeHelper.getWidth(EInputSize.MEDIUM),
    [ESharedInputType.PASSANGERS_FLIGHTS]: InputSizeHelper.getWidth(EInputSize.SMALL),
  };

  selectedDestination: MenuOption | null = null;
  selectedOrigin: MenuOption | null = null;

  selectedDate = { start: null as Date | null, end: null as Date | null };

  selectedPassengers: PassangersInput | null = null;

  valuesMap = {
    [ESharedInputType.DESTINATIONS_FLIGHTS]: { label: 'תל אביב, שדה תעופה (TLV)', value: 'TLV' },
    [ESharedInputType.ORIGINS_FLIGHTS]: null,
    [ESharedInputType.PICKER_DATES]: this.selectedDate,
    [ESharedInputType.PASSANGERS_FLIGHTS]: null,
  };

  onInputPicked(event: { type: ESharedInputType; value: any }) {
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
    this.valuesMap = { ...this.valuesMap, [type]: value };
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
    console.log('Generated URL:', url);
    window.open(url, '_blank');
  }

  onFooterOptionChange(event: { value: string; checked: boolean }) {
    console.log('Footer option changed:', event);
  }

  onHeaderStateChange(state: HeaderState) {
    this.headerState = state;
    console.log('Header state changed:', state);
  }
}
