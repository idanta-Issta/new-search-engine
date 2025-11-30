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
  @Input() isOpen = false;
  @Input() width: string = '100%';
  @Input() isBoldIcon: boolean = false;
  
  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;

  private _blurTimeout: any = null;

  @Input() model: string = '';
  @Output() modelChange = new EventEmitter<string>();
  @Output() inputChange = new EventEmitter<string>();

  /** האבא יקבל את זה */
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  /** פונקציות לשליטה פנימית */
  open() {
    // cancel any pending blur-close when explicitly opening
    if (this._blurTimeout) {
      clearTimeout(this._blurTimeout);
      this._blurTimeout = null;
    }
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
  // cancel pending close and open
  if (this._blurTimeout) {
    clearTimeout(this._blurTimeout);
    this._blurTimeout = null;
  }
  this.open();

  // מסמן את כל הטקסט
  setTimeout(() => {
    this.inputRef.nativeElement.select();
  });
}


  onBlur() {
    // כדי לא לרדת מייד - נותן זמן לקליק בדפדפן
    // store the timeout so it can be cancelled if focus returns or
    // a programmatic open happens (prevents flicker / premature close)
    if (this._blurTimeout) {
      clearTimeout(this._blurTimeout);
    }
    this._blurTimeout = setTimeout(() => {
      this._blurTimeout = null;
      this.close();
    }, 150);
  }

onInput(value: string) {
  this.model = value;
  this.modelChange.emit(value);
  this.inputChange.emit(value);

  // חשוב! אם מקלידים – לפתוח תפריט
  this.open();
}

}
