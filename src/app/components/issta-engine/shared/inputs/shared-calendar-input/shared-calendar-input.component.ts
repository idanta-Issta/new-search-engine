import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedCalendarInputConfig } from '../../../../../interfaces/shared-calendar-input-config.interface';
import { SuggestedDate } from '../../../../../models/shared-calendar-input.model.ts';

@Component({
  selector: 'app-shared-calendar-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shared-calendar-input.component.html',
  styleUrls: ['./shared-calendar-input.component.scss']
})
export class SharedCalendarInputComponent implements OnInit {

  @Input() config!: SharedCalendarInputConfig;

  @Input() value?: Date;
  @Output() valueChange = new EventEmitter<Date>();

  selectedDate?: Date;
  selectedHour: string = '';

  ngOnInit(): void {
    // הגדרת ערך התחלתי אם יש
    if (this.value) {
      this.selectedDate = new Date(this.value);
    }
  }

  onDatePick(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (!value) return;

    const picked = new Date(value);

    this.selectedDate = picked;
    this.emitValue();
  }

  onHourPick(event: Event) {
    this.selectedHour = (event.target as HTMLInputElement).value;
    this.emitValue();
  }

  emitValue() {
    if (!this.selectedDate) return;

    const finalDate = new Date(this.selectedDate);

    if (this.config.allowPickHours && this.selectedHour) {
      const [h, m] = this.selectedHour.split(':').map(n => parseInt(n, 10));
      finalDate.setHours(h, m, 0, 0);
    }

    this.valueChange.emit(finalDate);
  }

  isSuggested(date: Date): SuggestedDate | null {
    return (
      this.config.suggestedDates.find(
        d => new Date(d.date).toDateString() === date.toDateString()
      ) || null
    );
  }
}
