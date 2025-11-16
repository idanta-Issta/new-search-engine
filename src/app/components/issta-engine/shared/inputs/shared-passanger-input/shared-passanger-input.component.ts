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
  @Output() valueChange = new EventEmitter<PassangersInput>();

  config!: SharedInputUIConfig;
  value!: PassangersInput;
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

    this.passengersSrv.getPassengersByType(this.type).subscribe({
      next: (data) => {
        this.value = data;
        this.updateTotal();
      },
      error: (err) => console.error('Error fetching passengers data:', err)
    });
  }

  updateTotal() {
    this.totalPassengers = this.value.optionsAge
      .flatMap((g) => g.options)
      .reduce((sum, age) => sum + (age.minCount || 0), 0);
  }

  increment(age: AgeGroup) {
    if (age.minCount < age.maxCount) {
      age.minCount++;
      this.emitChange();
    }
  }

  decrement(age: AgeGroup) {
    if (age.minCount > 0) {
      age.minCount--;
      this.emitChange();
    }
  }

  emitChange() {
    this.updateTotal();
    this.valueChange.emit(this.value);
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  @HostListener('document:mousedown', ['$event'])
  onOutsideClick(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target as Node)) {
      this.isOpen = false;
    }
  }
}
