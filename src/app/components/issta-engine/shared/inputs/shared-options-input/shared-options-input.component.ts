// src/app/shared/inputs/shared-options-input/shared-options-input.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  HostListener,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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

@Component({
  selector: 'app-shared-options-input',
  standalone: true,
  imports: [CommonModule, FormsModule, InputBoxComponent, SharedDropdownComponent],
  templateUrl: './shared-options-input.component.html',
  styleUrls: ['./shared-options-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedOptionsInputComponent implements OnInit, OnChanges {
  @Input() type!: ESharedInputType;
  @Input() value?: MenuOption;

  @Output() valueChange = new EventEmitter<MenuOption>();
  @Output() optionPicked = new EventEmitter<MenuOption>();

  config!: SharedInputUIConfig;

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

    if (this.config.defaultValue && !this.value) {
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

  /** למה: מאפשר פתיחה מתוכנתית מהסבא דרך הבן */
  open() {
    this.isOpen = true;
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
