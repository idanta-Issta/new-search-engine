import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterInfoComponent } from '../footer-info/footer-info.component';
import { FooterOptionsComponent, FooterOption } from '../footer-options/footer-options.component';
import { PopularLink } from '../../../../../config/search-engine.config';
import { AppExternalConfig } from '../../../../../config/app.external.config';

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
  @Input() popular?: PopularLink[];
  @Input() buttonWidth?: number; // רוחב דינמי לכפתור
  @Output() optionChange = new EventEmitter<{ value: string; checked: boolean }>();

  getFullUrl(link: string): string {
    return `${AppExternalConfig.mainSiteUrl}${link}`;
  }

  onOptionChange(event: { value: string; checked: boolean }) {
    this.optionChange.emit(event);
  }
}
