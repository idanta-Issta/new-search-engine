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
      destinations: 'hotels/populardestinations',
      searchResultsPath: '/loader?url=hotels/results.aspx'
    },
    cars: {
      rental: 'cars/popularrental'
    }
  }
};
