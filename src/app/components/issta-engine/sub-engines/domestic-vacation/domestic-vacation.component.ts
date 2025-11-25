import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ESharedInputType } from '../../../../enums/ESharedInputType';
import { SharedInputRowComponent } from '../../shared/inputs/input-row/shared-input-row/shared-input-row.component';
import { PassangersInput } from '../../../../models/shared-passanger-input.models';
import { SearchFooterComponent } from '../../shared/footer/search-footer/search-footer.component';
import { SearchHeaderComponent } from '../../shared/header/search-header/search-header.component';
import { DOMESTIC_VACATION_CONFIG } from '../../../../config/search-engine.config';
import { BaseEngineComponent } from '../base-engine.component';
import { BaseEngineService } from '../../../../services/engine.service';
import { DomesticVacationManager } from '../../../../managers/domestic-vacation.manager';

@Component({
  selector: 'app-domestic-vacation',
  standalone: true,
  imports: [CommonModule, SharedInputRowComponent, SearchFooterComponent, SearchHeaderComponent],
  templateUrl: './domestic-vacation.component.html',
})
export class DomesticVacationComponent extends BaseEngineComponent {
  protected config = DOMESTIC_VACATION_CONFIG;
  private manager = new DomesticVacationManager();

  selectedDestination: any = null;
  selectedDate = { start: null as Date | null, end: null as Date | null };
  selectedPassengers: PassangersInput | null = null;

  constructor(engineService: BaseEngineService) {
    super(engineService);
  }

  protected updateValue(type: ESharedInputType, value: any): void {
    switch (type) {
      case ESharedInputType.HOTELS_DESTINATION:
        this.selectedDestination = value;
        break;
      case ESharedInputType.PICKER_DATES:
        this.selectedDate = value;
        break;
      case ESharedInputType.PASSANGERS_ABOARD_HOTEL:
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
          this.inputsRow?.openInputDelayed(ESharedInputType.PASSANGERS_ABOARD_HOTEL);
        }
        break;
    }
  }

  buildUrl(): string {
    return this.manager.buildUrl({
      destination: this.selectedDestination,
      dates: this.selectedDate,
      passengers: this.selectedPassengers
    });
  }
}
