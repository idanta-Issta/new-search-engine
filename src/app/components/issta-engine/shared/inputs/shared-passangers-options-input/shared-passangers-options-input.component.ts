import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ElementRef,
  HostListener,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ESharedInputType } from '../../../../../enums/ESharedInputType';
import { SharedInputRegistry } from '../../../../../config/shared-input.registry';
import { SharedInputUIConfig } from '../../../../../models/shared-input-config.models';
import { InputBoxComponent } from '../input-box/input-box.component';
import { SharedDropdownComponent } from '../../dropdowns/shared-dropdown/shared-dropdown.component';
import { EDropdownPosition } from '../../../../../enums/EDropdownPosition';
import { PassengersOption, PassengersOptionsInput } from '../../../../../models/shared-passangers-options-input.models';

interface RoomComposition {
  selectedOptionKey: string;
}

@Component({
  selector: 'app-shared-passangers-options-input',
  standalone: true,
  imports: [CommonModule, FormsModule, InputBoxComponent, SharedDropdownComponent],
  templateUrl: './shared-passangers-options-input.component.html',
  styleUrls: ['./shared-passangers-options-input.component.scss']
})
export class SharedPassangersOptionsInputComponent implements OnInit {
  @Input() type!: ESharedInputType;
  @Input() value?: PassengersOptionsInput;
  @Input() width: string = '100%';
  @Input() position: EDropdownPosition = EDropdownPosition.BOTTOM_RIGHT;
  @Output() valueChange = new EventEmitter<PassengersOptionsInput>();

  config!: SharedInputUIConfig;
  isOpen = false;
  rooms: RoomComposition[] = [];
  activeDropdown: string | null = null;
  dropdownPosition = { top: 0, left: 0, width: 0 };

  passengerOptions: PassengersOption[] = [
    { label: 'מבוגר', key: '1-0', adults: 1, children: 0 },
    { label: '2 מבוגרים', key: '2-0', adults: 2, children: 0 },
    { label: '2 מבוגרים + ילד (גילאי 2-11)', key: '2-1', adults: 2, children: 1, childAges: [2] },
    { label: '2 מבוגרים + 2 ילדים (גילאי 2-11)', key: '2-2', adults: 2, children: 2, childAges: [2, 2] },
    { label: '2 מבוגרים + 3 ילדים (גילאי 2-11)', key: '2-3', adults: 2, children: 3, childAges: [2, 2, 2] },
    { label: '2 מבוגרים + 4 ילדים (גילאי 2-11)', key: '2-4', adults: 2, children: 4, childAges: [2, 2, 2, 2] },
    { label: '3 מבוגרים', key: '3-0', adults: 3, children: 0 },
    { label: '3 מבוגרים + ילד (גילאי 2-11)', key: '3-1', adults: 3, children: 1, childAges: [2] },
    { label: '3 מבוגרים + 2 ילדים (גילאי 2-11)', key: '3-2', adults: 3, children: 2, childAges: [2, 2] },
    { label: '3 מבוגרים + 3 ילדים (גילאי 2-11)', key: '3-3', adults: 3, children: 3, childAges: [2, 2, 2] },
    { label: '4 מבוגרים', key: '4-0', adults: 4, children: 0 },
    { label: '5 מבוגרים', key: '5-0', adults: 5, children: 0 },
    { label: '6 מבוגרים', key: '6-0', adults: 6, children: 0 }
  ];

  constructor(
    private el: ElementRef,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const registryEntry = SharedInputRegistry[this.type];
    if (!registryEntry) {
      console.error('SharedPassangersOptionsInput: invalid type', this.type);
      return;
    }

    this.config = registryEntry.uiConfig;

    // Initialize with default if no value
    if (!this.value) {
      this.value = {
        maxRoomsPick: 3
      };
    }

    // Initialize rooms - start with 1 room with default "2 מבוגרים"
    if (!this.rooms || this.rooms.length === 0) {
      this.rooms = [{ selectedOptionKey: '2-0' }];
    }

    this.emitChange();
  }

  onRoomCompositionChange(roomIndex: number) {
    this.emitChange();
    this.cdr.markForCheck();
  }

