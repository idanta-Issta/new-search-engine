import { Injectable } from '@angular/core';
import { ESharedInputType } from '../enums/ESharedInputType';
import { MenuOption } from '../models/shared-options-input.models';

@Injectable({
  providedIn: 'root'
})
export class DefaultMenuOptionsService {
  
  getDefaultMenuOptions(inputType: ESharedInputType): MenuOption[] | null {
    const registry: Partial<Record<ESharedInputType, MenuOption[]>> = {
      [ESharedInputType.DESTINATIONS_FLIGHTS_EILAT]: [
        { label: 'אילת, נמל תעופה רמון (ETM)', value: 'ETM' },
        { label: 'חיפה (HFA)', value: 'HFA' },
        { label: 'תל אביב, נתב"ג (TLV)', value: 'TLV' }
      ]
    };

    return registry[inputType] || null;
  }
}
