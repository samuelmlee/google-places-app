import { Injectable } from '@angular/core';
import { GoogleApiService } from './google-api-service';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private _googleMap: google.maps.Map | undefined;

  constructor(private _googleApiService: GoogleApiService) {}

  public initMap(map: google.maps.Map): void {
    if (!map) {
      return;
    }
    this._googleMap = map;
  }
}
