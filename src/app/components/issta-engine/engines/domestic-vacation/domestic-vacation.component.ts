import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ESharedInputType } from '../../../../enums/ESharedInputType';
import { SharedInputRowComponent } from '../../shared/inputs/input-row/shared-input-row/shared-input-row.component';
import { PassangersInput } from '../../../../models/shared-passanger-input.models';
import { SearchFooterComponent } from '../../shared/footer/search-footer/search-footer.component';
import { SearchHeaderComponent } from '../../shared/header/search-header/search-header.component';
import { DOMESTIC_VACATION_CONFIG } from '../../../../config/search-engine.config';
import { BaseEngineComponent } from '../base-engine.component';
import { BaseEngineService } from '../../../../services/engine.service';
import { DomesticVacationManager } from '../../../../managers/domestic-vacation.manager';

@Component({
  selector: 'app-domestic-vacation',
  standalone: true,
  imports: [CommonModule, SharedInputRowComponent, SearchFooterComponent, SearchHeaderComponent],
  templateUrl: './domestic-vacation.component.html',
  styleUrls: ['./domestic-vacation.component.scss']
})
export class DomesticVacationComponent extends BaseEngineComponent {
  protected config = DOMESTIC_VACATION_CONFIG;
  private manager = new DomesticVacationManager();

  selectedDestination: any = null;
  selectedDestinationFlightEilat: any = null;
  selectedOriginFlightEilat: any = null;
  selectedDate = { start: null as Date | null, end: null as Date | null };
  selectedPassengers: PassangersInput | null = null;
  addFlightSelected = false;

  constructor(engineService: BaseEngineService) {
    super(engineService);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    // אתחול ראשוני של exclusions מערכי ברירת המחדל
    this.initializeEilatDefaults();
  }

  private initializeEilatDefaults(): void {
    // קרא את ערכי ברירת המחדל מהקונפיג
    const destinationConfig = this.inputConfigs.find(c => c.type === ESharedInputType.DESTINATIONS_FLIGHTS_EILAT);
    const originConfig = this.inputConfigs.find(c => c.type === ESharedInputType.ORIGINS_FLIGHTS_EILAT);

    if (destinationConfig?.value) {
      this.selectedDestinationFlightEilat = destinationConfig.value;
    }
    if (originConfig?.value) {
      this.selectedOriginFlightEilat = originConfig.value;
    }

    // עדכן את ה-exclusions לפי ברירות המחדל
    this.updateEilatInputExclusions();
  }

  protected updateValue(type: ESharedInputType, value: any): void {
    switch (type) {
      case ESharedInputType.DOMESTIC_VACATION_DESTINATION:
        this.selectedDestination = value;
        this.evaluateAddFlightVisibility(value);
        break;
      case ESharedInputType.DESTINATIONS_FLIGHTS_EILAT:
        this.selectedDestinationFlightEilat = value;
        this.updateEilatInputExclusions();
        break;
      case ESharedInputType.ORIGINS_FLIGHTS_EILAT:
        this.selectedOriginFlightEilat = value;
        this.updateEilatInputExclusions();
        break;
      case ESharedInputType.PICKER_DATES:
        this.selectedDate = value;
        break;
      case ESharedInputType.PASSANGERS_DOMESTIC_VACATION:
        this.selectedPassengers = value;
        break;
    }
  }

  private updateEilatInputExclusions(): void {
    const destinationValue = this.selectedDestinationFlightEilat?.value;
    const originValue = this.selectedOriginFlightEilat?.value;

    // עדכן את ה-InputConfig של origins - נסנן את היעד הנבחר
    const originsConfig = this.inputConfigs.find(c => c.type === ESharedInputType.ORIGINS_FLIGHTS_EILAT);
    if (originsConfig) {
      originsConfig.excludeValues = destinationValue ? [destinationValue] : [];
    }

    // עדכן את ה-InputConfig של destinations - נסנן את המוצא הנבחר
    const destinationsConfig = this.inputConfigs.find(c => c.type === ESharedInputType.DESTINATIONS_FLIGHTS_EILAT);
    if (destinationsConfig) {
      destinationsConfig.excludeValues = originValue ? [originValue] : [];
    }

    // עדכן את הקומפוננטים הקיימים בלי לבנות מחדש
    this.inputsRow?.updateValues();
  }

  protected openNextInput(type: ESharedInputType, value: any): void {
    switch (type) {
      case ESharedInputType.DOMESTIC_VACATION_DESTINATION:
        if (value) {
          this.inputsRow?.openInputDelayed(ESharedInputType.PICKER_DATES);
        }
        break;
      case ESharedInputType.PICKER_DATES:
        if (value?.start && value?.end) {
          this.inputsRow?.openInputDelayed(ESharedInputType.PASSANGERS_DOMESTIC_VACATION);
        }
        break;
    }
  }

  private evaluateAddFlightVisibility(destination: any) {
    const label: string = destination?.label || destination?.value || '';
    const hasEilat = /אילת/.test(label);
    const options = this.footer?.options as any[] | undefined;
    if (!options) return;
    const addFlight = options.find(o => o.value === 'add_flight');
    if (addFlight) {
      addFlight.isHidden = !hasEilat;
      // אם מוסתר נוודא שהמצב מבוטל
      if (addFlight.isHidden) {
        addFlight.checked = false;
        this.addFlightSelected = false;
      }
    }
  }

  override onHeaderStateChange(state: any): void {
    super.onHeaderStateChange(state);
    // בחירה דרך header כבר לא מנהלת add_flight
  }

  override onFooterOptionChange(event: { value: string; checked: boolean }): void {
    super.onFooterOptionChange(event);
    if (event.value === 'add_flight') {
      this.addFlightSelected = event.checked;
    }
  }

  buildUrl(): string {
    return this.manager.buildUrl({
      destination: this.selectedDestination,
      dates: this.selectedDate,
      passengers: this.selectedPassengers,
      addFlight: this.addFlightSelected
    });
  }
}
