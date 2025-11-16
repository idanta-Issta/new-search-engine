import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-shared-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shared-dropdown.component.html',
  styleUrls: ['./shared-dropdown.component.scss'],
  animations: [
    trigger('dropdownAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-6px)' }),
        animate('180ms ease', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('150ms ease', style({ opacity: 0, transform: 'translateY(-6px)' }))
      ])
    ])
  ]
})
export class SharedDropdownComponent {

  @Input() isOpen: boolean = false;
  @Output() isOpenChange = new EventEmitter<boolean>();

  /** סגירה בלחיצה מחוץ לתפריט */
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('app-shared-dropdown');
    if (!clickedInside && this.isOpen) {
      this.close();
    }
  }

  close() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }
}
