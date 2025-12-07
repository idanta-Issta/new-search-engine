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
  isPickupDropdownOpen = false;
  preventClose = false;

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
    
    // עדכן את התצוגה מיד עם עיר האיסוף בלבד
    this.displayValue = city.label;
    
    // שלח את הערך עם שתי הערים
    const combinedValue: any = {
      label: city.label,
      key: `${city.key}_${this.returnCity.key}`,
      _pickupCity: city,
      _returnCity: this.returnCity,
    };
    this.optionPicked.emit(combinedValue);
    
    this.isPickupDropdownOpen = false;
    this.cdr.markForCheck();
  }

  onPickupDropdownOpened() {
    console.log('[CAR-LOCATION] Pickup dropdown opened');
    this.isPickupDropdownOpen = true;
    this.preventClose = true;
    this.cdr.markForCheck();
  }

  onPickupDropdownClosed() {
    console.log('[CAR-LOCATION] Pickup dropdown closed');
    this.isPickupDropdownOpen = false;
    this.preventClose = true;
    this.cdr.markForCheck();
  }

  onReturnCityPicked(city: MenuOption) {
    this.returnCity = city;
    
    // עדכן את הערך המשולב אם יש גם עיר איסוף
    if (this.pickupCity) {
      const combinedValue: any = {
        label: this.pickupCity.label,
        key: `${this.pickupCity.key}_${city.key}`,
        _pickupCity: this.pickupCity,
        _returnCity: city,
      };
      this.optionPicked.emit(combinedValue);
    }
    
    this.cdr.markForCheck();
  }

  onInputOpened() {
    if (!this.isDisabled) {
      this.isOpen = true;
      this.opened.emit();
      this.cdr.markForCheck();
    } else {
      console.log('🚫 Cannot open car location input - disabled (no country selected)');
    }
  }

  onInputClosed() {
    if (this.preventClose) {
      console.log('[CAR-LOCATION] Preventing close - internal dropdown interaction');
      this.preventClose = false;
      return;
    }
    console.log('[CAR-LOCATION] Closing main dropdown');
    this.isOpen = false;
    this.cdr.markForCheck();
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

    // סגור את הdropdown - הערך כבר התעדכן ב-onPickupCityPicked
    this.close();
  }
}
