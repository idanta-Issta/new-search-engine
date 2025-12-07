import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ESharedInputType } from '../../../../enums/ESharedInputType';
import { SharedInputRowComponent } from '../../shared/inputs/input-row/shared-input-row/shared-input-row.component';
import { PassangersInput } from '../../../../models/shared-passanger-input.models';
import { SearchFooterComponent } from '../../shared/footer/search-footer/search-footer.component';
import { SearchHeaderComponent } from '../../shared/header/search-header/search-header.component';
import { SPORT_CONFIG } from '../../../../config/search-engine.config';
import { BaseEngineComponent } from '../base-engine.component';
import { BaseEngineService } from '../../../../services/engine.service';
import { HotelsManager } from '../../../../managers/hotels.manager';
import { AppExternalConfig } from '../../../../config/app.external.config';
import { HttpClient } from '@angular/common/http';
import { SportMapper } from '../../../../mappers/sport.mapper';
import { SharedOptionsService } from '../../../../services/shared-options.service';
import { SportManager } from '../../../../managers/sport.manager';

@Component({
  selector: 'app-sport',
  standalone: true,
  imports: [CommonModule, SharedInputRowComponent, SearchFooterComponent, SearchHeaderComponent],
  templateUrl: './sport.component.html',
})
export class SportComponent extends BaseEngineComponent {
  protected config = SPORT_CONFIG;
  private manager = new SportManager();

  selectedEventType: any = null;
  selectedLeague: any = null;
  selectedTeam: any = null;
  selectedMonth: any = null;

  constructor(
    engineService: BaseEngineService,
    private http: HttpClient,
    private optionsService: SharedOptionsService
  ) {
    super(engineService);
  }

  protected updateValue(type: ESharedInputType, value: any): void {
    switch (type) {
      case ESharedInputType.SPORT_EVENT_TYPE:
        this.selectedEventType = value;
        break;
      case ESharedInputType.SPORT_LEAGUES:
        this.selectedLeague = value;
        
        const teamsInput = this.inputConfigs.find(c => c.type === ESharedInputType.SPORT_TEAMS);
        if (teamsInput) {
          teamsInput.value = { label: 'טוען קבוצות...', key: 'loading' };
          teamsInput.isDisabled = true;
        }
        this.selectedTeam = { label: 'טוען קבוצות...', key: 'loading' };
      
        this.inputsRow?.updateValues();
        
        this.loadTeamsForLeague(value?.key);
        break;
      case ESharedInputType.SPORT_TEAMS:
        this.selectedTeam = value;
        break;
      case ESharedInputType.DATES_PICKER_MONTHS:
        this.selectedMonth = value;
        break;
    }
  }

  private loadTeamsForLeague(leagueCode: string) {
    if (!leagueCode || leagueCode === 'all') {
      const teamsInput = this.inputConfigs.find(c => c.type === ESharedInputType.SPORT_TEAMS);
      if (teamsInput) {
        teamsInput.value = { label: 'כל הקבוצות', key: 'all' };
        teamsInput.isDisabled = false;
      }
      this.selectedTeam = { label: 'כל הקבוצות', key: 'all' };
      
      import('../../../../config/shared-input.registry').then(module => {
        const registry = module.SharedInputRegistry;
        if (registry[ESharedInputType.SPORT_TEAMS]) {
          delete registry[ESharedInputType.SPORT_TEAMS].requestUrl;
        }
      });
      
      this.inputsRow?.updateValues();
      return;
    }

    const url = `${AppExternalConfig.baseUrl}sport/teams?leagueCode=${leagueCode}`;
    
    this.http.get<any>(url).subscribe({
      next: (response) => {
        this.optionsService.clearCacheForType(ESharedInputType.SPORT_TEAMS);
        
        import('../../../../config/shared-input.registry').then(module => {
          const registry = module.SharedInputRegistry;
          if (registry[ESharedInputType.SPORT_TEAMS]) {
            registry[ESharedInputType.SPORT_TEAMS].requestUrl = url;
          }
        });
        
        const teamsInput = this.inputConfigs.find(c => c.type === ESharedInputType.SPORT_TEAMS);
        if (teamsInput) {
          teamsInput.value = { label: 'כל הקבוצות', key: 'all' };
          teamsInput.isDisabled = false;
        }
        this.selectedTeam = { label: 'כל הקבוצות', key: 'all' };
        this.inputsRow?.updateValues();
      },
      error: (err) => {
        console.error('Failed to load teams:', err);
        const teamsInput = this.inputConfigs.find(c => c.type === ESharedInputType.SPORT_TEAMS);
        if (teamsInput) {
          teamsInput.value = { label: 'שגיאה בטעינה', key: 'error' };
          teamsInput.isDisabled = false;
        }
        this.inputsRow?.updateValues();
      }
    });
  }

  protected openNextInput(type: ESharedInputType, value: any): void {
    switch (type) {
      case ESharedInputType.SPORT_EVENT_TYPE:
        this.inputsRow?.openInputDelayed(ESharedInputType.SPORT_LEAGUES);
        break;
      case ESharedInputType.SPORT_TEAMS:
        if (value) {
          this.inputsRow?.openInputDelayed(ESharedInputType.DATES_PICKER_MONTHS);
        }
        break;
    }
  }

  buildUrl(): string {
    const queryParams = this.manager.buildUrl({
      eventType: this.selectedEventType,
      league: this.selectedLeague,
      team: this.selectedTeam,
      month: this.selectedMonth
    });
    return BaseEngineService.buildRedirectUrl(this.config.productCode, queryParams);
  }
}
