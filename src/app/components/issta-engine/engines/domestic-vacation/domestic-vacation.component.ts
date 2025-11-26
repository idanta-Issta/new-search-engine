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
  addFlightSelected = false;

  constructor(engineService: BaseEngineService) {
    super(engineService);
  }

  protected updateValue(type: ESharedInputType, value: any): void {
    switch (type) {
      case ESharedInputType.DOMESTIC_VACATION_DESTINATION:
        this.selectedDestination = value;
        this.evaluateAddFlightVisibility(value);
        break;
      case ESharedInputType.PICKER_DATES:
        this.selectedDate = value;
        break;
      case ESharedInputType.PASSANGERS_DOMESTIC_VACATION:
        this.selectedPassengers = value;
        break;
    }
  }

  protected openNextInput(type: ESharedInputType, value: any): void {
    switch (type) {
      case ESharedInputType.DOMESTIC_VACATION_DESTINATION:
        if (value) {
          this.inputsRow?.openInputDelayed(ESharedInputType.PICKER_DATES);
        }
        break;
      case ESharedInputType.PICKER_DATES:
        if (value?.start && value?.end) {
          this.inputsRow?.openInputDelayed(ESharedInputType.PASSANGERS_DOMESTIC_VACATION);
        }
        break;
    }
  }

  private evaluateAddFlightVisibility(destination: any) {
    const label: string = destination?.label || destination?.value || '';
    const hasEilat = /אילת/.test(label);
    const options = this.footer?.options as any[] | undefined;
    if (!options) return;
    const addFlight = options.find(o => o.value === 'add_flight');
    if (addFlight) {
      addFlight.isHidden = !hasEilat;
      // אם מוסתר נוודא שהמצב מבוטל
      if (addFlight.isHidden) {
        addFlight.checked = false;
        this.addFlightSelected = false;
      }
    }
  }

  override onHeaderStateChange(state: any): void {
    super.onHeaderStateChange(state);
    // בחירה דרך header כבר לא מנהלת add_flight
  }

  override onFooterOptionChange(event: { value: string; checked: boolean }): void {
    super.onFooterOptionChange(event);
    if (event.value === 'add_flight') {
      this.addFlightSelected = event.checked;
    }
  }

  buildUrl(): string {
    return this.manager.buildUrl({
      destination: this.selectedDestination,
      dates: this.selectedDate,
      passengers: this.selectedPassengers,
      addFlight: this.addFlightSelected
    });
  }
}
