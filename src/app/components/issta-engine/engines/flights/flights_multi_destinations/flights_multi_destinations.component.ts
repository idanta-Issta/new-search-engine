import { Component, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuOption } from '../../../../../models/shared-options-input.models';
import { SharedOptionsInputComponent } from '../../../shared/inputs/shared-options-input/shared-options-input.component';
import { SharedCalendarInputComponent } from '../../../shared/inputs/shared-calendar-input/shared-calendar-input.component';
import { SharedPassangerInputComponent } from '../../../shared/inputs/shared-passanger-input/shared-passanger-input.component';
import { ESharedInputType } from '../../../../../enums/ESharedInputType';
import { EDropdownPosition } from '../../../../../enums/EDropdownPosition';
import { InputSizeHelper } from '../../../../../utilies/input-size.helper';
import { EInputSize } from '../../../../../enums/EInputSize';
import { PassangersInput } from '../../../../../models/shared-passanger-input.models';


interface FlightSegment {
  id: number;
  origin: MenuOption | null;
  destination: MenuOption | null;
  date: { start: Date | null; end: Date | null };
}

@Component({
  selector: 'app-flights-multi-destinations',
  standalone: true,
  imports: [
    CommonModule,
    SharedOptionsInputComponent,
    SharedCalendarInputComponent,
    SharedPassangerInputComponent
  ],
  templateUrl: './flights_multi_destinations.component.html',
  styleUrls: ['./flights_multi_destinations.component.scss']
})

export class FlightsMultiDestinationsComponent {
  @Output() inputPicked = new EventEmitter<{ type: ESharedInputType; value: any }>();
  @Output() searchClicked = new EventEmitter<void>();

  @ViewChildren(SharedOptionsInputComponent) optionsInputs!: QueryList<SharedOptionsInputComponent>;
  @ViewChildren(SharedCalendarInputComponent) calendarInputs!: QueryList<SharedCalendarInputComponent>;

  // Types
  readonly ORIGINS_FLIGHTS = ESharedInputType.MULTI_DESTINATION_ORIGINS_FLIGHTS;
  readonly DESTINATIONS_FLIGHTS = ESharedInputType.DESTINATIONS_FLIGHTS;
  readonly PICKER_DATES = ESharedInputType.PICKER_DATES;
  readonly PASSANGERS_FLIGHTS = ESharedInputType.PASSANGERS_FLIGHTS;
  readonly DROPDOWN_LEFT = EDropdownPosition.BOTTOM_LEFT;
  readonly DROPDOWN_CENTER = EDropdownPosition.BOTTOM_CENTER;
  readonly SMALL_WIDTH = InputSizeHelper.getWidth(EInputSize.SMALL);
    readonly MEDIUM_WIDTH = InputSizeHelper.getWidth(EInputSize.MEDIUM);
 readonly LARGE_WIDTH = InputSizeHelper.getWidth(EInputSize.LARGE);
 readonly HUGE_WIDTH = InputSizeHelper.getWidth(EInputSize.HUGE);
  // מערך שורות טיסה
  segments: FlightSegment[] = [
    { id: 1, origin: null, destination: null, date: { start: null, end: null } },
    { id: 2, origin: null, destination: null, date: { start: null, end: null } }
  ];
  private nextId = 3;

  // נוסעים - משותף לכל השורות
  selectedPassengers: PassangersInput | null = null;
  
  // תאריך מינימום cached (נוצר פעם אחת)
  private readonly todayMinDate: Date;

  constructor() {
    this.todayMinDate = new Date();
    this.todayMinDate.setHours(0, 0, 0, 0);
  }

  // טיפול בבחירת מוצא
  onOriginPicked(segmentIndex: number, value: MenuOption) {
    this.segments[segmentIndex].origin = value;
    this.emitInput(ESharedInputType.ORIGINS_FLIGHTS, value);
    
    // אם עדיין לא נבחר יעד באותה שורה - פתח את dropdown של היעד
    if (!this.segments[segmentIndex].destination) {
      this.openDestinationInput(segmentIndex);
    }
  }

