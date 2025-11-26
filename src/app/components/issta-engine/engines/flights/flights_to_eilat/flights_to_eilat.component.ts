import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flights-to-eilat',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="flights-to-eilat">
      <h2>טיסות לאילת</h2>
      <!-- This stub renders default inputs from config; no custom UI yet -->
      <p>מנוע אילת משתמש באותם אינפוטים של טיסות.</p>
    </section>
  `,
  styles: [
    `.flights-to-eilat { padding: 8px; }`
  ]
})
export class FlightsToEilatComponent {}
