import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  HostListener,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedOptionsService } from '../../../../../services/shared-options.service';
import { MenuOption } from '../../../../../models/shared-options-input.models';
import { ESharedInputType } from '../../../../../models/shared-input-type.enum';
import { SharedInputRegistry } from '../../../../../config/shared-input.registry';
import { SharedInputUIConfig } from '../../../../../interfaces/shared-input-config.interface';
import { debounceTime, distinctUntilChanged, Subject, switchMap, of } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-shared-options-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shared-options-input.component.html',
  styleUrls: ['./shared-options-input.component.scss']
})
export class SharedOptionsInputComponent implements OnInit {

  @Input() type!: ESharedInputType;
  @Input() value?: MenuOption;
  @Output() valueChange = new EventEmitter<MenuOption>();

  // ⬅️ אחרי התיקון — עכשיו זה הטייפ הנכון
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
    private sanitizer: DomSanitizer
  ) {}

 ngOnInit() {
  const registryEntry = SharedInputRegistry[this.type];
  if (!registryEntry) return;

  this.config = registryEntry.uiConfig;

if (this.config.defaultValue && !this.value) {
  this.searchTerm = this.config.defaultValue.label;
}


  this.sharedService.getOptionsByType(this.type).subscribe({
    next: data => {
      this.options = data;
      this.filteredOptions = data;
    },
    error: err => console.error('Error fetching options:', err)
  });

  this.search$
    .pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.handleSearch(term))
    )
    .subscribe(results => {
      this.filteredOptions = results;
      this.noResults = !results.length;
    });
}


  private handleSearch(term: string) {
    const registry = SharedInputRegistry[this.type];

    if (!term) return of(this.options);

    if (registry.autocompleteUrl) {
      return this.sharedService.searchAutocomplete(this.type, term);
    }

    const local = this.options.filter(o =>
      o.label.toLowerCase().includes(term.toLowerCase())
    );

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

  onSearchChange(event: Event) {
    const term = (event.target as HTMLInputElement).value.trim();
    this.search$.next(term);
  }

  selectOption(option: MenuOption) {
    this.value = option;
    this.valueChange.emit(option);
    this.searchTerm = option.label;
    this.isOpen = false;
  }

onFocusInput(inputEl: HTMLInputElement) {
  this.isOpen = true;

  setTimeout(() => {
    inputEl.select();
  });
}


  onBlurInput() {
    setTimeout(() => {
      const active = document.activeElement;
      const clickedInside = this.el.nativeElement.contains(active);
      if (!clickedInside) this.isOpen = false;
    }, 100);
  }

  @HostListener('document:mousedown', ['$event'])
  onDocumentMouseDown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!this.el.nativeElement.contains(target)) this.isOpen = false;
  }
}
