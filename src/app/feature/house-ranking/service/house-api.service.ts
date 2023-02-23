import { Injectable } from '@angular/core';
import { HousesDto } from '../model/houses-dto';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../config.service';

@Injectable({
  providedIn: 'root',
})
export class HouseApi {
  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {}

  /**
   * Request to get house details
   */
  getHouses(): Promise<HousesDto | undefined> {
    const housesUrl = this.configService.getUrl('getHouses');
    return this.httpClient.get<HousesDto>(housesUrl).toPromise();
  }
}