  toggleRoomDropdown(roomIndex: number) {
    const dropdownId = 'room-' + roomIndex;
    
    if (this.activeDropdown === dropdownId) {
      this.activeDropdown = null;
    } else {
      this.activeDropdown = dropdownId;
      
      // Calculate position after a tick to ensure DOM is ready
      setTimeout(() => {
        const selectElement = document.querySelectorAll('.custom-select')[roomIndex] as HTMLElement;
        if (selectElement) {
          const rect = selectElement.getBoundingClientRect();
          this.dropdownPosition = {
            top: rect.bottom + window.scrollY - 115,
            left: rect.left  - 140,
            width: rect.width
          };
          this.cdr.markForCheck();
        }
      });
    }
    this.cdr.markForCheck();
  }

  selectRoomOption(roomIndex: number, optionKey: string) {
    this.rooms[roomIndex].selectedOptionKey = optionKey;
    this.activeDropdown = null;
    this.emitChange();
    this.cdr.markForCheck();
  }

  selectActiveRoomOption(optionKey: string) {
    if (!this.activeDropdown) return;
    const roomIndex = parseInt(this.activeDropdown.replace('room-', ''));
    this.selectRoomOption(roomIndex, optionKey);
  }

  getSelectedRoomKey(): string {
    if (!this.activeDropdown) return '';
    const roomIndex = parseInt(this.activeDropdown.replace('room-', ''));
    return this.rooms[roomIndex]?.selectedOptionKey || '';
  }

  getDropdownPosition(element: HTMLElement): { top: number; left: number; width: number } {
    if (!element) return { top: 0, left: 0, width: 200 };
    const rect = element.getBoundingClientRect();
    return {
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
      width: rect.width
    };
  }

  getRoomOptionLabel(optionKey: string): string {
    const option = this.passengerOptions.find(opt => opt.key === optionKey);
    return option ? option.label : 'בחר הרכב';
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  addRoom() {
    if (!this.canAddRoom()) return;
    
    // Add new room with default "2 מבוגרים"
    this.rooms.push({ selectedOptionKey: '2-0' });
    this.emitChange();
    this.cdr.markForCheck();
  }

  removeRoom(index: number) {
    if (index === 0) return; // Cannot remove first room
    
    this.rooms.splice(index, 1);
    this.emitChange();
    this.cdr.markForCheck();
  }

  canAddRoom(): boolean {
    const maxRooms = this.value?.maxRoomsPick || 3;
    return this.rooms.length < maxRooms;
  }

  canRemoveRoom(): boolean {
    return this.rooms.length > 1;
  }

  getDisplayText(): string {
    let totalAdults = 0;
    let totalChildren = 0;

    this.rooms.forEach(room => {
      const option = this.passengerOptions.find(opt => opt.key === room.selectedOptionKey);
      if (option) {
        totalAdults += option.adults;
        totalChildren += option.children;
      }
    });

    const parts: string[] = [];
    if (totalAdults > 0) {
      parts.push(`מבוגרים ${totalAdults}`);
    }
    if (totalChildren > 0) {
      parts.push(`ילדים ${totalChildren}`);
    }

    return parts.join(' + ') || 'בחר הרכב נוסעים';
  }

  emitChange() {
    if (!this.value) return;

    // Build the value with all room compositions
    const roomsData = this.rooms.map(room => {
      const option = this.passengerOptions.find(opt => opt.key === room.selectedOptionKey);
      return option || this.passengerOptions[1]; // Default to "2 מבוגרים"
    });

    this.value.selectedOption = roomsData[0]; // Keep for backward compatibility
    (this.value as any).rooms = roomsData; // Add rooms array

    this.valueChange.emit(this.value);
  }

  @HostListener('document:mousedown', ['$event'])
  onOutsideClick(event: MouseEvent) {
    if (!this.isOpen) return;
    const target = event.target as Node;
    const hostContains = this.el.nativeElement.contains(target);
    const dropdownEl = document.querySelector('.passengers-options-dropdown');
    const insideDropdown = dropdownEl ? dropdownEl.contains(target) : false;
    if (!hostContains && !insideDropdown) {
      this.isOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-select') && !target.closest('.options-list-portal')) {
      this.activeDropdown = null;
      this.cdr.markForCheck();
    }
  }
}
