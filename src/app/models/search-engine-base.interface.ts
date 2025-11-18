

import { ESharedInputType } from '../enums/ESharedInputType';
import { SearchEngineConfig } from '../config/search-engine.config';
import { HeaderState } from '../components/issta-engine/shared/header/search-header/search-header.component';
import { InputConfig } from './input-config.model';

export interface ISearchEngine {

  readonly inputConfigs: InputConfig[];

  getConfig(): SearchEngineConfig;

  onInputPicked(event: { type: ESharedInputType; value: any }): void;

  onSearch(): void;
  
  buildUrl(): string;
  
  onHeaderStateChange?(state: HeaderState): void;

  onFooterOptionChange?(event: { value: string; checked: boolean }): void;
}
