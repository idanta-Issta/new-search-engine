import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ETypeSearchEngine } from '../../../../../enums/ETypeSearchEngine';

export interface ChoiceOption {
  label: string;
  value: string;
  promotionText?: string;
  active?: boolean;
  isDefault?: boolean;
  useEngine?: ETypeSearchEngine;
}

@Component({
  selector: 'app-header-choices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-choices.component.html',
  styleUrls: ['./header-choices.component.scss']
})
export class HeaderChoicesComponent {
  @Input() choices: ChoiceOption[] = [];
  @Input() selectedValue: string = '';
  @Output() choiceSelected = new EventEmitter<ChoiceOption>();

  selectChoice(choice: ChoiceOption) {
    this.selectedValue = choice.value;
    this.choiceSelected.emit(choice);
  }
}
