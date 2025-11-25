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
  @Input() value?: MenuOption;
  @Input() width: string = '100%';
  @Input() position: EDropdownPosition = EDropdownPosition.BOTTOM_RIGHT;

  @Output() valueChange = new EventEmitter<MenuOption>();
  @Output() optionPicked = new EventEmitter<MenuOption>();

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

    // Set search term from value if provided
    if (this.value) {
      this.searchTerm = this.value.label || '';
    } else if (this.config.defaultValue) {
      this.searchTerm = this.config.defaultValue.label;
    }

    this.sharedService.getOptionsByType(this.type).subscribe({
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
    this.loadCustomHeaderComponent();
    this.cdr.markForCheck();
  }

  /** למה: מאפשר פתיחה מתוכנתית מהסבא דרך הבן */
  open() {
    this.isOpen = true;
    this.cdr.markForCheck();
    // Use setTimeout to ensure the view is rendered before loading component
    setTimeout(() => this.loadCustomHeaderComponent(), 0);
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
  this.value = option; // Update the value to track selected option
  this.optionPicked.emit(option);
  this.searchTerm = option.label;
  this.isOpen = false;
  this.cdr.markForCheck();
}


  @HostListener('document:mousedown', ['$event'])
  onDocumentMouseDown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!this.el.nativeElement.contains(target)) this.close();
  }
}
