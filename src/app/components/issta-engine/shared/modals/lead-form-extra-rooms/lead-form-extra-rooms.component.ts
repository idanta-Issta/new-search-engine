import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericModalComponent } from '../../../../shared/generic-modal/generic-modal.component';
import { LeadFormExtraRoomsContentComponent } from './lead-form-extra-rooms-content.component';

@Component({
  selector: 'app-lead-form-extra-rooms',
  standalone: true,
  imports: [CommonModule, GenericModalComponent, LeadFormExtraRoomsContentComponent],
  templateUrl: './lead-form-extra-rooms.component.html',
  styleUrls: ['./lead-form-extra-rooms.component.scss']
})
export class LeadFormExtraRoomsComponent {
  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }

  onSubmitSuccess() {
    setTimeout(() => {
      this.close();
    }, 1200);
  }
}
