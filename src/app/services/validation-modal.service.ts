import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ValidationError {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ValidationModalService {
  private openSubject = new BehaviorSubject<boolean>(false);
  private errorsSubject = new BehaviorSubject<ValidationError[]>([]);

  public open$ = this.openSubject.asObservable();
  public errors$ = this.errorsSubject.asObservable();

  showErrors(errors: ValidationError[]) {
    this.errorsSubject.next(errors);
    this.openSubject.next(true);
  }

  close() {
    this.openSubject.next(false);
    this.errorsSubject.next([]);
  }
}
