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
import {
  trigger, transition, style, animate
} from '@angular/animations'; // למה: טריגרי אנימציה
import { SharedCalendarInputConfig } from '../../../../../models/shared-calendar-input.models';
import { SharedCalendarService, CalendarDay } from '../../../../../services/shared-calendar.service';
import { InputBoxComponent } from '../input-box/input-box.component';
import { ESharedInputType } from '../../../../../enums/ESharedInputType';
import { SharedInputRegistry } from '../../../../../config/shared-input.registry';
import { SharedInputUIConfig } from '../../../../../models/shared-input-config.models';
import { SharedDropdownComponent } from '../../dropdowns/shared-dropdown/shared-dropdown.component';
import { EDropdownPosition } from '../../../../../enums/EDropdownPosition'; 
@Component({
  selector: 'app-shared-calendar-input',
  standalone: true,
  imports: [CommonModule, InputBoxComponent, SharedDropdownComponent  ],
  templateUrl: './shared-calendar-input.component.html',
  styleUrls: ['./shared-calendar-input.component.scss'],
})
export class SharedCalendarInputComponent implements OnInit {
  @Input() type!: ESharedInputType;
  @Input() width: string = '100%';
  @Input() position: EDropdownPosition = EDropdownPosition.BOTTOM_RIGHT;

  uiConfig!: SharedInputUIConfig;
  dataConfig!: SharedCalendarInputConfig;

  @Input() value: { start?: Date | null; end?: Date | null } | null = null;

  @Output() valueChange =
    new EventEmitter<{ start?: Date | null; end?: Date | null } | null>();

  isOpen = false;

  displayedMonthLeft!: Date;
  displayedMonthRight!: Date;
  isSelectingRange = false;
  leftMonthDays: CalendarDay[] = [];
  rightMonthDays: CalendarDay[] = [];

  monthsNames = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ];
  hebrewWeekdays = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];

  constructor(
    private calendarSrv: SharedCalendarService,
    private el: ElementRef<HTMLElement>
  ) {}

  ngOnInit() {
    const registryEntry = SharedInputRegistry[this.type];
    if (!registryEntry) {
      console.error('SharedCalendarInput: invalid type', this.type);
      return;
    }

    this.uiConfig = registryEntry.uiConfig;
    this.dataConfig = registryEntry.dataConfig;

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

  toggleDropdown() { this.isOpen = !this.isOpen; }

  @HostListener('document:mousedown', ['$event'])
  onOutsideClick(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target as Node)) {
      this.isOpen = false;
    }
  }

  renderCalendars() {
    this.leftMonthDays = this.calendarSrv.generateMonthDays(
      this.displayedMonthLeft.getFullYear(),
      this.displayedMonthLeft.getMonth(),
      this.dataConfig.suggestedDates,
      this.dataConfig.minDate,
      this.dataConfig.maxDate
    );

    this.rightMonthDays = this.calendarSrv.generateMonthDays(
      this.displayedMonthRight.getFullYear(),
      this.displayedMonthRight.getMonth(),
      this.dataConfig.suggestedDates,
      this.dataConfig.minDate,
      this.dataConfig.maxDate
    );
  }

  get leftMonthName() { return this.monthsNames[this.displayedMonthLeft.getMonth()]; }
  get leftYear() { return this.displayedMonthLeft.getFullYear(); }
  get rightMonthName() { return this.monthsNames[this.displayedMonthRight.getMonth()]; }
  get rightYear() { return this.displayedMonthRight.getFullYear(); }

  onInputOpened() { this.isOpen = true; }

  onInputClosed() {
    setTimeout(() => { // למה: מונע סגירה לפני קליק פנימי
      if (!this.value?.start || this.value?.end) {
        this.isOpen = false;
      }
    }, 0);
  }

  selectDate(day: CalendarDay) {
    // מניעת בחירת תאריכים disabled
    if (day.disabled || day.other) return;

    const date = day.date;

    if (!this.value || !this.value.start) {
      this.value = { start: date, end: undefined };
    } else if (!this.value.end) {
      if (date < this.value.start) {
        this.value = { start: date, end: undefined };
      } else {
        this.value = { start: this.value.start, end: date };
        this.isOpen = false;
      }
    } else {
      this.value = { start: date, end: undefined };
    }
    this.valueChange.emit(this.value);
  }

  formatFullHebrewDate(d: Date | null): string {
    if (!d) return '';
    return new Intl.DateTimeFormat('he-IL', {
      day: 'numeric', month: 'long', year: 'numeric'
    }).format(d);
  }

  isSelected(date: Date): boolean {
    return this.calendarSrv.isSameDate(this.value?.start ?? undefined, date) ||
           this.calendarSrv.isSameDate(this.value?.end ?? undefined, date);
  }

  isInRange(date: Date): boolean {
    return this.calendarSrv.isInRange(
      date, this.value?.start ?? undefined, this.value?.end ?? undefined
    );
  }

  get valueAsString(): string {
    const s = this.value?.start ?? null;
    const e = this.value?.end ?? null;
    if (s && e) return `${this.formatDate(s)} - ${this.formatDate(e)}`;
    if (s) return this.formatDate(s);
    return '';
  }

  private formatDate(d: Date): string {
    return new Intl.DateTimeFormat('he-IL', {
      day: '2-digit', month: '2-digit', year: '2-digit'
    }).format(d);
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