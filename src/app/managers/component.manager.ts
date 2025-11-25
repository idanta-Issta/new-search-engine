import { ComponentRef, ViewContainerRef } from '@angular/core';

/**
 * Manager לניהול קומפוננטות דינמיות
 * פשוט - טוען ומנקה קומפוננטות
 */
export class ComponentManager {
  private componentRef: ComponentRef<any> | null = null;

  constructor(private container: ViewContainerRef) {}

  /**
   * טעינת קומפוננטה
   */
  async load(component: any): Promise<ComponentRef<any> | null> {
    this.clear();

    if (!component || !this.container) {
      return null;
    }

    // אם זו Promise (lazy loading)
    if (typeof component === 'function') {
      const componentClass = await component();
      this.componentRef = this.container.createComponent(componentClass);
    } else {
      this.componentRef = this.container.createComponent(component);
    }

    return this.componentRef;
  }

  /**
   * ניקוי
   */
  clear(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
    this.container?.clear();
  }

  /**
   * קבלת instance
   */
  getInstance(): any | null {
    return this.componentRef?.instance ?? null;
  }
}
