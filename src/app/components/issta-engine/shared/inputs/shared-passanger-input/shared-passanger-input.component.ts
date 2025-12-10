import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ElementRef,
  HostListener,
  ChangeDetectorRef,
  ComponentRef,
  ApplicationRef,
  Injector,
  EnvironmentInjector
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ESharedInputType } from '../../../../../enums/ESharedInputType';
import { SharedInputRegistry } from '../../../../../config/shared-input.registry';
import { SharedInputUIConfig } from '../../../../../models/shared-input-config.models';
import { InputBoxComponent } from '../input-box/input-box.component';
import { PassangersInput, OptionAge, AgeGroup, RoomPassengers } from '../../../../../models/shared-passanger-input.models';
import { SharedPassengersService } from '../../../../../services/shared-passengers.service';
import { SharedDropdownComponent } from '../../dropdowns/shared-dropdown/shared-dropdown.component';
import { EDropdownPosition } from '../../../../../enums/EDropdownPosition';
import { LeadFormModalService } from '../../../../../services/lead-form-modal.service';

@Component({
  selector: 'app-shared-passanger-input',
  standalone: true,
  imports: [CommonModule, FormsModule, InputBoxComponent, SharedDropdownComponent],
  templateUrl: './shared-passanger-input.component.html',
  styleUrls: ['./shared-passanger-input.component.scss']
})
export class SharedPassangerInputComponent implements OnInit {
  @Input() type!: ESharedInputType;
  @Input() value?: PassangersInput;
  @Input() width: string = '100%';
  @Input() position: EDropdownPosition = EDropdownPosition.BOTTOM_RIGHT;
  @Output() valueChange = new EventEmitter<PassangersInput>();

  config!: SharedInputUIConfig;
  isOpen = false;
  totalPassengers = 0;
  selectedRoomIndex = 0;
  activeDropdown: string | null = null;
  validationErrors: string[] = [];
  temporaryError: string | null = null;
  



  constructor(
    private el: ElementRef,
    private passengersSrv: SharedPassengersService,
    private cdr: ChangeDetectorRef,
    private appRef: ApplicationRef,
    private injector: Injector,
    private envInjector: EnvironmentInjector,
    private leadFormModal: LeadFormModalService
  ) {}

  showExtraRoomModal() {
    this.leadFormModal.open();
  }

  ngOnInit() {
    const registryEntry = SharedInputRegistry[this.type];
    if (!registryEntry) {
      console.error('SharedPassangerInput: invalid type', this.type);
      return;
    }

    this.config = registryEntry.uiConfig;
    this.loadPassengersData();
  }

