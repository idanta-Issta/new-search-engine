export const AppExternalConfig = {
  baseUrl: 'http://test-external.issta.co.il/products/api/',
  mainSiteUrl: 'https://www.issta.co.il',
  endpoints: {
    flights: {
      origins: 'flights/populardestinations',
      destinations: 'flights/populardestinations',
      searchResultsPath: '/loader?url=flights/results.aspx'
    },
    hotels: {
      destinations: 'abroad-hotels/populardestinations',
      searchResultsPath: '/loader?url=hotels/results.aspx'
    },
    domesticVacation: {
      destinations: 'domestic-hotels/populardestinations',
      searchResultsPath: '/loader?url=domestic-vacation/results.aspx'
    },
    domesticDynamicPackages: {
      destinations: 'domestic-dynamic-packages/populardestinations'
    },
    cars: {
      rental: 'cars/popularrental'
    }
  }
};
