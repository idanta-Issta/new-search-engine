// src/app/shared/inputs/shared-options-input/shared-options-input.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  AfterViewInit,
  SimpleChanges,
  HostListener,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ViewContainerRef,
  Type,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap, of } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { SharedOptionsService } from '../../../../../services/shared-options.service';
import { MenuOption } from '../../../../../models/shared-options-input.models';
import { ESharedInputType } from '../../../../../enums/ESharedInputType';
import { SharedInputRegistry } from '../../../../../config/shared-input.registry';
import { SharedInputUIConfig } from '../../../../../models/shared-input-config.models';
import { InputBoxComponent } from '../../../shared/inputs/input-box/input-box.component';
import { SharedDropdownComponent } from '../../dropdowns/shared-dropdown/shared-dropdown.component';
import { EDropdownPosition } from '../../../../../enums/EDropdownPosition';

@Component({
  selector: 'app-shared-options-input',
  standalone: true,
  imports: [CommonModule, FormsModule, InputBoxComponent, SharedDropdownComponent],
  templateUrl: './shared-options-input.component.html',
  styleUrls: ['./shared-options-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedOptionsInputComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() type!: ESharedInputType;
  
  private _value?: MenuOption;
  @Input() 
  set value(val: MenuOption | undefined) {
    this._value = val;
    if (val) {
      this.searchTerm = val.label || '';
      this.cdr.markForCheck();
    }
  }
  get value(): MenuOption | undefined {
    return this._value;
  }
  
  @Input() width: string = '100%';
  @Input() position: EDropdownPosition = EDropdownPosition.BOTTOM_RIGHT;
  @Input() excludeValues?: string[];
  @Input() title?: string; // Override config title
  @Input() placeholder?: string; // Override config placeholder
  
  private _isDisabled: boolean = false;
  @Input() 
  set isDisabled(val: boolean) {
    this._isDisabled = val;
    this.cdr.markForCheck();
  }
  get isDisabled(): boolean {
    return this._isDisabled;
  }

  @Output() valueChange = new EventEmitter<MenuOption>();
  @Output() optionPicked = new EventEmitter<MenuOption>();
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  @ViewChild('customHeaderContainer', { read: ViewContainerRef, static: false }) customHeaderContainer?: ViewContainerRef;

  config!: SharedInputUIConfig;
  customHeaderComponent?: Type<any> | (() => Promise<Type<any>>);

  searchTerm = '';
  isOpen = false;
  options: MenuOption[] = [];
  filteredOptions: MenuOption[] = [];
  noResults = false;

  private search$ = new Subject<string>();

  constructor(
    private sharedService: SharedOptionsService,
    private el: ElementRef,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const registryEntry = SharedInputRegistry[this.type];
    if (!registryEntry) return;

    this.config = registryEntry.uiConfig;
    this.customHeaderComponent = registryEntry.customMenuHeaderComponent;
    
    // Check if disabled from registry
    if (registryEntry.isDisabled !== undefined) {
      this.isDisabled = registryEntry.isDisabled;
    }

    // Set search term from value if provided
    if (this.value) {
      this.searchTerm = this.value.label || '';
    } else if (this.config.defaultValue) {
      this.searchTerm = this.config.defaultValue.label;
    }

    // טען אופציות תוך שמירה על הערך הנוכחי
    const currentValue = this.value?.value || this.value?.key;
    this.sharedService.getOptionsWithCurrentValue(this.type, currentValue).subscribe({
      next: (data) => {
        this.options = data;
        this.filteredOptions = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error fetching options:', err),
    });

    this.search$
      .pipe(debounceTime(300), distinctUntilChanged(), switchMap((term) => this.handleSearch(term)))
      .subscribe((results) => {
        this.filteredOptions = results;
        this.noResults = !results.length;
        this.cdr.markForCheck();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // אם ה-value השתנה מבחוץ, עדכן את searchTerm
    if (changes['value'] && changes['value'].currentValue) {
      const newValue = changes['value'].currentValue as MenuOption;
      this.searchTerm = newValue.label || '';
      this.cdr.markForCheck();
    }

    // אם excludeValues השתנה ויש כבר אופציות, טען מחדש
    if (changes['excludeValues'] && !changes['excludeValues'].firstChange && this.options) {
      this.reloadOptions();
    }
  }

  ngAfterViewInit(): void {
    // Load custom header component when view is initialized if needed
    if (this.customHeaderComponent) {
      setTimeout(() => this.loadCustomHeaderComponent(), 0);
    }
  }

  onInputOpened() {
    this.isOpen = true;
    this.opened.emit();
    // טען מחדש אופציות בכל פתיחה (כדי לתפוס שינויים ב-excludeValues)
    this.reloadOptions();
    this.loadCustomHeaderComponent();
    this.cdr.markForCheck();
  }

  /** למה: מאפשר פתיחה מתוכנתית מהסבא דרך הבן */
  open() {
    if (this.isDisabled) {
      return; // Don't open if disabled
    }
    this.isOpen = true;
    this.reloadOptions();
    this.cdr.markForCheck();
    // Use setTimeout to ensure the view is rendered before loading component
    setTimeout(() => this.loadCustomHeaderComponent(), 0);
  }

  private reloadOptions() {
    this.sharedService.getOptionsByType(this.type, this.excludeValues).subscribe({
      next: (data) => {
        this.options = data;
        this.filteredOptions = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error reloading options:', err),
    });
  }

  async loadCustomHeaderComponent() {
    if (!this.customHeaderComponent || !this.customHeaderContainer) return;

    this.customHeaderContainer.clear();

    let componentType: Type<any>;
    if (typeof this.customHeaderComponent === 'function') {
      const module = await (this.customHeaderComponent as (() => Promise<Type<any>>))();
      componentType = module as Type<any>;
    } else {
      componentType = this.customHeaderComponent as Type<any>;
    }

    const componentRef = this.customHeaderContainer.createComponent(componentType);
    
    // Pass config if exists
    const registryEntry = SharedInputRegistry[this.type];
    if (registryEntry.customMenuHeaderConfig) {
      const config = registryEntry.customMenuHeaderConfig;
      if (config.text) componentRef.instance.text = config.text;
      if (config.label) componentRef.instance.label = config.label;
      if (config.value) componentRef.instance.value = config.value;
      if (config.icon) componentRef.instance.icon = config.icon;
    }
    
    // Listen to optionSelected output if it exists
    if (componentRef.instance.optionSelected) {
      componentRef.instance.optionSelected.subscribe((option: MenuOption) => {
        this.selectOption(option);
      });
    }

    this.cdr.markForCheck();
  }

  close() {
    this.isOpen = false;
    this.closed.emit();
    this.cdr.markForCheck();
  }

  private handleSearch(term: string) {
    const registry = SharedInputRegistry[this.type];
    if (!term) return of(this.options);

    if (registry.autocompleteUrl) {
      return this.sharedService.searchAutocomplete(this.type, term);
    }

    const local = this.options.filter((o) => (o.label ?? '').toLowerCase().includes(term.toLowerCase()));
    return of(local);
  }

  highlightMatch(text: string | null): SafeHtml {
    if (!text) return '';
    if (!this.searchTerm) return text;
    const term = this.searchTerm.trim();
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    const highlighted = text.replace(regex, '<span class="mark-autocomplete">$1</span>');
    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }

  onSearchChange(value: string) {
    this.search$.next(value.trim());
  }

selectOption(option: MenuOption) {
  this.value = option;
  this.optionPicked.emit(option);
  this.searchTerm = option.label;
  this.isOpen = false;
  this.closed.emit();
  this.cdr.markForCheck();
}

isSelected(option: MenuOption): boolean {
  if (!this.value) return false;
  // Support both 'key' and 'value' properties for backward compatibility
  const selectedIdentifier = this.value.value || this.value.key;
  const optionIdentifier = option.value || option.key;
  return selectedIdentifier === optionIdentifier && selectedIdentifier !== undefined;
}


  @HostListener('document:mousedown', ['$event'])
  onDocumentMouseDown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!this.el.nativeElement.contains(target)) this.close();
  }
}
