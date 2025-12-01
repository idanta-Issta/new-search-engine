// src/app/shared/inputs/input-row/shared-input-row/shared-input-row.component.ts
import {
  Component,
  Input,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
  Output,
  EventEmitter,
  ComponentRef,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ESharedInputType } from '../../../../../../enums/ESharedInputType';
import { SharedInputRegistry } from '../../../../../../config/shared-input.registry';
import { EDropdownPosition } from '../../../../../../enums/EDropdownPosition';
import { InputConfig } from '../../../../../../models/input-config.model';
import { InputSizeHelper } from '../../../../../../utilies/input-size.helper';

type ValuesMap = Partial<Record<ESharedInputType, any>>;

@Component({
  selector: 'app-shared-input-row',
  templateUrl: './shared-input-row.component.html',
  styleUrls: ['./shared-input-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedInputRowComponent implements AfterViewInit, OnChanges {
  @Input() configs: InputConfig[] = [];
  @Input() buttonText = 'חיפוש';

  @Output() inputPicked = new EventEmitter<{ type: ESharedInputType; value: any }>();
  @Output() searchClicked = new EventEmitter<void>();

  @ViewChild('inputsContainer', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  private componentRefs = new Map<ESharedInputType, ComponentRef<any>>();
  private didInit = false;

  ngAfterViewInit(): void {
    this.renderInputs(); // פעם אחת
    this.didInit = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // למה: בונים מחדש רק אם ה-configs השתנו
    if (this.didInit && changes['configs']) {
      this.renderInputs();
    }
    // עדכון ערכים בלי לבנות מחדש
    if (this.didInit && !changes['configs']) {
      this.applyValuesToInstances();
    }
  }

  private async renderInputs(): Promise<void> {
    this.container.clear();
    this.componentRefs.clear();

    for (const config of this.configs) {
      const registryConfig = SharedInputRegistry[config.type];
      if (!registryConfig?.component) continue;

      // Handle lazy loading
      let componentClass: any = registryConfig.component;
      if (typeof componentClass === 'function' && componentClass.toString().includes('import(')) {
        // It's a lazy loader function
        componentClass = await componentClass();
      }

      const componentRef = this.container.createComponent(componentClass);
      const instance = componentRef.instance as any;

      instance.type = config.type;
      
      // העברת width מה-size
      instance.width = InputSizeHelper.getWidth(config.size);
      
      // העברת position
      instance.position = config.position;

      // העברת value
      if (config.value !== undefined) {
        instance.value = config.value;
      }

      // העברת excludeValues
      if (config.excludeValues !== undefined) {
        instance.excludeValues = config.excludeValues;
      }

      // העברת singleDateMode עבור קלנדר
      if (config.isOneWay !== undefined && 'singleDateMode' in instance) {
        instance.singleDateMode = config.isOneWay;
      }

      // הרשמה לאירוע אחד בלבד כדי למנוע כפילות
      if (instance.optionPicked?.subscribe) {
        instance.optionPicked.subscribe((value: any) =>
          this.inputPicked.emit({ type: config.type, value })
        );
      } else if (instance.valueChange?.subscribe) {
        instance.valueChange.subscribe((value: any) =>
          this.inputPicked.emit({ type: config.type, value })
        );
      }

      this.componentRefs.set(config.type, componentRef);
    }
  }

  private applyValuesToInstances(): void {
    this.configs.forEach(config => {
      const ref = this.componentRefs.get(config.type);
      if (ref) {
        const inst = ref.instance as any;
        // עדכון value
        if (config.value !== undefined && 'value' in inst) {
          inst.value = config.value;
        }
        
        // עדכון excludeValues
        if (config.excludeValues !== undefined && 'excludeValues' in inst) {
          inst.excludeValues = config.excludeValues;
        }
        
        // עדכון singleDateMode עבור קלנדר
        if (config.isOneWay !== undefined && 'singleDateMode' in inst) {
          inst.singleDateMode = config.isOneWay;
        }

        // עדכון dataConfig אם הקומפוננט תומך בכך (כמו קלנדר)
        if ('dataConfig' in inst) {
          const reg = SharedInputRegistry[config.type];
          if (reg && reg.dataConfig) {
            inst.dataConfig = reg.dataConfig;
            try {
              // If calendar component, ensure it re-renders with new suggestions
              const suggestions: any[] = reg.dataConfig.suggestedDates || [];
              if (Array.isArray(suggestions) && suggestions.length > 0) {
                const earliest = suggestions.map(s => new Date(s.date)).sort((a,b)=>a.getTime()-b.getTime())[0];
                if ('displayedMonthLeft' in inst) {
                  inst.displayedMonthLeft = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
                  inst.displayedMonthRight = new Date(inst.displayedMonthLeft.getFullYear(), inst.displayedMonthLeft.getMonth()+1, 1);
                }
              } else if (reg.dataConfig.minDate && 'displayedMonthLeft' in inst) {
                inst.displayedMonthLeft = new Date(reg.dataConfig.minDate.getFullYear(), reg.dataConfig.minDate.getMonth(), 1);
                inst.displayedMonthRight = new Date(inst.displayedMonthLeft.getFullYear(), inst.displayedMonthLeft.getMonth()+1, 1);
              }
              if ('renderCalendars' in inst && typeof inst.renderCalendars === 'function') {
                inst.renderCalendars();
                console.log('applyValuesToInstances: renderCalendars called for', config.type);
              }
            } catch (e) {
              // ignore
            }
          }
        }
        
        // עדכון isDisabled - תמיד, גם אם false
        if ('isDisabled' in inst) {
          inst['isDisabled'] = config.isDisabled ?? false;
        }
        // עדכון loadingSuggestions אם קיים
        if ('loadingSuggestions' in inst) {
          inst['loadingSuggestions'] = config.loadingSuggestions ?? false;
          console.log('applyValuesToInstances: loadingSuggestions for', config.type, '=>', inst['loadingSuggestions']);
        }
        
        ref.changeDetectorRef.detectChanges();
      }
    });
  }

  /** עדכון ערכים בלי לבנות מחדש את הקומפוננטים */
  updateValues(): void {
    this.applyValuesToInstances();
  }

  /**
   * Update only part of an instance's dataConfig (e.g., suggestedDates)
   * without rebuilding or applying the full configs list. This avoids
   * toggling default states (like closed) and keeps the instance open.
   */
  updateInstanceDataConfigPartial(type: ESharedInputType, partial: Partial<any>) {
    const ref = this.componentRefs.get(type);
    if (!ref) return;
    const inst = ref.instance as any;
    try {
      inst.dataConfig = inst.dataConfig || {};
      Object.assign(inst.dataConfig, partial);

      // If we updated suggestedDates, try to focus displayed months on earliest suggestion
      const suggestions: any[] = inst.dataConfig.suggestedDates || [];
      if (Array.isArray(suggestions) && suggestions.length > 0) {
        const earliest = suggestions.map(s => new Date(s.date)).sort((a,b)=>a.getTime()-b.getTime())[0];
        if ('displayedMonthLeft' in inst) {
          inst.displayedMonthLeft = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
          inst.displayedMonthRight = new Date(inst.displayedMonthLeft.getFullYear(), inst.displayedMonthLeft.getMonth()+1, 1);
        }
      }

      // Update other flags if provided
      if ('loadingSuggestions' in partial) inst['loadingSuggestions'] = (partial as any)['loadingSuggestions'];
      if ('isDisabled' in partial) inst['isDisabled'] = (partial as any)['isDisabled'];
      if ('value' in partial) inst['value'] = (partial as any)['value'];

      // Re-render calendar days only (no re-creation)
      if ('renderCalendars' in inst && typeof inst.renderCalendars === 'function') {
        inst.renderCalendars();
      }
      ref.changeDetectorRef.detectChanges();
    } catch (e) {
      // ignore errors and fallback to full update
      console.warn('updateInstanceDataConfigPartial failed for', type, e);
      this.applyValuesToInstances();
    }
  }

  /** פתיחה מתוכנתית מהסבא */
  openInput(type: ESharedInputType) {
    const ref = this.componentRefs.get(type);
    if (!ref) {
      console.warn(`לא נמצא רכיב מסוג ${type}`);
      return;
    }
    const inst = ref.instance as any;

    if (typeof inst.open === 'function') {
      inst.open();
      ref.changeDetectorRef.detectChanges();
      return;
    }
    if ('isOpen' in inst) {
      inst.isOpen = true;
      ref.changeDetectorRef.detectChanges();
      return;
    }
    console.warn(`הרכיב מסוג ${type} לא תומך בפתיחה מתוכנתית`);
  }

  /** פתיחה מתוכנתית עם דיליי - למנוע קונפליקט עם אירועי קליק */
  openInputDelayed(type: ESharedInputType, delay: number = 0) {
    setTimeout(() => this.openInput(type), delay);
  }
}
