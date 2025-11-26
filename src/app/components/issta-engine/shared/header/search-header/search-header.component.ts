import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderChoicesComponent, ChoiceOption } from '../header-choices/header-choices.component';
import { HeaderDropdownComponent, DropdownOption } from '../header-dropdown/header-dropdown.component';

export interface HeaderState {
  selectedChoice?: ChoiceOption;
  selectedTripType?: DropdownOption;
  selectedClass?: DropdownOption;
}

@Component({
  selector: 'app-search-header',
  standalone: true,
  imports: [CommonModule, HeaderChoicesComponent, HeaderDropdownComponent],
  templateUrl: './search-header.component.html',
  styleUrls: ['./search-header.component.scss']
})
export class SearchHeaderComponent implements OnInit, OnChanges {
  @Input() title: string = '';
  @Input() choices?: ChoiceOption[];
  @Input() routeType?: DropdownOption[];
  @Input() classOptions?: DropdownOption[];

  @Output() stateChange = new EventEmitter<HeaderState>();

  selectedChoice: ChoiceOption | undefined = undefined;
  selectedTripType: DropdownOption | undefined = undefined;
  selectedClass: DropdownOption | undefined = undefined;

  ngOnInit() {
    // Set defaults
    if (this.choices?.length) {
      const defaultChoice = this.choices.find(c => c.isDefault) || this.choices[0];
      this.selectedChoice = defaultChoice;
    }
    if (this.routeType?.length) {
      const defaultTripType = this.routeType.find(t => t.isDefault) || this.routeType[0];
      this.selectedTripType = defaultTripType;
    }
    if (this.classOptions?.length) {
      const defaultClass = this.classOptions.find(c => c.isDefault) || this.classOptions[0];
      this.selectedClass = defaultClass;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['choices'] && this.choices?.length) {
      const defaultChoice = this.choices.find(c => c.isDefault) || this.choices[0];
      this.selectedChoice = defaultChoice;
    }
    if (changes['routeType'] && this.routeType?.length) {
      const defaultTripType = this.routeType.find(t => t.isDefault) || this.routeType[0];
      this.selectedTripType = defaultTripType;
    }
    if (changes['classOptions'] && this.classOptions?.length) {
      const defaultClass = this.classOptions.find(c => c.isDefault) || this.classOptions[0];
      this.selectedClass = defaultClass;
    }
    this.emitState();
  }

  onChoiceSelected(choice: ChoiceOption) {
    this.selectedChoice = choice;
    this.emitState();
  }

  onTripTypeSelected(option: DropdownOption) {
    this.selectedTripType = option;
    this.emitState();
  }

  onClassSelected(option: DropdownOption) {
    this.selectedClass = option;
    this.emitState();
  }

  private emitState() {
    this.stateChange.emit({
      selectedChoice: this.selectedChoice,
      selectedTripType: this.selectedTripType,
      selectedClass: this.selectedClass
    });
  }
}
