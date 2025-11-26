import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuOption } from '../../../../../models/shared-options-input.models';

@Component({
  selector: 'app-custom-menu-header-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-menu-header-button.component.html',
  styleUrls: ['./custom-menu-header-button.component.scss']
})
export class CustomMenuHeaderButtonComponent {
  @Input() text: string = '';
  @Input() label: string = '';
  @Input() value: string = '';
  @Input() icon?: string;
  
  @Output() optionSelected = new EventEmitter<MenuOption>();

  onClick() {
    const option: MenuOption = {
      label: this.label,
      key: this.value,
    };
    
    this.optionSelected.emit(option);
  }
}
