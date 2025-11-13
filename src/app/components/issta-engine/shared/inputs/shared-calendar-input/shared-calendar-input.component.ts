import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  HostListener,
  ElementRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { SharedCalendarInputConfig } from '../../../../../models/shared-calendar-input.models';
import { SharedCalendarService, CalendarDay } from '../../../../../services/shared-calendar.service';

@Component({
  selector: 'app-shared-calendar-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shared-calendar-input.component.html',
  styleUrls: ['./shared-calendar-input.component.scss']
})
export class SharedCalendarInputComponent implements OnInit {

  @Input() config!: SharedCalendarInputConfig;

  @Input() value?: { start?: Date; end?: Date };
  @Output() valueChange = new EventEmitter<{ start?: Date; end?: Date }>();

  isOpen = false;

  displayedMonthLeft!: Date;
  displayedMonthRight!: Date;

  leftMonthDays: CalendarDay[] = [];
  rightMonthDays: CalendarDay[] = [];

  monthsNames = [
    "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
    "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"
  ];

  hebrewWeekdays = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];

  constructor(
    private calendarSrv: SharedCalendarService,
    private el: ElementRef
  ) {}

  ngOnInit() {
    this.displayedMonthLeft = new Date();
    this.displayedMonthLeft.setDate(1);

    this.displayedMonthRight = new Date(
      this.displayedMonthLeft.getFullYear(),
      this.displayedMonthLeft.getMonth() + 1,
      1
    );

    this.renderCalendars();
  }

  get departureDate() { return this.value?.start ?? null; }
  get returnDate() { return this.value?.end ?? null; }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  @HostListener('document:mousedown', ['$event'])
  onOutsideClick(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  renderCalendars() {
    this.leftMonthDays = this.calendarSrv.generateMonthDays(
      this.displayedMonthLeft.getFullYear(),
      this.displayedMonthLeft.getMonth(),
      this.config.suggestedDates
    );

    this.rightMonthDays = this.calendarSrv.generateMonthDays(
      this.displayedMonthRight.getFullYear(),
      this.displayedMonthRight.getMonth(),
      this.config.suggestedDates
    );
  }

  /* --- MONTH NAME GETTERS --- */
get leftMonthName() {
  return this.monthsNames[this.displayedMonthLeft.getMonth()];
}

get leftYear() {
  return this.displayedMonthLeft.getFullYear();
}

get rightMonthName() {
  return this.monthsNames[this.displayedMonthRight.getMonth()];
}

get rightYear() {
  return this.displayedMonthRight.getFullYear();
}


  selectDate(date: Date) {
    if (!this.value?.start) {
      this.value = { start: date };
    } else if (!this.value.end) {
      if (date < this.value.start) {
        this.value = { start: date };
      } else {
        this.value.end = date;
      }
    } else {
      this.value = { start: date, end: undefined };
    }
    this.valueChange.emit(this.value);
  }

  isSelected(date: Date): boolean {
    return this.calendarSrv.isSameDate(this.value?.start, date) ||
           this.calendarSrv.isSameDate(this.value?.end, date);
  }

  isInRange(date: Date): boolean {
    return this.calendarSrv.isInRange(date, this.value?.start, this.value?.end);
  }

  nextMonth() {
    this.displayedMonthLeft = new Date(
      this.displayedMonthLeft.getFullYear(),
      this.displayedMonthLeft.getMonth() + 1,
      1
    );
    this.displayedMonthRight = new Date(
      this.displayedMonthLeft.getFullYear(),
      this.displayedMonthLeft.getMonth() + 1,
      1
    );
    this.renderCalendars();
  }

  prevMonth() {
    this.displayedMonthLeft = new Date(
      this.displayedMonthLeft.getFullYear(),
      this.displayedMonthLeft.getMonth() - 1,
      1
    );
    this.displayedMonthRight = new Date(
      this.displayedMonthLeft.getFullYear(),
      this.displayedMonthLeft.getMonth() + 1,
      1
    );
    this.renderCalendars();
  }
}
