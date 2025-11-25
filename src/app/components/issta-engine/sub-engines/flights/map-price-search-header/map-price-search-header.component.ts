import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuOption } from '../../../../../models/shared-options-input.models';

@Component({
  selector: 'app-map-price-search-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-price-search-header.component.html',
  styleUrls: ['./map-price-search-header.component.scss']
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
