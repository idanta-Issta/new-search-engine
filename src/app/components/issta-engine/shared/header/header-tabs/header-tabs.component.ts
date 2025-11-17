import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TabOption {
  label: string;
  value: string;
  active?: boolean;
}

@Component({
  selector: 'app-header-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-tabs.component.html',
  styleUrls: ['./header-tabs.component.scss']
})
export class HeaderTabsComponent {
  @Input() tabs: TabOption[] = [];
  @Output() tabSelected = new EventEmitter<TabOption>();

  selectTab(tab: TabOption) {
    this.tabs.forEach(t => t.active = false);
    tab.active = true;
    this.tabSelected.emit(tab);
  }
}
