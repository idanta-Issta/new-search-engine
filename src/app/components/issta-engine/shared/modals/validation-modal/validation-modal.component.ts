import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericModalComponent } from '../../../../shared/generic-modal/generic-modal.component';
import { ValidationModalContentComponent } from './validation-modal-content.component';

@Component({
  selector: 'app-validation-modal',
  standalone: true,
  imports: [CommonModule, GenericModalComponent, ValidationModalContentComponent],
  templateUrl: './validation-modal.component.html',
  styleUrls: ['./validation-modal.component.scss']
})
export class ValidationModalComponent {
  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}
