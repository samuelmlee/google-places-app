import { Injectable } from '@angular/core';

const CONFIG_DB = {
  getHouses: '/api/programming-assessment-1.0/buildings',
};

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  getUrl(api: keyof typeof CONFIG_DB): string {
    return CONFIG_DB[api];
  }
}
