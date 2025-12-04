import { Component, OnInit, OnDestroy, Renderer2, NgZone, ViewEncapsulation, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-cruise',
  standalone: true,
  templateUrl: './cruise.component.html',
  styleUrls: ['./cruise.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CruiseComponent implements OnInit, OnDestroy {
  private scriptElement: HTMLScriptElement | null = null;
  private cssLinks: HTMLLinkElement[] = [];

  constructor(private renderer: Renderer2, private ngZone: NgZone) { }

  ngOnInit() {
    console.log('[CRUISE] Component initialized, loading external resources...');
    

  }

  ngOnDestroy() {
    console.log('[CRUISE] Component destroying, cleaning up resources...');
    


  }
}
