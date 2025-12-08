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
import { FlightsToEilatManager } from '../../../../managers/flights-to-eilat.manager';

@Component({
  selector: 'app-domestic-vacation',
  standalone: true,
  imports: [CommonModule, SharedInputRowComponent, SearchFooterComponent, SearchHeaderComponent],
  templateUrl: './domestic-vacation.component.html',
  styleUrls: ['./domestic-vacation.component.scss']
})
export class DomesticVacationComponent extends BaseEngineComponent {
  protected config = DOMESTIC_VACATION_CONFIG;
  private domesticVacationManager = new DomesticVacationManager();
  private flightsToEilatManager = new FlightsToEilatManager();

  selectedDestination: any = null;
  selectedDestinationFlightEilat: any = null;
  selectedOriginFlightEilat: any = null;
  selectedDestinationFlightHotelEilat: any = null;
  selectedDate = { start: null as Date | null, end: null as Date | null };
  selectedPassengers: PassangersInput = {
    allowPickRoom: true,
    maxRoomsPick: 4,
    maxTotalPassengers: 9,
    maxPassengersInRoom: 9,
    rooms: [
      {
        roomNumber: 1,
        adults: 2,
        children: 0,
        infants: 0
      }
    ],
    optionsAge: []
  };
  addFlightSelected = false;
  currentTabType: string = 'hotel_domestic'; // ברירת מחדל
  selectedRouteType: string = 'round_trip'; // ברירת מחדל לטיסות

  constructor(engineService: BaseEngineService) {
    super(engineService);
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected override onEngineLoaded(): void {
    // נקרא אחרי שמנוע נטען (כולל default choice)
    this.initializeEilatDefaults();
  }

  private initializeEilatDefaults(): void {
    // קרא את ערכי ברירת המחדל מהקונפיג
    const destinationConfig = this.inputConfigs.find(c => c.type === ESharedInputType.DESTINATIONS_FLIGHTS_EILAT);
    const originConfig = this.inputConfigs.find(c => c.type === ESharedInputType.ORIGINS_FLIGHTS_EILAT);

    // אם אין inputs של אילת, לא צריך לעשות כלום
    if (!destinationConfig && !originConfig) {
      return;
    }

    // אתחול: חזור מתחיל מוסתר חיפה ותל אביב
    if (originConfig) {
      originConfig.excludeValues = ["HFA", "TLV"];
    }

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
      case ESharedInputType.DESTINATIONS_FLIGHTS_HOTEL_EILAT:
        this.selectedDestinationFlightHotelEilat = value;
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

    const originsConfig = this.inputConfigs.find(c => c.type === ESharedInputType.ORIGINS_FLIGHTS_EILAT);
    const destinationsConfig = this.inputConfigs.find(c => c.type === ESharedInputType.DESTINATIONS_FLIGHTS_EILAT);

    // הלוך - אף פעם לא מסנן
    if (destinationsConfig) {
      destinationsConfig.excludeValues = [];
    }

    // לוגיקה לפי הלוך שנבחר - משנה את החזור ואת התפריט שלו
    if (destinationValue === 'ETM') {
      // אם בחרו אילת בהלוך
      if (originsConfig) {
        // החזור = תל אביב, הסתר רק אילת
        const newOriginValue = { label: 'תל אביב, נתב"ג', value: 'TLV' };
        originsConfig.value = newOriginValue;
        originsConfig.excludeValues = ['ETM'];
        this.selectedOriginFlightEilat = newOriginValue;
      }
    } else if (destinationValue === 'HFA') {
      // אם בחרו חיפה בהלוך
      if (originsConfig) {
        // החזור = אילת, הסתר תל אביב וחיפה
        const newOriginValue = { label: 'אילת, נמל תעופה רמון', value: 'ETM' };
        originsConfig.value = newOriginValue;
        originsConfig.excludeValues = ['TLV', 'HFA'];
        this.selectedOriginFlightEilat = newOriginValue;
      }
    } else if (destinationValue === 'TLV') {
      // אם בחרו תל אביב בהלוך
      if (originsConfig) {
        // החזור = אילת, הסתר תל אביב וחיפה
        const newOriginValue = { label: 'אילת, נמל תעופה רמון', value: 'ETM' };
        originsConfig.value = newOriginValue;
        originsConfig.excludeValues = ['TLV', 'HFA'];
        this.selectedOriginFlightEilat = newOriginValue;
      }
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
      case ESharedInputType.DESTINATIONS_FLIGHTS_EILAT:
        if (value?.value === 'ETM') {
          // אם בחרו אילת - יש רק תל אביב בחזור, פתח תאריכון ישירות
          this.inputsRow?.openInputDelayed(ESharedInputType.ORIGINS_FLIGHTS_EILAT);
        } else {
          // אם בחרו חיפה או תל אביב - יש רק אילת בחזור, פתח תאריכון ישירות
          this.inputsRow?.openInputDelayed(ESharedInputType.PICKER_DATES);
        }
        break;
      case ESharedInputType.ORIGINS_FLIGHTS_EILAT:
        // תמיד פתח תאריכון אחרי בחירת חזור
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
    
    // עדכון סוג הטאב הנוכחי
    if (state.selectedChoice?.value) {
      this.currentTabType = state.selectedChoice.value;
    }
    
    // עדכון סוג המסלול (הלוך-חזור או כיוון אחד)
    if (state.selectedRouteType?.value) {
      this.selectedRouteType = state.selectedRouteType.value;
    }
  }

  override onFooterOptionChange(event: { value: string; checked: boolean }): void {
    super.onFooterOptionChange(event);
    if (event.value === 'add_flight') {
      this.addFlightSelected = event.checked;
    }
  }

  buildUrl(): string {
    // בדיקה איזה טאב נבחר
    if (this.currentTabType === 'flight_to_eilat') {
      // טיסות לאילת
      const queryParams = this.flightsToEilatManager.buildUrl({
        origin: this.selectedOriginFlightEilat,
        destination: this.selectedDestinationFlightEilat,
        dates: this.selectedDate,
        passengers: this.selectedPassengers,
        routeType: this.selectedRouteType
      });
      
      const productInfo = this.flightsToEilatManager.getProductPath();
      return BaseEngineService.buildRedirectUrl(
        productInfo.path, 
        queryParams, 
        productInfo.addResultLabel
      );
    } else if (this.currentTabType === 'flight_hotel_eilat') {
      // טיסה ומלון לאילת
      const queryParams = this.domesticVacationManager.buildUrl({
        destination: this.selectedDestinationFlightHotelEilat,
        dates: this.selectedDate,
        passengers: this.selectedPassengers,
        addFlight: true // תמיד עם טיסה
      });
      return BaseEngineService.buildRedirectUrl(this.config.productCode, queryParams);
    } else {
      // חופשה בארץ (ברירת מחדל)
      const queryParams = this.domesticVacationManager.buildUrl({
        destination: this.selectedDestination,
        dates: this.selectedDate,
        passengers: this.selectedPassengers,
        addFlight: this.addFlightSelected
      });
      return BaseEngineService.buildRedirectUrl(this.config.productCode, queryParams);
    }
  }
}
