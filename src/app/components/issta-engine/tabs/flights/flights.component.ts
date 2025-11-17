// src/app/features/flights/flights.component.ts
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionTitleComponent } from '../../shared/section-title/section-title.component';
import { MenuOption } from '../../../../models/shared-options-input.models';
import { ESharedInputType } from '../../../../enums/ESharedInputType';
import { SharedCalendarInputComponent } from '../../shared/inputs/shared-calendar-input/shared-calendar-input.component';
import { SharedCalendarInputConfig } from '../../../../models/shared-calendar-input.models';
import { SharedInputRowComponent } from '../../shared/inputs/input-row/shared-input-row/shared-input-row.component';
import { SharedInputRegistry } from '../../../../config/shared-input.registry';
import { PassangersInput } from '../../../../models/shared-passanger-input.models';

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [CommonModule, SectionTitleComponent, SharedInputRowComponent],
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.scss'],
})

export class FlightsComponent {
  @ViewChild('inputsRow') inputsRow!: SharedInputRowComponent;

  EInputType = ESharedInputType;
  ESharedInputType = ESharedInputType;

  // 1) הגדר מערך פעם אחת – לא inline בטמפלייט
  readonly inputsOrder: ESharedInputType[] = [
    ESharedInputType.DESTINATIONS_FLIGHTS,
    ESharedInputType.ORIGINS_FLIGHTS,
    ESharedInputType.PICKER_DATES,
    ESharedInputType.PASSANGERS_FLIGHTS,
  ];

  selectedOrigin: MenuOption | null = null;
  selectedDestination: MenuOption | null = null;

  selectedDate = { start: null as Date | null, end: null as Date | null };

  selectedPassengers: PassangersInput | null = null;

  valuesMap = {
    [ESharedInputType.DESTINATIONS_FLIGHTS]: null,
    [ESharedInputType.ORIGINS_FLIGHTS]: null,
    [ESharedInputType.PICKER_DATES]: this.selectedDate,
    [ESharedInputType.PASSANGERS_FLIGHTS]: null,
  };

  onInputPicked(event: { type: ESharedInputType; value: any }) {
    switch (event.type) {
      case ESharedInputType.DESTINATIONS_FLIGHTS:
        this.selectedDestination = event.value;
        this.valuesMap = {
          ...this.valuesMap,
          [ESharedInputType.DESTINATIONS_FLIGHTS]: event.value,
        };
        setTimeout(() => this.openInput(ESharedInputType.ORIGINS_FLIGHTS), 0);
        break;
      case ESharedInputType.ORIGINS_FLIGHTS:
        this.selectedOrigin = event.value;
        this.valuesMap = {
          ...this.valuesMap,
          [ESharedInputType.ORIGINS_FLIGHTS]: event.value,
        };
        setTimeout(() => this.openInput(ESharedInputType.PICKER_DATES), 0);
        break;

      case ESharedInputType.PICKER_DATES:
        this.selectedDate = event.value;
        this.valuesMap = {
          ...this.valuesMap,
          [ESharedInputType.PICKER_DATES]: event.value,
        };
        if (event.value?.start && event.value?.end) {
          setTimeout(() => this.openInput(ESharedInputType.PASSANGERS_FLIGHTS), 0);
        }
        break;

      case ESharedInputType.PASSANGERS_FLIGHTS:
        this.selectedPassengers = event.value;
        this.valuesMap = {
          ...this.valuesMap,
          [ESharedInputType.PASSANGERS_FLIGHTS]: event.value,
        };
        break;
    }
  }

  openInput(type: ESharedInputType) {
    this.inputsRow?.openInput(type);
  }
}

