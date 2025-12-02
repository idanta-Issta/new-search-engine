import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedOptionsInputComponent } from '../../../shared/inputs/shared-options-input/shared-options-input.component';
import { InputBoxComponent } from '../../../shared/inputs/input-box/input-box.component';
import { SharedDropdownComponent } from '../../../shared/dropdowns/shared-dropdown/shared-dropdown.component';
import { MenuOption } from '../../../../../models/shared-options-input.models';
import { ESharedInputType } from '../../../../../enums/ESharedInputType';
import { SharedInputConfig } from '../../../../../models/shared-input-config.models';
import { SharedInputRegistry } from '../../../../../config/shared-input.registry';
import { EDropdownPosition } from '../../../../../enums/EDropdownPosition';

@Component({
  selector: 'app-car-location-input',
  standalone: true,
  imports: [
    CommonModule,
    InputBoxComponent,
    SharedDropdownComponent,
    SharedOptionsInputComponent
  ],
  templateUrl: './car-location-input.component.html',
  styleUrls: ['./car-location-input.component.scss']
})
export class CarLocationInputComponent implements OnInit {
  @Input() type!: ESharedInputType;
  @Input() value: MenuOption | undefined;
  @Input() width: string = '100%';
  @Input() isDisabled: boolean = false;
  
  @Output() optionPicked = new EventEmitter<MenuOption>();
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  config!: SharedInputConfig;
  isOpen = false;
  displayValue = '';
  position = EDropdownPosition.BOTTOM_LEFT;
  centerPosition = EDropdownPosition.BOTTOM_LEFT;
  
  pickupCity: MenuOption | undefined;
  returnCity: MenuOption | undefined;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const registryEntry = SharedInputRegistry[this.type];
    if (registryEntry) {
      this.config = registryEntry;
    }

    // Set display value from input value
    if (this.value) {
      this.displayValue = this.value.label || '';
      this.pickupCity = (this.value as any)._pickupCity;
      this.returnCity = (this.value as any)._returnCity;
    }
  }

  onPickupCityPicked(city: MenuOption) {
    this.pickupCity = city;
    
    // Auto-fill return city on first selection
    if (!this.returnCity) {
      this.returnCity = city;
    }
    
    this.cdr.markForCheck();
  }

  onReturnCityPicked(city: MenuOption) {
    this.returnCity = city;
    this.cdr.markForCheck();
  }

  onInputOpened() {
    if (!this.isDisabled) {
      this.isOpen = true;
      this.opened.emit();
      this.cdr.markForCheck();
    }
  }

  open() {
    if (!this.isDisabled) {
      this.isOpen = true;
      this.opened.emit();
      this.cdr.markForCheck();
    }
  }

  close() {
    this.isOpen = false;
    this.closed.emit();
    this.cdr.markForCheck();
  }



  onContinue() {
    if (!this.pickupCity || !this.returnCity) return;

    // Create combined value
    const combinedValue: any = {
      label: `${this.pickupCity.label} → ${this.returnCity.label}`,
      key: `${this.pickupCity.key}_${this.returnCity.key}`,
      _pickupCity: this.pickupCity,
      _returnCity: this.returnCity,
    };
    
    this.displayValue = combinedValue.label;
    this.optionPicked.emit(combinedValue);
    this.close();
  }
}
