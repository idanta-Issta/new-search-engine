import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ESharedInputType } from '../../../../enums/ESharedInputType';
import { SharedInputRowComponent } from '../../shared/inputs/input-row/shared-input-row/shared-input-row.component';
import { PassangersInput } from '../../../../models/shared-passanger-input.models';
import { SearchFooterComponent } from '../../shared/footer/search-footer/search-footer.component';
import { SearchHeaderComponent } from '../../shared/header/search-header/search-header.component';
import { HOTEL_ABROAD_CONFIG } from '../../../../config/search-engine.config';
import { BaseEngineComponent } from '../base-engine.component';
import { BaseEngineService } from '../../../../services/engine.service';

@Component({
  selector: 'app-hotel-abroad',
  standalone: true,
  imports: [CommonModule, SharedInputRowComponent, SearchFooterComponent, SearchHeaderComponent],
  templateUrl: './hotel-abroad.component.html',
})
export class HotelAbroadComponent extends BaseEngineComponent {
  protected config = HOTEL_ABROAD_CONFIG;

  selectedDate = { start: null as Date | null, end: null as Date | null };
  selectedPassengers: PassangersInput | null = null;

  constructor(engineService: BaseEngineService) {
    super(engineService);
  }

  protected updateValue(type: ESharedInputType, value: any): void {
    switch (type) {
      case ESharedInputType.HOTELS_DESTINATION:
        // Store hotel destination
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
      case ESharedInputType.HOTELS_DESTINATION:
        if (value) {
          this.inputsRow?.openInputDelayed(ESharedInputType.PICKER_DATES);
        }
        break;
      case ESharedInputType.PICKER_DATES:
        if (value?.start && value?.end) {
          this.inputsRow?.openInputDelayed(ESharedInputType.PASSANGERS_FLIGHTS);
        }
        break;
    }
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
}
