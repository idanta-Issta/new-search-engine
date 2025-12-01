import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

export interface InputValidation {
  type: 'required' | 'email' | 'phone' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  message: string;
  value?: any; // for minLength, maxLength, pattern
  validator?: (value: string) => boolean; // for custom validation
}

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  @Input() placeholder: string = '';
  @Input() type: 'text' | 'email' | 'tel' | 'number' = 'text';
  @Input() validations: InputValidation[] = [];
  @Input() dir: 'rtl' | 'ltr' = 'rtl';
  @Input() mask?: string; // e.g., 'XXX-XXXXXXX' for phone
  @Input() min?: number;
  @Input() max?: number;
  @Output() blur = new EventEmitter<void>();

  value: string = '';
  touched: boolean = false;
  errorMessage: string = '';

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInputChange(newValue: string) {
    if (this.mask && this.type === 'tel') {
      newValue = this.applyPhoneMask(newValue);
    }
    this.value = newValue;
    this.onChange(newValue);
  }

  private applyPhoneMask(value: string): string {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Apply mask XXX-XXXXXXX (10 digits total)
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 10) {
      return digits.substring(0, 3) + '-' + digits.substring(3, 10);
    } else {
      return digits.substring(0, 3) + '-' + digits.substring(3, 10);
    }
  }

  onBlur() {
    this.touched = true;
    this.onTouched();
    this.validate();
    this.blur.emit();
  }

  validate(): boolean {
    this.errorMessage = '';

    if (!this.touched) {
      return true;
    }

    for (const validation of this.validations) {
      switch (validation.type) {
        case 'required':
          if (!this.value || this.value.trim() === '') {
            this.errorMessage = validation.message;
            return false;
          }
          break;

        case 'email':
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (this.value && !emailPattern.test(this.value)) {
            this.errorMessage = validation.message;
            return false;
          }
          break;

        case 'phone':
          // Remove mask characters and validate 10 digits starting with 0
          const cleanPhone = this.value.replace(/\D/g, '');
          const phonePattern = /^0[2-9]\d{8}$/; // Exactly 10 digits
          if (this.value && !phonePattern.test(cleanPhone)) {
            this.errorMessage = validation.message;
            return false;
          }
          break;

        case 'minLength':
          if (this.value && this.value.length < validation.value) {
            this.errorMessage = validation.message;
            return false;
          }
          break;

        case 'maxLength':
          if (this.value && this.value.length > validation.value) {
            this.errorMessage = validation.message;
            return false;
          }
          break;

        case 'pattern':
          const pattern = new RegExp(validation.value);
          if (this.value && !pattern.test(this.value)) {
            this.errorMessage = validation.message;
            return false;
          }
          break;

        case 'custom':
          if (validation.validator && !validation.validator(this.value)) {
            this.errorMessage = validation.message;
            return false;
          }
          break;
      }
    }

    return true;
  }

  get hasError(): boolean {
    return this.touched && !!this.errorMessage;
  }
}
