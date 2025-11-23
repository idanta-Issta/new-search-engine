import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from '../../../../../directives/click-outside.directive';
import { ETypeSearchEngine } from '../../../../../enums/ETypeSearchEngine';

export interface DropdownOption {
  label: string;
  value: string;
  isDefault?: boolean;
  useEngine?: ETypeSearchEngine;
}

@Component({
  selector: 'app-header-dropdown',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective],
  templateUrl: './header-dropdown.component.html',
  styleUrls: ['./header-dropdown.component.scss']
})
export class HeaderDropdownComponent {
  @Input() label: string = '';
  @Input() options: DropdownOption[] = [];
  @Input() selectedValue: string = '';
  @Output() optionSelected = new EventEmitter<DropdownOption>();

  isOpen = false;

  get selectedLabel(): string {
    const selected = this.options.find(o => o.value === this.selectedValue);
    return selected ? selected.label : this.label;
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: DropdownOption) {
    this.selectedValue = option.value;
    this.isOpen = false;
    this.optionSelected.emit(option);
  }

  closeDropdown() {
    this.isOpen = false;
  }
}
