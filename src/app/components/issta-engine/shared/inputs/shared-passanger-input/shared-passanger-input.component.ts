import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ElementRef,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ESharedInputType } from '../../../../../enums/ESharedInputType';
import { SharedInputRegistry } from '../../../../../config/shared-input.registry';
import { SharedInputUIConfig } from '../../../../../models/shared-input-config.models';
import { InputBoxComponent } from '../input-box/input-box.component';
import { PassangersInput, OptionAge, AgeGroup } from '../../../../../models/shared-passanger-input.models';
import { SharedPassengersService } from '../../../../../services/shared-passengers.service';
import { SharedDropdownComponent } from '../../dropdowns/shared-dropdown/shared-dropdown.component';

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
  @Output() valueChange = new EventEmitter<PassangersInput>();

  config!: SharedInputUIConfig;
  isOpen = false;
  totalPassengers = 0;

  constructor(
    private el: ElementRef,
    private passengersSrv: SharedPassengersService
  ) {}

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
          this.value = data;
        }
        this.updateTotal();
      },
      error: (err) => console.error('Error fetching passengers data:', err)
    });
  }

  updateTotal() {
    if (!this.value?.optionsAge) {
      this.totalPassengers = 0;
      return;
    }
    this.totalPassengers = this.value.optionsAge
      .flatMap((g) => g.options)
      .reduce((sum, age) => sum + (age.minCount || 0), 0);
  }

  increment(age: AgeGroup) {
    if (age.minCount < age.maxCount) {
      age.minCount++;
      // אם דורש גיל ספציפי, אתחל את המערך אם צריך
      if (age.requiresSpecificAge && age.selectedAges) {
        age.selectedAges.push(age.specificAgeOptions?.[0] || 0);
      }
      this.emitChange();
    }
  }

  decrement(age: AgeGroup) {
    if (age.minCount > 0) {
      age.minCount--;
      // אם דורש גיל ספציפי, הסר את האחרון
      if (age.requiresSpecificAge && age.selectedAges) {
        age.selectedAges.pop();
      }
      this.emitChange();
    }
  }

  onSpecificAgeChange(age: AgeGroup, index: number, selectedAge: number) {
    if (age.selectedAges) {
      age.selectedAges[index] = selectedAge;
      this.emitChange();
    }
  }

  getAgeArray(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i);
  }

  emitChange() {
    this.updateTotal();
    this.valueChange.emit(this.value);
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

  @HostListener('document:mousedown', ['$event'])
  onOutsideClick(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target as Node)) {
      this.isOpen = false;
    }
  }
}
