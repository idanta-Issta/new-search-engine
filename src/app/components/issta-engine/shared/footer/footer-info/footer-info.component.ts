import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer-info.component.html',
  styleUrls: ['./footer-info.component.scss']
})
export class FooterInfoComponent {
  @Input() items: string[] = [];
}
