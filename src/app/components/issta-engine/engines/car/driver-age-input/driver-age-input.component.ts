import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ElementRef,
  HostListener,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ESharedInputType } from '../../../../../enums/ESharedInputType';
import { SharedInputRegistry } from '../../../../../config/shared-input.registry';
import { SharedInputUIConfig } from '../../../../../models/shared-input-config.models';
import { InputBoxComponent } from '../../../shared/inputs/input-box/input-box.component';
import { SharedDropdownComponent } from '../../../shared/dropdowns/shared-dropdown/shared-dropdown.component';
import { EDropdownPosition } from '../../../../../enums/EDropdownPosition';

@Component({
  selector: 'app-driver-age-input',
  standalone: true,
  imports: [CommonModule, FormsModule, InputBoxComponent, SharedDropdownComponent],
  templateUrl: './driver-age-input.component.html',
  styleUrls: ['./driver-age-input.component.scss']
})
export class DriverAgeInputComponent implements OnInit {
  @Input() type!: ESharedInputType;
  @Input() value?: number;
  @Input() width: string = '100%';
  @Input() position: EDropdownPosition = EDropdownPosition.BOTTOM_RIGHT;
  @Output() valueChange = new EventEmitter<number>();
  @Output() optionPicked = new EventEmitter<number>();

  config!: SharedInputUIConfig;
  isOpen = false;
  selectedAge: number = 25;
  displayValue: string = '';

  // Age range
  minAge = 16;
  maxAge = 90;
  ages: number[] = [];

  constructor(
    private el: ElementRef,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const registryEntry = SharedInputRegistry[this.type];
    if (!registryEntry) {
      console.error('DriverAgeInput: invalid type', this.type);
      return;
    }

    this.config = registryEntry.uiConfig;

    // Generate ages array
    this.ages = Array.from({ length: this.maxAge - this.minAge + 1 }, (_, i) => this.minAge + i);

    // Set initial value
    if (this.value !== undefined && this.value >= this.minAge && this.value <= this.maxAge) {
      this.selectedAge = this.value;
    }
    
    this.updateDisplay();
  }

  onInputOpened() {
    this.isOpen = true;
    this.cdr.markForCheck();
  }

  open() {
    this.isOpen = true;
    this.cdr.markForCheck();
  }

  close() {
    this.isOpen = false;
    this.cdr.markForCheck();
  }

  selectAge(age: number) {
    this.selectedAge = age;
    this.updateDisplay();
    this.valueChange.emit(age);
    this.optionPicked.emit(age);
    this.close();
  }

  private updateDisplay() {
    this.displayValue = `${this.selectedAge} שנים`;
  }

  @HostListener('document:mousedown', ['$event'])
  onDocumentMouseDown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!this.el.nativeElement.contains(target)) {
      this.close();
    }
  }
}
