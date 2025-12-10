import { Component, EventEmitter, Output, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-generic-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generic-modal.component.html',
  styleUrls: ['./generic-modal.component.scss'],
  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('250ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('containerAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px) scale(0.95)' }),
        animate('300ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ])
    ])
  ]
})
export class GenericModalComponent {
  @Input() title?: string;
  @Input() contentTemplate?: TemplateRef<any>;
  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }

  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}
