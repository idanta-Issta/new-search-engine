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

type ValuesMap = Partial<Record<ESharedInputType, any>>;

@Component({
  selector: 'app-shared-input-row',
  templateUrl: './shared-input-row.component.html',
  styleUrls: ['./shared-input-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedInputRowComponent implements AfterViewInit, OnChanges {
  @Input() inputs: ESharedInputType[] = [];
  @Input() buttonText = 'חיפוש';
  @Input() widths: Partial<Record<ESharedInputType, string>> = {};

  // למה: נעדכן ערכים לתוך אינסטנסים בלי להרוס ולבנות
  @Input() values: ValuesMap = {};

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
    // למה: אם רק values השתנה → לעדכן ערכים בלי להרוס קומפוננטות
    if (this.didInit && changes['values'] && !changes['inputs']) {
      this.applyValuesToInstances();
    }
    // למה: בונים מחדש רק אם רשימת ה-inputs עצמה השתנתה (by reference)
    if (this.didInit && changes['inputs']) {
      this.renderInputs();
    }
  }

  private renderInputs(): void {
    this.container.clear();
    this.componentRefs.clear();

    this.inputs.forEach((inputType) => {
      const config = SharedInputRegistry[inputType];
      if (!config?.component) return;

      const componentRef = this.container.createComponent(config.component);
      const instance = componentRef.instance as any;

      instance.type = inputType;

      // העברת width אם קיים
      if (this.widths[inputType]) {
        instance.width = this.widths[inputType];
      }

      if (this.values[inputType] !== undefined) {
        instance.value = this.values[inputType];
      }

      // הרשמה לאירוע אחד בלבד כדי למנוע כפילות
      if (instance.optionPicked?.subscribe) {
        instance.optionPicked.subscribe((value: any) =>
          this.inputPicked.emit({ type: inputType, value })
        );
      } else if (instance.valueChange?.subscribe) {
        instance.valueChange.subscribe((value: any) =>
          this.inputPicked.emit({ type: inputType, value })
        );
      }

      this.componentRefs.set(inputType, componentRef);
    });
  }

  private applyValuesToInstances(): void {
    for (const [type, ref] of this.componentRefs.entries()) {
      const inst = ref.instance as any;
      if (this.values[type] !== undefined) {
        inst.value = this.values[type];
        ref.changeDetectorRef.detectChanges();
      }
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
