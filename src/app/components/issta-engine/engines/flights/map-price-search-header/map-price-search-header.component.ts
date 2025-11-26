import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuOption } from '../../../../../models/shared-options-input.models';

@Component({
  selector: 'app-map-price-search-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="map-addition-btn" (click)="onMapSearchClick()">
      <i class="icon-Calender1"></i>
      <span>חיפוש בעזרת מפת מחירים</span>
    </button>
  `,
  styles: [`
    .map-addition-btn {
      width: 100%;
      padding: 12px 16px;
      background: white;
      box-shadow: 0px 1px 8px 0px #00000024;
      color: #098137;
      border: none;
      border-radius: 8px;
      font-size: 18px;
      font-family: var(--main-font-family);
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.3s ease;
      margin-bottom: 12px;
      margin-top: 12px;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 76, 6, 0.987);
      }
      
      &:active {
        transform: translateY(0);
      }
      
      i {
        font-size: 16px;
      }
    }
  `]
})
export class MapPriceSearchHeaderComponent {
  @Output() optionSelected = new EventEmitter<MenuOption>();

  onMapSearchClick() {
    const mapOption: MenuOption = {
      label: 'כל היעדים',
      key: 'search-with-map-price',
    };
    
    this.optionSelected.emit(mapOption);
  }
}
