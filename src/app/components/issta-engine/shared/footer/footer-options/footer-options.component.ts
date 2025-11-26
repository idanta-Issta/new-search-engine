import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FooterOption {
  label: string;
  value: string;
  checked?: boolean;
  isHidden?: boolean; // מוסתר עד שמופעל תנאי לחשיפה
}

@Component({
  selector: 'app-footer-options',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './footer-options.component.html',
  styleUrls: ['./footer-options.component.scss']
})
export class FooterOptionsComponent {
  @Input() options: FooterOption[] = [];
  @Output() optionChange = new EventEmitter<{ value: string; checked: boolean }>();

  onCheckboxChange(option: FooterOption, checked: boolean) {
    option.checked = checked;
    this.optionChange.emit({ value: option.value, checked });
  }
}
