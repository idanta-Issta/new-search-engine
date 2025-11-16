import {
  Component,
  Input,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
} from '@angular/core';
import { ESharedInputType } from '../../../../../../enums/ESharedInputType';
import { SharedInputRegistry } from '../../../../../../config/shared-input.registry';


@Component({
  selector: 'app-shared-input-row',
  templateUrl: './shared-input-row.component.html',
  styleUrls: ['./shared-input-row.component.scss'],
})
export class SharedInputRowComponent implements AfterViewInit {
  @Input() inputs: ESharedInputType[] = [];
  @Input() buttonText = 'חיפוש';

  // כאן נוכל להעביר ערכים לפי טייפ
@Input() values: Partial<Record<ESharedInputType, any>> = {};


  @ViewChild('inputsContainer', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  ngAfterViewInit(): void {
    this.renderInputs();
  }

  private renderInputs(): void {
    this.container.clear();

    this.inputs.forEach((inputType) => {
      const config = SharedInputRegistry[inputType];
      if (!config?.component) return;

      const componentRef = this.container.createComponent(config.component);

      // העברת type
      (componentRef.instance as any).type = inputType;

      // העברת value (אם הוגדר ע"י האב)
      if (this.values[inputType] !== undefined) {
        (componentRef.instance as any).value = this.values[inputType];
      }

      // אם יש לך Outputs — אפשר גם להאזין להם כאן:
      // componentRef.instance.optionPicked?.subscribe(ev => this.onPicked(ev));
    });
  }

  // דוגמה ל־Output
  onPicked(ev: any) {
    console.log('Option picked:', ev);
  }
}
