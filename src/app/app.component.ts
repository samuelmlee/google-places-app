import { Component, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { BehaviorSubject, Observable } from 'rxjs';
import { GoogleApiService } from './shared/service/google-api-service';
import { MapService } from './shared/service/map.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private _locationsSubj = new BehaviorSubject<google.maps.LatLng[]>([]);

  public mapApiLoaded: Observable<boolean> | undefined;
  public locations$ = this._locationsSubj.asObservable();

  @ViewChild('googleMap') set googleMap(map: GoogleMap) {
    if (!map?.googleMap) {
      return;
    }
    this._mapService.initMap(map.googleMap);
  }

  constructor(
    private _mapService: MapService,
    googleApiService: GoogleApiService
  ) {
    this.mapApiLoaded = googleApiService.loadGoogleMapsApi();
  }
}