  // טיפול בבחירת יעד
  onDestinationPicked(segmentIndex: number, value: MenuOption) {
    this.segments[segmentIndex].destination = value;
    
    // העתקה אוטומטית - יעד בשורה הנוכחית = מוצא בשורה הבאה
    if (segmentIndex < this.segments.length - 1) {
      this.segments[segmentIndex + 1].origin = value;
    }
    
    this.emitInput(ESharedInputType.DESTINATIONS_FLIGHTS, value);
    
    // אם עדיין לא נבחר תאריך באותה שורה - פתח את התאריכון
    if (!this.segments[segmentIndex].date.start) {
      this.openDateInput(segmentIndex);
    }
  }

  // טיפול בבחירת תאריך
  onDatePicked(segmentIndex: number, value: { start?: Date | null; end?: Date | null } | null) {
    this.segments[segmentIndex].date = {
      start: value?.start ?? null,
      end: null // תמיד null כי אנחנו בודדים
    };
    
    // עדכון אוטומטי של התאריך בשורה הבאה (יום אחרי)
    if (segmentIndex < this.segments.length - 1 && value?.start) {
      const nextDate = new Date(value.start);
      nextDate.setDate(nextDate.getDate() + 1);
      this.segments[segmentIndex + 1].date = {
        start: nextDate,
        end: null
      };
    }
    
    this.emitInput(ESharedInputType.PICKER_DATES, value);
  }

  // טיפול בבחירת נוסעים
  onPassengersPicked(value: PassangersInput) {
    this.selectedPassengers = value;
    this.emitInput(ESharedInputType.PASSANGERS_FLIGHTS, value);
  }

  private emitInput(type: ESharedInputType, value: any) {
    this.inputPicked.emit({ type, value });
  }

  // הוספת שורה
  addSegment() {
    if (this.canAddSegment()) {
      const lastSegment = this.segments[this.segments.length - 1];
      
      // חישוב תאריך עבור השורה החדשה (יום אחרי התאריך הקודם)
      let newDate: Date | null = null;
      if (lastSegment.date.start) {
        newDate = new Date(lastSegment.date.start);
        newDate.setDate(newDate.getDate() + 1);
      }
      
      this.segments.push({
        id: this.nextId++,
        origin: lastSegment.destination,
        destination: null,
        date: { start: newDate, end: null }
      });
    }
  }

  // הסרת שורה
  removeSegment(index: number) {
    if (index >= 2) {
      this.segments.splice(index, 1);
    }
  }

  canRemoveSegment(index: number): boolean {
    return index >= 2;
  }

  canAddSegment(): boolean {
    return this.segments.length < 5;
  }

  // תאריך מינימום לכל שורה (מתאריך השורה הקודמת)
  getMinDateForSegment(segmentIndex: number): Date | null {
    if (segmentIndex === 0) {
      return this.todayMinDate;
    }
    return this.segments[segmentIndex - 1].date.start;
  }

  // חיפוש
  onSearch() {
    this.searchClicked.emit();
  }


  private openDestinationInput(segmentIndex: number) {
    setTimeout(() => {
      const inputs = this.optionsInputs.toArray();
      const destinationInputIndex = segmentIndex * 2 + 1;
      const destinationInput = inputs[destinationInputIndex];
      
      if (destinationInput && typeof destinationInput.open === 'function') {
        destinationInput.open();
      } else if (destinationInput) {
        destinationInput.isOpen = true;
      }
    }, 100); // דיליי קטן למניעת קונפליקטים
  }

 
  private openDateInput(segmentIndex: number) {
    setTimeout(() => {
      const inputs = this.calendarInputs.toArray();
      const dateInput = inputs[segmentIndex];
      
      if (dateInput && typeof dateInput.toggleDropdown === 'function') {
        dateInput.isOpen = true;
      }
    }, 100); // דיליי קטן למניעת קונפליקטים
  }
}
