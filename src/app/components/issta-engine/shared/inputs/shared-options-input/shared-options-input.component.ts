import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  HostListener,
  ElementRef,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedOptionsService } from '../../../../../services/shared-options.service';
import { MenuOption } from '../../../../../models/shared-options-input.models';
import { ESharedInputType } from '../../../../../enums/ESharedInputType';
import { SharedInputRegistry } from '../../../../../config/shared-input.registry';
import { SharedInputUIConfig } from '../../../../../models/shared-input-config.models';
import { debounceTime, distinctUntilChanged, Subject, switchMap, of } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { InputBoxComponent } from '../../../shared/inputs/input-box/input-box.component';
import { SharedDropdownComponent } from '../../dropdowns/shared-dropdown/shared-dropdown.component'; 


 
@Component({
  selector: 'app-shared-options-input',
  standalone: true,
  imports: [CommonModule, FormsModule,InputBoxComponent, SharedDropdownComponent ],
  templateUrl: './shared-options-input.component.html',
  styleUrls: ['./shared-options-input.component.scss']
})
export class SharedOptionsInputComponent implements OnInit {

  @Input() type!: ESharedInputType;
  @Input() value?: MenuOption;
  @Output() valueChange = new EventEmitter<MenuOption>();
@Output() optionPicked = new EventEmitter<MenuOption>();
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

onSearchChange(value: string) {
  this.search$.next(value.trim());
}


  selectOption(option: MenuOption) {
    this.value = option;
    this.valueChange.emit(option);
    this.optionPicked.emit(option);
    this.searchTerm = option.label;
    this.isOpen = false;
  }



  @HostListener('document:mousedown', ['$event'])
  onDocumentMouseDown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!this.el.nativeElement.contains(target)) this.isOpen = false;
  }
}
