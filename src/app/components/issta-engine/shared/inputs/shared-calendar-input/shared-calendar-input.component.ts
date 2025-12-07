import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  HostListener,
  ElementRef,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  trigger, transition, style, animate
} from '@angular/animations'; // למה: טריגרי אנימציה
import { SharedCalendarInputConfig } from '../../../../../models/shared-calendar-input.models';
import { SharedCalendarService, CalendarDay } from '../../../../../services/shared-calendar.service';
import { HolidaysService } from '../../../../../services/holidays.service';
import { InputBoxComponent } from '../input-box/input-box.component';
import { ESharedInputType } from '../../../../../enums/ESharedInputType';
import { SharedInputRegistry } from '../../../../../config/shared-input.registry';
import { SharedInputUIConfig } from '../../../../../models/shared-input-config.models';
import { SharedDropdownComponent } from '../../dropdowns/shared-dropdown/shared-dropdown.component';
import { EDropdownPosition } from '../../../../../enums/EDropdownPosition'; 
@Component({
  selector: 'app-shared-calendar-input',
  standalone: true,
  imports: [CommonModule, FormsModule, InputBoxComponent, SharedDropdownComponent  ],
  templateUrl: './shared-calendar-input.component.html',
  styleUrls: ['./shared-calendar-input.component.scss'],
})
export class SharedCalendarInputComponent implements OnInit, OnChanges {
  @Input() type!: ESharedInputType;
  @Input() width: string = '100%';
  @Input() position: EDropdownPosition = EDropdownPosition.BOTTOM_RIGHT;
  @Input() singleDateMode: boolean = false; // מצב בחירת תאריך בודד בלבד
  @Input() minDate?: Date | null; // תאריך מינימום חיצוני
  @Input() allowPickHours: boolean = false; // אם לאפשר בחירת שעות
  
  // Using setter to detect changes when isDisabled is set directly
  private _isDisabled: boolean = false;
  @Input() 
  set isDisabled(value: boolean) {
    const wasDisabled = this._isDisabled;
    this._isDisabled = value;
    
    // If changing from disabled to enabled, reload data and render
    if (wasDisabled && !value) {
      if (this.dataConfig) {
        this.reloadDataFromRegistry();
      }
    } else if (!wasDisabled && !value) {
    } else if (value) {
    }
  }
  get isDisabled(): boolean {
    return this._isDisabled;
  }
  
  uiConfig!: SharedInputUIConfig;
  dataConfig!: SharedCalendarInputConfig;

  @Input() value: { start?: Date | null; end?: Date | null } | null = null;
  @Input() loadingSuggestions: boolean = false;

  @Output() valueChange =
    new EventEmitter<{ start?: Date | null; end?: Date | null; startTime?: string; endTime?: string } | null>();

  isOpen = false;
  private preventClose = false; // דגל למניעת סגירה במהלך ניווט
  
  // שעות
  selectedStartTime: string = '10:00';
  selectedEndTime: string = '10:00';
  timeOptions: string[] = [];

  displayedMonthLeft!: Date;
  displayedMonthRight!: Date;
  isSelectingRange = false;
  leftMonthDays: CalendarDay[] = [];
  rightMonthDays: CalendarDay[] = [];
  hoveredDate: Date | null = null; // תאריך שהעכבר מרחף מעליו

