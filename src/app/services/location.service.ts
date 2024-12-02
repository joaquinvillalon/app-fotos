import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private apiKey = '99ba8ee3ed374a7598f4e96269393105';

  constructor(private http: HttpClient) {}

  async getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    try {
      const position = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      return { latitude, longitude };
    } catch (error) {
      console.error('Error obteniendo la ubicación:', error);
      throw new Error('No se pudo obtener la ubicación.');
    }
  }
  

  async getCityAndCountry(lat: number, lng: number): Promise<{ city: string; country: string }> {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${this.apiKey}`;
    try {
      const response: any = await this.http.get(url).toPromise();
      const components = response.results[0].components;
      return {
        city: components.city || components.town || components.village || '',
        country: components.country || '',
      };
    } catch (error) {
      console.error('Error obteniendo la ciudad y el país:', error);
      throw new Error('No se pudo obtener la ubicación legible.');
    }
  }
}
