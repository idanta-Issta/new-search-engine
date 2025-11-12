export const AppExternalConfig = {
  baseUrl: 'http://test-external.issta.co.il/products/api/',
  endpoints: {
    flights: {
      origins: 'flights/populardestinations',
      destinations: 'flights/populardestinations'
    },
    hotels: {
      destinations: 'hotels/populardestinations'
    },
    cars: {
      rental: 'cars/popularrental'
    }
  }
};
