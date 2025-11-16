import { Component,ViewChild  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionTitleComponent } from '../../shared/section-title/section-title.component';
import { MenuOption } from '../../../../models/shared-options-input.models';
import { ESharedInputType } from '../../../../enums/ESharedInputType';
import { SharedCalendarInputComponent } from '../../shared/inputs/shared-calendar-input/shared-calendar-input.component';
import { SharedCalendarInputConfig } from '../../../../models/shared-calendar-input.models';
import {  SharedInputRowComponent } from '../../shared/inputs/input-row/shared-input-row/shared-input-row.component';
@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [
    CommonModule,
    SectionTitleComponent,
    SharedInputRowComponent
  ],
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.scss']
})
export class FlightsComponent {
  @ViewChild('calendarRef') calendarRef!: SharedCalendarInputComponent;
  EInputType = ESharedInputType;

  selectedOrigin: MenuOption | null = null;
  selectedDestination: MenuOption | null = null;
  ESharedInputType = ESharedInputType;
  origin?: MenuOption;
  destination?: MenuOption;

selectedDate = {
  start: null,
  end: null
};

calendarConfig: SharedCalendarInputConfig = {
  suggestedDates: [],
  minDate: new Date(),
  maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  allowPickHours: false
};


valuesMap = {
  [ESharedInputType.DESTINATIONS_FLIGHTS]: this.destination,
  [ESharedInputType.ORIGINS_FLIGHTS]: this.origin,
  [ESharedInputType.PICKER_DATES]: this.selectedDate,
  [ESharedInputType.PASSANGERS_FLIGHTS]: null, // 👈 הוסף ערך ריק
};





  onOriginSelected(option: MenuOption) {
    this.selectedOrigin = option;
  }

  onDestinationSelected(option: MenuOption) {
    this.selectedDestination = option;
  }

    onDestinationPicked(option: MenuOption) {
    console.log('נבחר יעד:', option);
    if (this.calendarRef) {
    this.calendarRef.isOpen = true;
  } else {
    setTimeout(() => this.calendarRef.isOpen = true, 0);
  }
  }
}
