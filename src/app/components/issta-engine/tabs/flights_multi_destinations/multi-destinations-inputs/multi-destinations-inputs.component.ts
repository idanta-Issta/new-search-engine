import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputConfig } from '../../../../../models/input-config.model';
import { ESharedInputType } from '../../../../../enums/ESharedInputType';

@Component({
  selector: 'app-multi-destinations-inputs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="multi-destinations-container">
      <h3>יעדים מרובים - קומפוננטה מותאמת</h3>
      <p>כאן תוכל לעצב את זה איך שאתה רוצה, לגמרי שונה מ-shared-input-row</p>
      
      <!-- Example custom layout -->
      <div class="destinations-list">
        <div *ngFor="let config of inputConfigs; let i = index" class="destination-item">
          <span>יעד {{ i + 1 }}: {{ config.type }}</span>
        </div>
      </div>
      
      <button class="search-button" (click)="onSearchClick()">
        חיפוש טיסות ליעדים מרובים
      </button>
    </div>
  `,
  styles: [`
    .multi-destinations-container {
      padding: 20px;
      background: #f5f5f5;
      border-radius: 8px;
      
      h3 {
        color: #2AAE54;
        margin-bottom: 10px;
      }
      
      .destinations-list {
        margin: 20px 0;
      }
      
      .destination-item {
        padding: 10px;
        background: white;
        margin-bottom: 8px;
        border-radius: 4px;
      }
      
      .search-button {
        background: #2AAE54;
        color: white;
        padding: 12px 24px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 16px;
        
        &:hover {
          background: #249945;
        }
      }
    }
  `]
})
export class MultiDestinationsInputsComponent {
  @Input() inputConfigs: InputConfig[] = [];
  @Output() inputPicked = new EventEmitter<{ type: ESharedInputType; value: any }>();
  @Output() searchClicked = new EventEmitter<void>();

  onSearchClick() {
    this.searchClicked.emit();
  }
}
