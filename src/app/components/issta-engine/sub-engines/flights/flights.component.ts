
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuOption } from '../../../../models/shared-options-input.models';
import { ESharedInputType } from '../../../../enums/ESharedInputType';
import { SharedInputRowComponent } from '../../shared/inputs/input-row/shared-input-row/shared-input-row.component';
import { PassangersInput } from '../../../../models/shared-passanger-input.models';
import { FlightUrlBuilderService } from '../../../../services/flight-url-builder.service';
import { SearchFooterComponent } from '../../shared/footer/search-footer/search-footer.component';
import { SearchHeaderComponent } from '../../shared/header/search-header/search-header.component';
import { FLIGHTS_CONFIG } from '../../../../config/search-engine.config';
import { BaseEngineService } from '../../../../services/engine.service';
import { BaseEngineComponent } from '../base-engine.component';


@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [CommonModule, SharedInputRowComponent, SearchFooterComponent, SearchHeaderComponent],
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.scss']
})
export class FlightsComponent extends BaseEngineComponent {
  protected config = FLIGHTS_CONFIG;

  selectedOrigin: MenuOption | null = null;
  selectedDestination: MenuOption | null = null;
  selectedDate = { start: null as Date | null, end: null as Date | null };
  selectedPassengers: PassangersInput | null = null;

  constructor(
    engineService: BaseEngineService,
    private urlBuilder: FlightUrlBuilderService
  ) {
    super(engineService);
  }

  protected updateValue(type: ESharedInputType, value: any): void {
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

  buildUrl(): string {
    return this.urlBuilder.buildFlightUrl({
      origin: this.selectedOrigin,
      destination: this.selectedDestination,
      dates: this.selectedDate,
      passengers: this.selectedPassengers
    });
  }
}