  monthsNames = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ];
  hebrewWeekdays = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];

  constructor(
    private calendarSrv: SharedCalendarService,
    private holidaysService: HolidaysService,
    private el: ElementRef<HTMLElement>
  ) {}

  @ViewChild(InputBoxComponent) inputBox?: InputBoxComponent;

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

    // יצירת רשימת שעות מ-00:00 עד 23:30 בקפיצות של 30 דקות
    if (this.allowPickHours) {
      this.generateTimeOptions();
    }

    this.renderCalendars();
  }

  private generateTimeOptions(): void {
    this.timeOptions = [];
    for (let hour = 0; hour < 24; hour++) {
      const hourStr = hour.toString().padStart(2, '0');
      this.timeOptions.push(`${hourStr}:00`);
      this.timeOptions.push(`${hourStr}:30`);
    }
  }

 ngOnChanges(changes: SimpleChanges): void {
  console.log('🔄 ngOnChanges called:', changes);

  if (changes['minDate'] && !changes['minDate'].firstChange) {
    console.log('📅 minDate changed, rendering calendars');
    this.renderCalendars();
  }

  // ⭐ בדיקה האם suggestedDates התעדכן כך שה־start כבר לא נמצא שם
  if (this.value?.start && this.dataConfig?.suggestedDates) {

    const stillInSuggestions = this.dataConfig.suggestedDates.some(
      s => this.calendarSrv.isSameDate(new Date(s.date), this.value!.start!)
    );

    if (!stillInSuggestions && this.loadingSuggestions) {
      console.log('🎉 departure removed from suggestions → loadingSuggestions = false');
      this.loadingSuggestions = false;
      this.renderCalendars();
    }
  }

  if (changes['isDisabled']) {
    console.log('🔓 isDisabled changed:', {
      previousValue: changes['isDisabled'].previousValue,
      currentValue: changes['isDisabled'].currentValue,
      firstChange: changes['isDisabled'].firstChange
    });

    if (!changes['isDisabled'].firstChange) {
      const wasDisabled = changes['isDisabled'].previousValue;
      const isNowEnabled = !changes['isDisabled'].currentValue;

      console.log('🔍 Checking transition:', { wasDisabled, isNowEnabled });

      if (wasDisabled && isNowEnabled) {
        console.log('✅ Loading completed! Reloading dataConfig from registry...');

        const registryEntry = SharedInputRegistry[this.type];
        if (registryEntry) {
          console.log('📦 Old suggestedDates:', this.dataConfig?.suggestedDates?.length || 0);
          this.dataConfig = registryEntry.dataConfig;
          console.log('📦 New suggestedDates:', this.dataConfig?.suggestedDates?.length || 0, this.dataConfig.suggestedDates);
          this.renderCalendars();
          console.log('🎨 Calendars rendered!');
        }
      }
    }
  }
}


  get departureDate() { return this.value?.start ?? null; }
  get returnDate() { return this.value?.end ?? null; }

  toggleDropdown() { 
    
    this.isOpen = !this.isOpen; 
  
  }

  private reloadDataFromRegistry(): void {
    const registryEntry = SharedInputRegistry[this.type];
    if (registryEntry) {
      this.dataConfig = registryEntry.dataConfig;
      // Prefer the earliest suggested date (if any) to decide which month to show
      const suggestions: any[] = this.dataConfig?.suggestedDates || [];
      let startMonth: Date | null = null;
      if (Array.isArray(suggestions) && suggestions.length > 0) {
        // Find earliest date
        const earliest = suggestions
          .map(s => new Date(s.date))
          .sort((a, b) => a.getTime() - b.getTime())[0];
        startMonth = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
      } else if (this.dataConfig && this.dataConfig.minDate) {
        startMonth = new Date(this.dataConfig.minDate.getFullYear(), this.dataConfig.minDate.getMonth(), 1);
      }
      if (startMonth) {
        this.displayedMonthLeft = startMonth;
        this.displayedMonthRight = new Date(startMonth.getFullYear(), startMonth.getMonth() + 1, 1);
      }
      this.renderCalendars();
    }
  }

  @HostListener('document:mousedown', ['$event'])
  onOutsideClick(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target as Node)) {
      this.isOpen = false;
    }
  }

  renderCalendars() {
    if (!this.dataConfig) {
      console.error('❌ dataConfig is undefined!');
      return;
    }
    // שימוש ב-minDate חיצוני אם קיים, אחרת מה-dataConfig
    const effectiveMinDate = this.minDate ?? this.dataConfig.minDate;
    
    this.leftMonthDays = this.calendarSrv.generateMonthDays(
      this.displayedMonthLeft.getFullYear(),
      this.displayedMonthLeft.getMonth(),
      this.dataConfig.suggestedDates,
      effectiveMinDate,
      this.dataConfig.maxDate,
      this.dataConfig.forcePickOnlySuggested,
      this.value?.start
    );

    this.rightMonthDays = this.calendarSrv.generateMonthDays(
      this.displayedMonthRight.getFullYear(),
      this.displayedMonthRight.getMonth(),
      this.dataConfig.suggestedDates,
      effectiveMinDate,
      this.dataConfig.maxDate,
      this.dataConfig.forcePickOnlySuggested,
      this.value?.start
    );
    // Temporary: count how many suggestions match each displayed month
    try {


      try {
        const hasSuggestions = Array.isArray(this.dataConfig?.suggestedDates) && this.dataConfig.suggestedDates.length > 0;
        if (hasSuggestions && this.value?.start) {
          
          this.isOpen = true;
        }
      } catch (e) {
        // ignore
      }
    } catch (e) {
      // ignore
    }
  }

  get leftMonthName() { return this.monthsNames[this.displayedMonthLeft.getMonth()]; }
  get leftYear() { return this.displayedMonthLeft.getFullYear(); }
  get rightMonthName() { return this.monthsNames[this.displayedMonthRight.getMonth()]; }
  get rightYear() { return this.displayedMonthRight.getFullYear(); }

  onInputOpened() { this.isOpen = true; }

  onInputClosed() {
    console.log('[CALENDAR-NAV] onInputClosed called, loadingSuggestions:', this.loadingSuggestions, 'preventClose:', this.preventClose);
    
    // אם preventClose מופעל - התעלם מבקשת הסגירה
    if (this.preventClose) {
      console.log('[CALENDAR-NAV] Prevented close due to preventClose flag');
      this.preventClose = false; // איפוס הדגל
      return;
    }
    
    setTimeout(() => { // למה: מונע סגירה לפני קליק פנימי
      // אם אנחנו בטעינת הצעות חזור - אל נסגור את הקלנדר
      if (this.loadingSuggestions) {
        console.log('[CALENDAR-NAV] Not closing - still loading suggestions');
        return;
      }
      if (!this.value?.start || this.value?.end) {
        console.log('[CALENDAR-NAV] Closing dropdown');
        this.isOpen = false;
      } else {
        console.log('[CALENDAR-NAV] Not closing - waiting for return date');
      }
    }, 0);
  }

 selectDate(day: CalendarDay) {
  if (day.disabled || day.other) return;

  const date = day.date;

  // single date mode
  if (this.singleDateMode) {
    this.value = { start: date, end: null };
    this.emitValue();
    
    this.isOpen = false;
    return;
  }

if (!this.value?.start) {

  this.value = { start: date, end: null };
  this.emitValue();

  // ⭐ בדיקה אם התאריך שנבחר נמצא ב-suggestedDates
  const isDepartureInSuggestions = this.dataConfig?.suggestedDates?.some(
    s => this.calendarSrv.isSameDate(new Date(s.date), date)
  );

  if (isDepartureInSuggestions) {
    console.log('⏳ departure selected is in suggestions → loadingSuggestions = true');
    this.loadingSuggestions = true;
  }

  try { this.inputBox?.open(); } catch (e) {}
  return;
}


// בחירת תאריך שני (חזור)
if (!this.value.end) {

  // ❗ למנוע תאריך חזור זהה לתאריך הלוך
  if (date.getTime() === this.value.start!.getTime()) {
    return; // מתעלם
  }

  // אם חזור קטן מהלוך – הפוך את הסדר
  if (date < this.value.start) {
    this.value = { start: date, end: null };
  } else {
    this.value = { start: this.value.start, end: date };

    if (!this.loadingSuggestions) {
      this.isOpen = false;
    } else {
      try { this.inputBox?.open(); } catch (e) {}
    }
  }

  this.emitValue();
  return;
}


  // אם היה טווח שנבחר כבר → התחל מחדש
  this.value = { start: date, end: null };
  this.emitValue();
}

  private emitValue(): void {
    if (this.allowPickHours) {
      this.valueChange.emit({
        ...this.value,
        startTime: this.selectedStartTime,
        endTime: this.selectedEndTime
      });
    } else {
      this.valueChange.emit(this.value);
    }
  }

  onStartTimeChange(time: string): void {
    this.selectedStartTime = time;
    this.emitValue();
  }

  onEndTimeChange(time: string): void {
    this.selectedEndTime = time;
    this.emitValue();
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

  isInHoverRange(date: Date): boolean {
    // רק אם יש תאריך התחלה אבל אין תאריך סיום, ויש hover
    if (!this.value?.start || this.value?.end || !this.hoveredDate) {
      return false;
    }
    
    // בדוק אם התאריך נמצא בין start ל-hovered
    return this.calendarSrv.isInRange(
      date, this.value.start, this.hoveredDate
    );
  }

  onDateHover(date: Date | null) {
    // רק אם יש start אבל אין end
    if (this.value?.start && !this.value?.end) {
      this.hoveredDate = date;
    }
  }

  get valueAsString(): string {
    // If disabled, show loading text
    if (this.isDisabled) {
      return 'טוען תאריכים...';
    }
    
    const s = this.value?.start ?? null;
    const e = this.value?.end ?? null;
    
    // במצב single date - רק תאריך אחד
    if (this.singleDateMode && s) {
      return this.formatDate(s);
    }
    
    // מצב רגיל - טווח תאריכים
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
    console.log('[CALENDAR-NAV] nextMonth called, isOpen before:', this.isOpen);
    this.preventClose = true; // מונע סגירה אוטומטית
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
    console.log('[CALENDAR-NAV] nextMonth completed, isOpen after:', this.isOpen);
  }

  prevMonth() {
    console.log('[CALENDAR-NAV] prevMonth called, isOpen before:', this.isOpen);
    this.preventClose = true; // מונע סגירה אוטומטית
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
    console.log('[CALENDAR-NAV] prevMonth completed, isOpen after:', this.isOpen);
  }

  getSimplifiedHoliday(holidayName: string): string {
    return this.holidaysService.getSimplifiedName(holidayName);
  }
}