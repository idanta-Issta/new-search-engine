import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent, InputValidation } from '../../../../shared/input/input.component';

@Component({
  selector: 'app-lead-form-extra-rooms-content',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent],
  templateUrl: './lead-form-extra-rooms-content.component.html',
  styleUrls: ['./lead-form-extra-rooms-content.component.scss']
})
export class LeadFormExtraRoomsContentComponent {
  @Output() submitSuccess = new EventEmitter<void>();

  form = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    peopleCount: ''
  };

  submitted = false;
  success = false;
  error = '';

  firstNameValidations: InputValidation[] = [
    { type: 'required', message: 'שדה חובה, חסרה שם פרטי הרכיב נשאר זהה' }
  ];

  lastNameValidations: InputValidation[] = [
    { type: 'required', message: 'שדה חובה, חסרה שם משפחה הרכיב נשאר זהה' }
  ];

  phoneValidations: InputValidation[] = [
    { type: 'required', message: 'הודעת שגיאה, חסרה זהות תקינה. טלפון ריק חוזרים נשאר זהה' },
    { type: 'phone', message: 'מספר טלפון חייב להכיל 10 ספרות' }
  ];

  emailValidations: InputValidation[] = [
    { type: 'email', message: 'כתובת אימייל לא תקינה' }
  ];

  peopleCountValidations: InputValidation[] = [
    { type: 'required', message: 'שדה חובה' },
    { 
      type: 'custom', 
      message: 'מספר אנשים חייב להיות בין 1 ל-99',
      validator: (value: string) => {
        const num = parseInt(value);
        return !isNaN(num) && num >= 1 && num <= 99;
      }
    }
  ];

  submit() {
    this.submitted = true;
    this.error = '';

    // Trigger validation on all inputs
    const allValid = this.validateAllFields();

    if (!allValid) {
      return;
    }

    // Simulate success
    this.success = true;
    setTimeout(() => {
      this.submitSuccess.emit();
    }, 1200);
  }

  private validateAllFields(): boolean {
    // Check required fields
    if (!this.form.firstName.trim() || 
        !this.form.lastName.trim() || 
        !this.form.phone.trim() ||
        !this.form.peopleCount.trim()) {
      return false;
    }

    // Validate phone (10 digits)
    const cleanPhone = this.form.phone.replace(/\D/g, '');
    const phonePattern = /^0[2-9]\d{8}$/;
    if (!phonePattern.test(cleanPhone)) {
      return false;
    }

    // Validate email if provided
    if (this.form.email.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.form.email)) {
        return false;
      }
    }

    // Validate people count (1-99)
    const peopleCount = parseInt(this.form.peopleCount);
    if (isNaN(peopleCount) || peopleCount < 1 || peopleCount > 99) {
      return false;
    }

    return true;
  }
}
