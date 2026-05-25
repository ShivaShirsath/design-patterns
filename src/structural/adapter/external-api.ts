export class ExternalWeatherAPI {
  getTemperature(city: string): string {
    return `Temperature in ${city} is 32°C`;
  }
}
