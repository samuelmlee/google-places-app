import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type DisplayedMarker = google.maps.LatLngLiteral & { title: string };

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private _googleMap: google.maps.Map | undefined;
  private _infoWindow: google.maps.InfoWindow | undefined;
  private displayedMarkersSubj = new BehaviorSubject<DisplayedMarker[]>([]);

  public displayedMarkers$ = this.displayedMarkersSubj.asObservable();

  public initMap(map: google.maps.Map): void {
    if (!map) {
      return;
    }
    this._googleMap = map;
    this._infoWindow = new google.maps.InfoWindow();
    this.centerOnBrowserPosition();
  }

  public centerMapOnPosition(latlng: { lat: number; lng: number }): void {
    this._googleMap?.setCenter(latlng);
  }

  public updateMarkersOnMap(locations: DisplayedMarker[]): void {
    this.displayedMarkersSubj.next(locations);
  }

  private centerOnBrowserPosition(): void {
    // Get browser geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition): void => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.centerMapOnPosition(pos);
        },
        (): void => {
          if (!this._googleMap) {
            return;
          }
          this.handleLocationError(true, this._googleMap.getCenter());
        }
      );
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
