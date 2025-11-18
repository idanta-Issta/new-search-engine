import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ESharedInputType } from '../../../../enums/ESharedInputType';
import { SharedInputRowComponent } from '../../shared/inputs/input-row/shared-input-row/shared-input-row.component';
import { PassangersInput } from '../../../../models/shared-passanger-input.models';
import { ISearchEngine } from '../../../../models/search-engine-base.interface';
import { SearchFooterComponent } from '../../shared/footer/search-footer/search-footer.component';
import { SearchHeaderComponent, HeaderState } from '../../shared/header/search-header/search-header.component';
import { HOTEL_ABROAD_CONFIG, SearchEngineConfig } from '../../../../config/search-engine.config';
import { EInputSize } from '../../../../enums/EInputSize';
import { EDropdownPosition } from '../../../../enums/EDropdownPosition';
import { InputConfig } from '../../../../models/input-config.model';

@Component({
  selector: 'app-hotel-abroad',
  standalone: true,
  imports: [CommonModule, SharedInputRowComponent, SearchFooterComponent, SearchHeaderComponent],
  templateUrl: './hotel-abroad.component.html',
})
export class HotelAbroadComponent implements ISearchEngine {
  @ViewChild('inputsRow') inputsRow!: SharedInputRowComponent;

  private config = HOTEL_ABROAD_CONFIG;

  constructor() {}

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
      type: ESharedInputType.HOTELS_DESTINATION,
      size: EInputSize.HUGE,
      position: EDropdownPosition.BOTTOM_LEFT,
      value: null
    },
    {
      type: ESharedInputType.PICKER_DATES,
      size: EInputSize.MEDIUM,
      position: EDropdownPosition.BOTTOM_LEFT,
      value: { start: null as Date | null, end: null as Date | null }
    },
    {
      type: ESharedInputType.PASSANGERS_FLIGHTS,
      size: EInputSize.MEDIUM,
      position: EDropdownPosition.BOTTOM_RIGHT,
      value: null
    }
  ];

  selectedDate = { start: null as Date | null, end: null as Date | null };
  selectedPassengers: PassangersInput | null = null;

  onInputPicked(event: { type: ESharedInputType; value: any }) {
    const config = this.inputConfigs.find(c => c.type === event.type);
    if (config) {
      config.value = event.value;
    }

    this.updateValue(event.type, event.value);

    switch (event.type) {
      case ESharedInputType.PICKER_DATES:
        if (event.value?.start && event.value?.end) {
          this.openNextInput(ESharedInputType.PASSANGERS_FLIGHTS);
        }
        break;
    }
  }

  private updateValue(type: ESharedInputType, value: any) {
    switch (type) {
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
    const params = new URLSearchParams();
    
    if (this.selectedDate.start) {
      params.append('checkIn', this.selectedDate.start.toISOString().split('T')[0]);
    }
    if (this.selectedDate.end) {
      params.append('checkOut', this.selectedDate.end.toISOString().split('T')[0]);
    }
    if (this.selectedPassengers) {
      params.append('passengers', JSON.stringify(this.selectedPassengers));
    }

    return `https://www.issta.co.il/hotels-abroad?${params.toString()}`;
  }

  onSearch() {
    const url = this.buildUrl();
    console.log('Hotel search URL:', url);
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
