export interface CarSearchParams {
  pickupCountry: any;
  pickupCity: any;
  returnCity: any;
  dates: { start: Date | null; end: Date | null; startTime?: string; endTime?: string } | null;
  driverAge: number | null;
}

export class CarManager {
  buildUrl(params: CarSearchParams): string {
    const queryParams: string[] = [];

    // Pickup date
    if (params.dates?.start) {
      const pickupDate = this.formatDate(params.dates.start);
      queryParams.push(`pickupdate=${pickupDate}`);
    }

    // Dropoff date
    if (params.dates?.end) {
      const dropoffDate = this.formatDate(params.dates.end);
      queryParams.push(`dropoffdate=${dropoffDate}`);
    }

    // Country code
    if (params.pickupCountry?.CountryCode) {
      queryParams.push(`countrycode=${params.pickupCountry.CountryCode}`);
    }

    // Pickup destination code (fdestinationcode)
    if (params.pickupCity?.DestinationCode) {
      queryParams.push(`fdestinationcode=${params.pickupCity.DestinationCode}`);
    }

    // Return destination code (tdestinationcode)
    if (params.returnCity?.DestinationCode) {
      queryParams.push(`tdestinationcode=${params.returnCity.DestinationCode}`);
    }

    // Pickup time
    if (params.dates?.startTime) {
      queryParams.push(`pickuptime=${params.dates.startTime}`);
    }

    // Dropoff time
    if (params.dates?.endTime) {
      queryParams.push(`dropofftime=${params.dates.endTime}`);
    }

    // Driver age
    if (params.driverAge) {
      queryParams.push(`age=${params.driverAge}`);
    }

    return queryParams.join('&');
  }

  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }

  getProductPath(): { path: string; addResultLabel: boolean } {
    return {
      path: 'car/results.aspx',
      addResultLabel: false
    };
  }
}
