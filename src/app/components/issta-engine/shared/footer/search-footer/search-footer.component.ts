import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterInfoComponent } from '../footer-info/footer-info.component';
import { FooterOptionsComponent, FooterOption } from '../footer-options/footer-options.component';

@Component({
  selector: 'app-search-footer',
  standalone: true,
  imports: [CommonModule, FooterInfoComponent, FooterOptionsComponent],
  templateUrl: './search-footer.component.html',
  styleUrls: ['./search-footer.component.scss']
})
export class SearchFooterComponent {
  @Input() infoItems?: string[];
  @Input() options?: FooterOption[];
  @Input() buttonWidth?: number; // רוחב דינמי לכפתור
  @Output() optionChange = new EventEmitter<{ value: string; checked: boolean }>();

  onOptionChange(event: { value: string; checked: boolean }) {
    this.optionChange.emit(event);
  }
}
