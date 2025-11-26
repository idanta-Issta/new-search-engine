import { Directive, ViewChild, ViewContainerRef, AfterViewInit, OnInit } from '@angular/core';
import { ESharedInputType } from '../../../enums/ESharedInputType';
import { SharedInputRowComponent } from '../shared/inputs/input-row/shared-input-row/shared-input-row.component';
import { ISearchEngine } from '../../../models/search-engine-base.interface';
import { SearchEngineConfig } from '../../../config/search-engine.config';
import { InputConfig } from '../../../models/input-config.model';
import { BaseEngineService } from '../../../services/engine.service';
import { ComponentManager } from '../../../managers/component.manager';
import { HeaderState } from '../shared/header/search-header/search-header.component';


@Directive()
export abstract class BaseEngineComponent implements ISearchEngine, OnInit, AfterViewInit {
  @ViewChild('inputsRow') inputsRow?: SharedInputRowComponent;
  @ViewChild('customContainer', { read: ViewContainerRef })
  set customContainer(container: ViewContainerRef | undefined) {
    if (container) {
      this.componentManager = new ComponentManager(container);
    }
  }

  activeHeader: any;
  activeFooter: any;
  inputConfigs: InputConfig[] = [];
  isTransitioning = false;
  hasCustomComponent = false;
  headerState: HeaderState = {};
  footerState: { [key: string]: boolean } = {};

  get header() {
    return this.activeHeader;
  }

  get footer() {
    return this.activeFooter;
  }

  protected componentManager?: ComponentManager;
  protected abstract config: SearchEngineConfig;

  constructor(protected engineService: BaseEngineService) {}

  ngOnInit(): void {
    this.activeHeader = this.config.header;
    this.activeFooter = this.config.footer;
    this.inputConfigs = [...(this.config.inputs || [])];
    this.engineService.initialize(this.config);
  }

  ngAfterViewInit(): void {
    this.loadDefaultEngine();
  }

  private async loadDefaultEngine(): Promise<void> {
    const defaultEngine = this.engineService.getDefaultEngine();
    if (defaultEngine) {
      this.applyEngine(defaultEngine);
      await this.loadCustomComponent(defaultEngine.customComponent);
      // אפשר לילדים לאתחל אחרי שהמנוע נטען
      this.onEngineLoaded();
    }
  }  onInputPicked(event: { type: ESharedInputType; value: any }): void {
    this.updateValue(event.type, event.value);
    const config = this.inputConfigs.find(c => c.type === event.type);
    if (config) {
      config.value = event.value;
    }

    this.openNextInput(event.type, event.value);
  }


  protected abstract updateValue(type: ESharedInputType, value: any): void;

  protected abstract openNextInput(type: ESharedInputType, value: any): void;

  onHeaderStateChange(state: HeaderState): void {
    this.headerState = state;
    
    const targetEngine =
      state.selectedChoice?.useEngine ||
      state.selectedTripType?.useEngine ||
      state.selectedClass?.useEngine ||
      null;

    if (this.engineService.shouldSwitch(targetEngine)) {
      this.switchEngine(targetEngine);
    }
  }

  onFooterOptionChange(event: { value: string; checked: boolean }): void {
    this.footerState[event.value] = event.checked;
  }

  private switchEngine(targetEngine: any): void {
    this.animateTransition(async () => {
      const result = targetEngine
        ? this.engineService.switchTo(targetEngine)
        : this.engineService.resetToOriginal();

      this.applyEngine(result);
      await this.loadCustomComponent(result.customComponent);
      this.onEngineLoaded();
    });
  }

  private async loadCustomComponent(component: any): Promise<void> {
    if (!component || !this.componentManager) {
      this.componentManager?.clear();
      this.hasCustomComponent = false;
      return;
    }

    const ref = await this.componentManager.load(component);

    if (ref) {
      const instance = ref.instance;

      if (instance.inputConfigs !== undefined) {
        instance.inputConfigs = this.inputConfigs;
      }
      instance.inputPicked?.subscribe((e: any) => this.onInputPicked(e));
      instance.searchClicked?.subscribe(() => this.onSearch());

      this.hasCustomComponent = true;
    }
  }


  onSearch(): void {
    const url = this.buildUrl();
    if (url) {
      window.open(url, '_blank');
    }
  }

  abstract buildUrl(): string;

  private applyEngine(result: any): void {
    this.activeHeader = result.header;
    this.activeFooter = result.footer;
    this.inputConfigs = result.inputs;
  }

  /** Hook לילדים: נקרא אחרי שמנוע נטען (default או החלפה) */
  protected onEngineLoaded(): void {
    // קומפוננטים ילדים יכולים לעשות override
  }

  private animateTransition(callback: () => void): void {
    this.isTransitioning = true;
    setTimeout(() => {
      callback();
      setTimeout(() => (this.isTransitioning = false), 20);
    }, 150);
  }

  getConfig(): SearchEngineConfig {
    return this.config;
  }
}
