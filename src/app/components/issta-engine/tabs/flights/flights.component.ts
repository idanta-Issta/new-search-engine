import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionTitleComponent } from '../../shared/section-title/section-title.component';
import { SharedOptionsInputComponent } from '../../shared/inputs/shared-options-input/shared-options-input.component';
import { MenuOption } from '../../../../models/shared-options-input.models';
import { ESharedInputType } from '../../../../enums/ESharedInputType';
import { SharedCalendarInputComponent } from '../../shared/inputs/shared-calendar-input/shared-calendar-input.component';
import { SharedCalendarInputConfig } from '../../../../models/shared-calendar-input.models';

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [
    CommonModule,
    SectionTitleComponent,
    SharedOptionsInputComponent,
    SharedCalendarInputComponent
  ],
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.scss']
})
export class FlightsComponent {

  EInputType = ESharedInputType;

  selectedOrigin: MenuOption | null = null;
  selectedDestination: MenuOption | null = null;

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


  onOriginSelected(option: MenuOption) {
    this.selectedOrigin = option;
  }

  onDestinationSelected(option: MenuOption) {
    this.selectedDestination = option;
  }
}
