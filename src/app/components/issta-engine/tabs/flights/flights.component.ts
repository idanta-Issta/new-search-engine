import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionTitleComponent } from '../../shared/section-title/section-title.component';
import { SharedOptionsInputComponent } from '../../shared/inputs/shared-options-input/shared-options-input.component';
import { MenuOption } from '../../../../models/shared-options-input.models';
import { ESharedInputType } from '../../../../models/shared-input-type.enum';
import { SharedCalendarInputComponent } from
  '../../shared/inputs/shared-calendar-input/shared-calendar-input.component';


@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [CommonModule, SectionTitleComponent, SharedOptionsInputComponent, SharedCalendarInputComponent],
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.scss']
})
export class FlightsComponent {
  selectedOrigin: MenuOption | null = null;
  selectedDestination: MenuOption | null = null;
  EInputType = ESharedInputType; 
 origin?: MenuOption;
destination?: MenuOption;



  onOriginSelected(option: MenuOption) {
    this.selectedOrigin = option;
  }

  onDestinationSelected(option: MenuOption) {
    this.selectedDestination = option;
  }
}
