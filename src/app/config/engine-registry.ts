import { ETypeSearchEngine } from '../enums/ETypeSearchEngine';
import { SearchEngineConfig } from './search-engine.config';
import { FLIGHTS_CONFIG, HOTEL_ABROAD_CONFIG, FLIGHTS_MULTI_DESTINATIONS_CONFIG } from './search-engine.config';


const ALL_CONFIGS: SearchEngineConfig[] = [
  FLIGHTS_CONFIG,
  HOTEL_ABROAD_CONFIG,
  FLIGHTS_MULTI_DESTINATIONS_CONFIG
];

export const ENGINE_REGISTRY: Partial<Record<ETypeSearchEngine, SearchEngineConfig>> = 
  ALL_CONFIGS.reduce((registry, config) => {
    registry[config.engineType] = config;
    return registry;
  }, {} as Partial<Record<ETypeSearchEngine, SearchEngineConfig>>);

export function switchToEngine(
  engineType: ETypeSearchEngine,
  originalConfig: SearchEngineConfig
): { header: any; footer: any; inputs: any[]; customComponent?: any } {
  const targetConfig = ENGINE_REGISTRY[engineType];
  
  if (!targetConfig) {
    console.warn(`Engine type ${engineType} not found in registry`);
    return {
      header: originalConfig.header,
      footer: originalConfig.footer,
      inputs: [...originalConfig.inputs],
      customComponent: originalConfig.customInputsComponent
    };
  }
  
  return {
    header: {
      ...targetConfig.header,
      choices: originalConfig.header.choices
    },
    footer: targetConfig.footer,
    inputs: [...targetConfig.inputs],
    customComponent: targetConfig.customInputsComponent
  };
}
