import { EInputSize } from '../enums/EInputSize';

export class InputSizeHelper {
  private static readonly sizeMap: Record<EInputSize, string> = {
    [EInputSize.SMALL]: '150px',
    [EInputSize.MEDIUM]: '200px',
    [EInputSize.LARGE]: '300px',
    [EInputSize.HUGE]: '400px'
  };

  static getWidth(size: EInputSize): string {
    return this.sizeMap[size];
  }

  static getFlexBasis(size: EInputSize): string {
    return `flex: ${this.getFlexGrow(size)} 1 ${this.getWidth(size)}`;
  }

  private static getFlexGrow(size: EInputSize): number {
    const growMap: Record<EInputSize, number> = {
      [EInputSize.SMALL]: 0,
      [EInputSize.MEDIUM]: 1,
      [EInputSize.LARGE]: 2,
      [EInputSize.HUGE]: 3
    };
    return growMap[size];
  }
}
