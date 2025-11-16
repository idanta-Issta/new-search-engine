import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-input-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input-box.component.html',
  styleUrls: ['./input-box.component.scss']
})
export class InputBoxComponent {

  @Input() icon: string | null = null;
  @Input() title?: string;
  @Input() placeholder: string = '';
  @Input() allowAutoComplete = true;
@ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;

  @Input() model: string = '';
  @Output() modelChange = new EventEmitter<string>();
  @Output() inputChange = new EventEmitter<string>();

  /** מצב פנימי של פתיחה/סגירה */
  isOpen = false;

  /** האבא יקבל את זה */
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  /** פונקציות לשליטה פנימית */
  open() {
    if (!this.isOpen) {
      this.isOpen = true;
      this.opened.emit();
    }
  }

  close() {
    if (this.isOpen) {
      this.isOpen = false;
      this.closed.emit();
    }
  }

  /** טריגרים */
  onBoxClick() {
    this.open();
  }

onFocus(event: FocusEvent) {
  this.open();

  // מסמן את כל הטקסט
  setTimeout(() => {
    this.inputRef.nativeElement.select();
  });
}


  onBlur() {
    // כדי לא לרדת מייד - נותן זמן לקליק בדפדפן
    setTimeout(() => this.close(), 150);
  }

onInput(value: string) {
  this.model = value;
  this.modelChange.emit(value);
  this.inputChange.emit(value);

  // חשוב! אם מקלידים – לפתוח תפריט
  this.open();
}

}
