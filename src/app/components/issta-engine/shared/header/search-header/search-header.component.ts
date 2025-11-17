import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderChoicesComponent, ChoiceOption } from '../header-choices/header-choices.component';
import { HeaderTabsComponent, TabOption } from '../header-tabs/header-tabs.component';
import { HeaderDropdownComponent, DropdownOption } from '../header-dropdown/header-dropdown.component';

export interface HeaderState {
  selectedChoice?: string;
  selectedTab?: string;
  selectedTripType?: string;
  selectedClass?: string;
}

@Component({
  selector: 'app-search-header',
  standalone: true,
  imports: [CommonModule, HeaderChoicesComponent, HeaderTabsComponent, HeaderDropdownComponent],
  templateUrl: './search-header.component.html',
  styleUrls: ['./search-header.component.scss']
})
export class SearchHeaderComponent implements OnInit {
  @Input() title: string = '';
  @Input() choices: ChoiceOption[] = [];
  @Input() tabs: TabOption[] = [];
  @Input() tripTypeOptions: DropdownOption[] = [];
  @Input() classOptions: DropdownOption[] = [];

  @Output() stateChange = new EventEmitter<HeaderState>();

  selectedChoice: string = '';
  selectedTab: string = '';
  selectedTripType: string = '';
  selectedClass: string = '';

  ngOnInit() {
    // Set defaults
    if (this.choices.length) {
      const defaultChoice = this.choices.find(c => c.active) || this.choices[0];
      this.selectedChoice = defaultChoice.value;
    }
    if (this.tabs.length) {
      const defaultTab = this.tabs.find(t => t.active) || this.tabs[0];
      this.selectedTab = defaultTab.value;
    }
    if (this.tripTypeOptions.length) {
      this.selectedTripType = this.tripTypeOptions[0].value;
    }
    if (this.classOptions.length) {
      this.selectedClass = this.classOptions[0].value;
    }
  }

  onChoiceSelected(choice: ChoiceOption) {
    this.selectedChoice = choice.value;
    this.emitState();
  }

  onTabSelected(tab: TabOption) {
    this.selectedTab = tab.value;
    this.emitState();
  }

  onTripTypeSelected(option: DropdownOption) {
    this.selectedTripType = option.value;
    this.emitState();
  }

  onClassSelected(option: DropdownOption) {
    this.selectedClass = option.value;
    this.emitState();
  }

  private emitState() {
    this.stateChange.emit({
      selectedChoice: this.selectedChoice,
      selectedTab: this.selectedTab,
      selectedTripType: this.selectedTripType,
      selectedClass: this.selectedClass
    });
  }
}
