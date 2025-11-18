// ======================== src/app/shared/components/shared-dropdown/shared-dropdown.component.ts
import { Component, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { EDropdownPosition } from '../../../../../enums/EDropdownPosition';

@Component({
  selector: 'app-shared-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
  class="dropdown-wrapper"
  [@dropdownAnimation]="isOpen ? 'open' : 'closed'"
  [ngClass]="{ 'scrollable': scrollable, 'position-bottom-right': position === 'bottom-right', 'position-bottom-left': position === 'bottom-left', 'position-bottom-center': position === 'bottom-center' }"
  (mousedown)="$event.stopPropagation()"
>
  <div class="dropdown-body">
    <ng-content></ng-content>
  </div>
</div>

  `,
  styleUrls: ['./shared-dropdown.component.scss'],
  animations: [
    trigger('dropdownAnimation', [
      state('closed', style({ opacity: 0, transform: 'scale(0.98)', height: '0px', overflow: 'hidden' })),
      state('open',   style({ opacity: 1, transform: 'scale(1)',   height: '*' })),
      transition('closed => open', animate('150ms cubic-bezier(0.2,0,0,1)')),
      transition('open => closed', animate('120ms cubic-bezier(0.4,0,1,1)')),
    ])
  ]
})
export class SharedDropdownComponent {
  @Input() isOpen = false;
  @Input() anchor?: HTMLElement;
  @Input() scrollable = false;
  @Input() position: EDropdownPosition = EDropdownPosition.BOTTOM_RIGHT;
  @Output() closed = new EventEmitter<void>();

  constructor(private host: ElementRef<HTMLElement>) {}

  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent) {
    const t = ev.target as Node;
    const inside  = this.host.nativeElement.contains(t);
    const onAnchor = this.anchor?.contains(t) ?? false;
    if (!inside && !onAnchor && this.isOpen) {
      this.isOpen = false;
      this.closed.emit();
    }
  }
}