  private loadPassengersData() {
    this.passengersSrv.getPassengersByType(this.type).subscribe({
      next: (data) => {
        if (!this.value) {

          data.optionsAge.forEach(group => {
            group.options.forEach(option => {
              option.count = option.defaultValue ?? option.minCount;
  
              if (option.requiresSpecificAge && option.count && option.count > 0) {
                option.selectedAges = Array(option.count).fill(0).map(() => {
                  const firstOption = option.specificAgeOptions?.[0];
                  return firstOption ? parseInt(firstOption.key) : 0;
                });
              }
            });
          });
          this.value = data;
        }
        this.updateTotal();
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error fetching passengers data:', err)
    });
  }

  updateTotal() {
    if (!this.value) {
      this.totalPassengers = 0;
      return;
    }

    // If using rooms (domestic vacation), count from rooms
    if (this.value.allowPickRoom && this.value.rooms) {
      this.totalPassengers = this.value.rooms.reduce((sum, room) => 
        sum + room.adults + room.children + room.infants, 0);
    } else {
      // Otherwise count from optionsAge (flights, hotels)
      this.totalPassengers = this.value.optionsAge
        .flatMap((g) => g.options)
        .reduce((sum, age) => sum + (age.count || 0), 0);
    }
  }

  isMaxTotalReached(): boolean {
    if (!this.value?.maxTotalPassengers) {
      return false;
    }
    return this.totalPassengers >= this.value.maxTotalPassengers;
  }

  canIncrement(age: AgeGroup): boolean {
    console.log('canIncrement called for:', age.value, 'current count:', age.count);
    const currentCount = age.count || 0;
    if (currentCount >= age.maxCount) {
      console.log('Max count reached:', age.maxCount);
      return false;
    }
    // בדוק אם הגענו למקסימום כללי
    if (this.isMaxTotalReached()) {
      console.log('Max total passengers reached');
      return false;
    }

    // בדוק אם הוספת נוסע נוספת תפר את חוקי הולידציה
    if (this.value && this.value.rules && this.value.rules.length > 0) {
      console.log('Checking validation rules, rules count:', this.value.rules.length);
      const countsByType = this.passengersSrv.getCountsByType(this.value);
      const countsByAge = this.passengersSrv.getCountsByAge(this.value);
      console.log('countsByType:', countsByType);
      console.log('countsByAge:', countsByAge);
      const result = this.passengersSrv.canIncrease(this.value, age.value, countsByType, countsByAge);
      console.log('canIncrease result:', result);
      return result.allowed;
    }

    console.log('No validation issues, returning true');
    return true;
  }

  showTemporaryError(message: string) {
    console.log('showTemporaryError called with message:', message);
    this.temporaryError = message;
    console.log('temporaryError set to:', this.temporaryError);
    this.cdr.markForCheck();
  }

  clearError() {
    this.temporaryError = null;
    this.cdr.markForCheck();
  }

  increment(age: AgeGroup) {
    console.log('increment called for:', age.value);
    
    // נקה שגיאה קודמת
    this.clearError();
    
    if (!this.canIncrement(age)) {
      console.log('canIncrement returned false, showing error');
      // הצג שגיאה למשתמש
      if (this.value && this.value.rules && this.value.rules.length > 0) {
        const countsByType = this.passengersSrv.getCountsByType(this.value);
        const countsByAge = this.passengersSrv.getCountsByAge(this.value);
        const result = this.passengersSrv.canIncrease(this.value, age.value, countsByType, countsByAge);
        console.log('Result from canIncrease in increment:', result);
        if (result.errorMessage) {
          this.showTemporaryError(result.errorMessage);
        }
      }
      return;
    }
    
    console.log('Incrementing passenger');
    const currentCount = age.count || 0;
    age.count = currentCount + 1;
    // אם דורש גיל ספציפי, אתחל את המערך אם צריך
    if (age.requiresSpecificAge && age.selectedAges) {
      const firstOption = age.specificAgeOptions?.[0];
      age.selectedAges.push(firstOption ? parseInt(firstOption.key) : 0);
    }
    this.emitChange();
    this.cdr.markForCheck();
  }

  decrement(age: AgeGroup) {
    console.log('decrement called for:', age.value);
    
    // נקה שגיאה קודמת
    this.clearError();
    
    const currentCount = age.count || 0;
    if (currentCount > age.minCount) {
      // בדוק אם ההורדה תגרום לשגיאת ולידציה
      if (this.value && this.value.rules && this.value.rules.length > 0) {
        console.log('Checking validation before decrement');
        const countsByType = this.passengersSrv.getCountsByType(this.value);
        const countsByAge = this.passengersSrv.getCountsByAge(this.value);
        
        // צור סימולציה של ההורדה
        const simulatedCounts = { ...countsByType };
        simulatedCounts[age.value] = (simulatedCounts[age.value] || 0) - 1;
        console.log('Simulated counts after decrement:', simulatedCounts);
        
        const errors = this.passengersSrv.validatePassengers(this.value, simulatedCounts, countsByAge);
        console.log('Validation errors:', errors);
        if (errors.length > 0) {
          this.showTemporaryError(errors[0]);
          return;
        }
      }
      
      console.log('Decrementing passenger');
      age.count = currentCount - 1;
      // אם דורש גיל ספציפי, הסר את האחרון
      if (age.requiresSpecificAge && age.selectedAges) {
        age.selectedAges.pop();
      }
      this.emitChange();
      this.cdr.markForCheck();
    } else {
      // הגענו למינימום
      this.showTemporaryError(`חייב לפחות מבוגר אחד`);
    }
  }

  onSpecificAgeChange(age: AgeGroup, index: number, selectedAge: number) {
    if (age.selectedAges) {
      age.selectedAges[index] = selectedAge;
      this.emitChange();
    }
  }

  toggleAgeDropdown(dropdownId: string) {
    this.activeDropdown = this.activeDropdown === dropdownId ? null : dropdownId;
  }

  selectAge(age: AgeGroup, index: number, selectedAge: number) {
    if (!age.selectedAges) {
      age.selectedAges = [];
    }
    age.selectedAges[index] = selectedAge;
    this.activeDropdown = null;
    this.emitChange();
    this.cdr.markForCheck();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-select')) {
      this.activeDropdown = null;
      this.cdr.markForCheck();
    }
  }

