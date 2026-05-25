export class ExternalWeatherAPI {
  getTemperature(city: string): string {
    let temp = 30; // default
    const normalized = city.toLowerCase().trim();
    if (normalized === "mumbai") temp = 32;
    else if (normalized === "nagpur") temp = 42;
    else if (normalized === "pune") temp = 28;
    else if (normalized === "delhi") temp = 35;
    else {
      temp = 20 + (city.length % 15);
    }
    return `Temperature in ${city} is ${temp}°C`;
  }
}
