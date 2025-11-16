// src/app/shared/components/shared-dropdown/shared-dropdown.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  HostListener,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  Renderer2
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-shared-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shared-dropdown.component.html',
  styleUrls: ['./shared-dropdown.component.scss'],
  animations: [
    trigger('dropdownAnimation', [
      state('closed', style({ opacity: 0, transform: 'scale(0.95)', height: '0px', overflow: 'hidden' })),
      state('open',   style({ opacity: 1, transform: 'scale(1)',   height: '*' })),
      transition('closed => open', animate('150ms ease-out')),
      transition('open => closed', animate('120ms ease-in'))
    ])
  ]
})
export class SharedDropdownComponent implements AfterViewInit {
  @Input() isOpen = false;
  @Input() width?: string;
  @Input() anchor?: HTMLElement;               // <-- אלמנט פותח/עוגן
  @Input() contentTemplate!: TemplateRef<any>;
  @Output() closed = new EventEmitter<void>();

  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef<HTMLElement>;

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {}

  ngAfterViewInit() {
    // אם יש width מפורש – נכבד אותו
    if (this.width) {
      this.renderer.setStyle(this.dropdownContainer.nativeElement, 'width', this.width);
      return;
    }
    // אחרת – ננסה לקחת מרוחב ההורה של ה-host (בד"כ הקונטיינר עם position:relative)
    const hostParent = this.el.nativeElement.parentElement as HTMLElement | null;
    const parentWidth = hostParent?.offsetWidth || this.el.nativeElement.offsetWidth || 0;
    if (parentWidth > 0) {
      this.renderer.setStyle(this.dropdownContainer.nativeElement, 'width', `${parentWidth}px`);
    } else {
      // fallback: תן 100%
      this.renderer.setStyle(this.dropdownContainer.nativeElement, 'width', '100%');
    }
  }

  // למה: אל תסגור כשנלחצים על ה-anchor או בתוך הדרופדאון
  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent) {
    const target = event.target as Node;
    const insideDropdown = this.el.nativeElement.contains(target);
    const insideAnchor = this.anchor ? this.anchor.contains(target) : false;
    if (!insideDropdown && !insideAnchor) {
      if (this.isOpen) {
        this.isOpen = false;
        this.closed.emit();
      }
    }
  }
}
