import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationModalService, ValidationError } from '../../../../../services/validation-modal.service';

@Component({
  selector: 'app-validation-modal-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './validation-modal-content.component.html',
  styleUrls: ['./validation-modal-content.component.scss']
})
export class ValidationModalContentComponent {
  errors$;

  constructor(private validationService: ValidationModalService) {
    this.errors$ = this.validationService.errors$;
  }

  onDismiss() {
    this.validationService.close();
  }
}