  getAgeArray(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i);
  }

  emitChange() {
    this.updateTotal();
    this.validatePassengers();
    this.valueChange.emit(this.value);
  }

  private validatePassengers() {
    if (!this.value || !this.value.rules || this.value.rules.length === 0) {
      this.validationErrors = [];
      return;
    }

    const countsByType = this.passengersSrv.getCountsByType(this.value);
    const countsByAge = this.passengersSrv.getCountsByAge(this.value);
    this.validationErrors = this.passengersSrv.validatePassengers(this.value, countsByType, countsByAge);
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  /** פתיחה מתוכנתית - נדרש ע"י shared-input-row */
  open() {
    // אם אין נתונים, טען אותם
    if (!this.value) {
      this.loadPassengersData();
    }
    this.isOpen = true;
  }

  /** סגירה מתוכנתית - נדרש ע"י shared-input-row */
  close() {
    this.isOpen = false;
  }

  // Room management methods
  addRoom() {
    if (!this.value?.rooms || !this.value.maxRoomsPick) return;
    if (this.value.rooms.length >= this.value.maxRoomsPick) return;

    const newRoom: RoomPassengers = {
      roomNumber: this.value.rooms.length + 1,
      adults: 2,
      children: 0,
      infants: 0
    };

    this.value.rooms.push(newRoom);
    this.selectedRoomIndex = this.value.rooms.length - 1;
    this.cdr.markForCheck();
    this.emitChange();
  }

  removeRoom(index: number) {
    if (!this.value?.rooms || index === 0) return; // Cannot remove first room
    
    this.value.rooms.splice(index, 1);
    // Reorder room numbers
    this.value.rooms.forEach((room, idx) => {
      room.roomNumber = idx + 1;
    });
    
    if (this.selectedRoomIndex >= this.value.rooms.length) {
      this.selectedRoomIndex = this.value.rooms.length - 1;
    }
    
    this.cdr.markForCheck();
    this.emitChange();
  }

  selectRoom(index: number) {
    this.selectedRoomIndex = index;
    this.cdr.markForCheck();
  }

  canIncrementRoom(roomIndex: number, type: 'adults' | 'children' | 'infants'): boolean {
    if (!this.value?.rooms || !this.value.rooms[roomIndex]) return false;
    
    const room = this.value.rooms[roomIndex];
    const maxValues = { adults: 6, children: 4, infants: 2 };
    
    // בדוק אם הגענו למקסימום של הסוג הזה
    if (room[type] >= maxValues[type]) {
      return false;
    }
    
    // בדוק אם הגענו למקסימום כללי (כל הנוסעים)
    if (this.isMaxTotalReached()) {
      return false;
    }
    
    // בדוק אם הגענו למקסימום בחדר הזה
    if (this.value.maxPassengersInRoom) {
      const currentRoomTotal = room.adults + room.children + room.infants;
      if (currentRoomTotal >= this.value.maxPassengersInRoom) {
        return false;
      }
    }
    
    return true;
  }

  incrementRoom(roomIndex: number, type: 'adults' | 'children' | 'infants') {
    if (!this.canIncrementRoom(roomIndex, type)) return;
    
    if (this.value?.rooms && this.value.rooms[roomIndex]) {
      this.value.rooms[roomIndex][type]++;
      this.emitChange();
      this.cdr.markForCheck();
    }
  }

  decrementRoom(roomIndex: number, type: 'adults' | 'children' | 'infants') {
    if (!this.value?.rooms || !this.value.rooms[roomIndex]) return;
    
    const room = this.value.rooms[roomIndex];
    const minValues = { adults: 1, children: 0, infants: 0 };
    
    if (room[type] > minValues[type]) {
      room[type]--;
      this.emitChange();
      this.cdr.markForCheck();
    }
  }

  canAddRoom(): boolean {
    return !!(this.value?.rooms && this.value.maxRoomsPick && 
             this.value.rooms.length < this.value.maxRoomsPick);
  }

  getDropdownMarginRight(): number {
    const roomsCount = this.value?.rooms?.length || 0;
    return this.passengersSrv.getRoomsMargin(roomsCount);
  }

  @HostListener('document:mousedown', ['$event'])
  onOutsideClick(event: MouseEvent) {
    if (!this.isOpen) return;
    const target = event.target as Node;
    // Root element of this component
    const hostContains = this.el.nativeElement.contains(target);
    // Dropdown content may be rendered elsewhere (e.g. overlay); allow clicks inside it
    const dropdownEl = document.querySelector('.passenger-dropdown');
    const insideDropdown = dropdownEl ? dropdownEl.contains(target) : false;
    if (!hostContains && !insideDropdown) {
      this.isOpen = false;
    }
  }
}
