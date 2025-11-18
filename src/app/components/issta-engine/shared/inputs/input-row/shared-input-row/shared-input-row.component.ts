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

  private renderInputs(): void {
    this.container.clear();
    this.componentRefs.clear();

    this.configs.forEach((config) => {
      const registryConfig = SharedInputRegistry[config.type];
      if (!registryConfig?.component) return;

      const componentRef = this.container.createComponent(registryConfig.component);
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
    });
  }

  private applyValuesToInstances(): void {
    this.configs.forEach(config => {
      const ref = this.componentRefs.get(config.type);
      if (ref && config.value !== undefined) {
        const inst = ref.instance as any;
        inst.value = config.value;
        ref.changeDetectorRef.detectChanges();
      }
    });
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
