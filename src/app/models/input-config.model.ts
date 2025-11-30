import { ESharedInputType } from '../enums/ESharedInputType';
import { EInputSize } from '../enums/EInputSize';
import { EDropdownPosition } from '../enums/EDropdownPosition';

export interface InputConfig {
  type: ESharedInputType;
  size: EInputSize;
  position: EDropdownPosition;
  value?: any;
  excludeValues?: string[];
  isOneWay?: boolean;
  isDisabled?: boolean;
  loadingText?: string;
}
