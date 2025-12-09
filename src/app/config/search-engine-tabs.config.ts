import { AppExternalConfig } from './app.external.config';
import { SearchEngine } from '../models/search-engine.models';
import { ETypeSearchEngine } from '../enums/ETypeSearchEngine';

export function getSearchEngineTabsConfig(): SearchEngine {
  return {
    showTabs: true,
    defaultTab: { typeTravel: ETypeSearchEngine.ORGANIZED_TOURS, isPartial: false },
    tabs: [
      {
        title: "מתאים לי",
        imagePath: 'https://cstorage.zoomengage.com/images/19761202/za_a47e687e015d92d14.jpg',
        htmlUrl: "https://localhost:51565/umbraco/ComponentService/Components/ReloadComponent?componentName=Family",
        searchEngine: { typeTravel: ETypeSearchEngine.FORME, isPartial: false } // שנה את הסוג בהתאם
      },
      {
        title: "Issta Daniel",
           htmlUrl: "https://localhost:51565/umbraco/ComponentService/Components/ReloadComponent?componentName=Daniel",
        imagePath:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn0X7T2SpmQFqAgQL48yHnVomzyNTaiY109w&s",
        searchEngine: { typeTravel: ETypeSearchEngine.DANIEL, isPartial: false }
      },
      {
        title: "כפרי נופש",
        icon: 'icon-adult-room',
        searchEngine: { typeTravel: ETypeSearchEngine.VILLAGE_RESORTS, isPartial: false }
      },
      {
        title: "שייט",
        icon: 'icon-adult-room',
        searchEngine: { typeTravel: ETypeSearchEngine.CRUISE, isPartial: true },
        partialPath: "/partials/cruise-search.partial.html"
      },
      {
        title: "חבילות סקי",
        icon: 'icon-adult-room',
        searchEngine: { typeTravel: ETypeSearchEngine.SKI, isPartial: false }
      },
      {
        title: "השכרת רכב בחו\"ל",
        icon: 'icon-adult-room',
        searchEngine: { typeTravel: ETypeSearchEngine.CAR_RENTAL, isPartial: false }
      },
      {
        title: "טיולים מאורגנים",
        icon: 'icon-adult-room',
        searchEngine: { typeTravel: ETypeSearchEngine.ORGANIZED_TOURS, isPartial: false }
      },
      {
        title: "נופש בארץ",
        icon: 'icon-adult-room',
        searchEngine: { typeTravel: ETypeSearchEngine.DOMESTIC_VACATIONS, isPartial: false }
      },
      {
        title: "מלונות בחו\"ל",
        icon: 'icon-adult-room',
        searchEngine: { typeTravel: ETypeSearchEngine.HOTELS_ABROAD, isPartial: false }
      },
      {
        title: "טיסות",
        icon: 'icon-adult-room',
        searchEngine: { typeTravel: ETypeSearchEngine.FLIGHTS, isPartial: false }
      },
      {
        title: "חבילות ספורט",
        icon: 'icon-adult-room',
        searchEngine: { typeTravel: ETypeSearchEngine.SPORT, isPartial: false }
      },
      {
        title: "חבילות והופעות",
        icon: 'icon-adult-room',
        searchEngine: { typeTravel: ETypeSearchEngine.DYNAMIC_PACKAGES, isPartial: false }
      },
      {
        title: "דילים ברגע האחרון",
        icon: 'icon-adult-room',
        htmlUrl: "https://localhost:51565/umbraco/ComponentService/Components/ReloadComponent?componentName=HotDeals",
        searchEngine: { typeTravel: ETypeSearchEngine.FLIGHTS, isPartial: false }
      }
    ]
  };
}
