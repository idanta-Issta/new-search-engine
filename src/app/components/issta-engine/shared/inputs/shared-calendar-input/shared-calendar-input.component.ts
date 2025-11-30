import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
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
export class SharedCalendarInputComponent implements OnInit, OnChanges {
  @Input() type!: ESharedInputType;
  @Input() width: string = '100%';
  @Input() position: EDropdownPosition = EDropdownPosition.BOTTOM_RIGHT;
  @Input() singleDateMode: boolean = false; // מצב בחירת תאריך בודד בלבד
  @Input() minDate?: Date | null; // תאריך מינימום חיצוני
  
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

  ngOnChanges(changes: SimpleChanges): void {
    console.log('🔄 ngOnChanges called:', changes);
    
    // כאשר minDate משתנה - צריך לרנדר מחדש את הלוחות
    if (changes['minDate'] && !changes['minDate'].firstChange) {
      console.log('📅 minDate changed, rendering calendars');
      this.renderCalendars();
    }
    
    // כאשר isDisabled משתנה מ-true ל-false - הטעינה הסתיימה
    // צריך לטעון מחדש את dataConfig מה-registry ולרנדר מחדש
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
          // טען מחדש את dataConfig מה-registry (כולל suggestedDates המעודכנים)
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

  toggleDropdown() { this.isOpen = !this.isOpen; }

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
      this.dataConfig.maxDate
    );

    this.rightMonthDays = this.calendarSrv.generateMonthDays(
      this.displayedMonthRight.getFullYear(),
      this.displayedMonthRight.getMonth(),
      this.dataConfig.suggestedDates,
      effectiveMinDate,
      this.dataConfig.maxDate
    );
    // Temporary: count how many suggestions match each displayed month
    try {
      const leftMonthCount = this.leftMonthDays.filter(d => !!d.suggested && !d.other).length;
      const rightMonthCount = this.rightMonthDays.filter(d => !!d.suggested && !d.other).length;
      console.log('renderCalendars: matches left/right', leftMonthCount, rightMonthCount);
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

    // במצב single date - רק תאריך התחלה
    if (this.singleDateMode) {
      this.value = { start: date, end: null };
      this.valueChange.emit(this.value);
      this.isOpen = false; // סגירה מיידית
      return;
    }

    // מצב רגיל - טווח תאריכים
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