import { ExternalWeatherAPI } from "./external-api";
import { WeatherService } from "./weather.interface";

export class WeatherAdapter implements WeatherService {
  constructor(
    private externalAPI: ExternalWeatherAPI
  ) {}

  fetch(city: string): string {
    return this.externalAPI.getTemperature(city);
  }
}
