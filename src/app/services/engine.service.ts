import { Injectable } from '@angular/core';
import { SearchEngineConfig, ENGINE_REGISTRY } from '../config/search-engine.config';
import { ETypeSearchEngine } from '../enums/ETypeSearchEngine';
import { InputConfig } from '../models/input-config.model';


export interface EngineResult {
  header: any;
  footer: any;
  inputs: InputConfig[];
  customComponent: any;
}

@Injectable({
  providedIn: 'root'
})
export class BaseEngineService {
  private originalConfig: SearchEngineConfig | null = null;
  private currentEngine: ETypeSearchEngine | null = null;


  initialize(config: SearchEngineConfig): void {
    this.originalConfig = config;
    this.currentEngine = null;
  }

  
  getDefaultEngine(): EngineResult | null {
    if (!this.originalConfig) return null;

    const defaultChoice = this.originalConfig.header.choices?.find(c => c.isDefault);
    const defaultTripType = this.originalConfig.header.tripTypeOptions?.find(t => t.isDefault);
    const defaultClass = this.originalConfig.header.classOptions?.find(c => c.isDefault);

    const defaultEngine = 
      defaultChoice?.useEngine || 
      defaultTripType?.useEngine || 
      defaultClass?.useEngine || 
      null;

    if (defaultEngine && defaultEngine !== this.originalConfig.engineType) {
      return this.switchTo(defaultEngine);
    }

    return null;
  }


  switchTo(targetEngine: ETypeSearchEngine): EngineResult {
    if (!this.originalConfig) {
      throw new Error('EngineService not initialized. Call initialize() first.');
    }

    const targetConfig = ENGINE_REGISTRY[targetEngine];
    
    if (!targetConfig) {
      console.warn(`Engine type ${targetEngine} not found in registry`);
      return {
        header: this.originalConfig.header,
        footer: this.originalConfig.footer,
        inputs: [...(this.originalConfig.inputs || [])],
        customComponent: this.originalConfig.customInputsComponent
      };
    }
    
    this.currentEngine = targetEngine;
    
    return {
      header: {
        ...targetConfig.header,
        choices: this.originalConfig.header.choices
      },
      footer: targetConfig.footer,
      inputs: [...(targetConfig.inputs || [])],
      customComponent: targetConfig.customInputsComponent
    };
  }

  resetToOriginal(): EngineResult {
    if (!this.originalConfig) {
      throw new Error('EngineService not initialized. Call initialize() first.');
    }

    this.currentEngine = null;
    
    return {
      header: this.originalConfig.header,
      footer: this.originalConfig.footer,
      inputs: [...(this.originalConfig.inputs || [])],
      customComponent: null
    };
  }


  shouldSwitch(targetEngine: ETypeSearchEngine | null): boolean {
    return targetEngine !== this.currentEngine;
  }


  getCurrentEngine(): ETypeSearchEngine | null {
    return this.currentEngine;
  }

  reset(): void {
    this.originalConfig = null;
    this.currentEngine = null;
  }
}
