import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GoogleApiService } from './google-api-service';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private _googleMap: google.maps.Map | undefined;
  private _infoWindow: google.maps.InfoWindow | undefined;
  private displayedLocationsSubj = new BehaviorSubject<google.maps.LatLng[]>(
    []
  );

  public displayedLocations$ = this.displayedLocationsSubj.asObservable();

  constructor(private _googleApiService: GoogleApiService) {}

  public initMap(map: google.maps.Map): void {
    if (!map) {
      return;
    }
    this._googleMap = map;
    this._infoWindow = new google.maps.InfoWindow();
    this.centerOnUserPosition();
  }

  private centerOnUserPosition(): void {
    // Get browser geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition): void => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this._googleMap?.setCenter(pos);
        },
        (): void => {
          if (!this._googleMap) {
            return;
          }
          this.handleLocationError(true, this._googleMap.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      if (!this._googleMap) {
        return;
      }
      this.handleLocationError(false, this._googleMap.getCenter());
    }
  }

  private handleLocationError(
    browserHasGeolocation: boolean,
    pos: google.maps.LatLng | undefined
  ): void {
    this._infoWindow?.setPosition(pos);
    this._infoWindow?.setContent(
      browserHasGeolocation
        ? 'Error: The Geolocation service failed.'
        : "Error: Your browser doesn't support geolocation."
    );
    this._infoWindow?.open(this._googleMap);
  }
}
