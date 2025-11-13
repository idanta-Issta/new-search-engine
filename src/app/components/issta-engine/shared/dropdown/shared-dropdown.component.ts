import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shared-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shared-dropdown.component.html',
  styleUrls: ['./shared-dropdown.component.scss']
})
export class SharedDropdownComponent {

  @Input() isOpen: boolean = false;
  @Output() isOpenChange = new EventEmitter<boolean>();

  close() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }
}
