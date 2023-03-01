import { Component, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { BehaviorSubject, Observable } from 'rxjs';
import { GoogleApiService } from './shared/service/google-api-service';
import { PlacesService } from './shared/service/places.service';

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
    this._placesService.initMap(map.googleMap);
  }

  constructor(
    private _placesService: PlacesService,
    googleApiService: GoogleApiService
  ) {
    this.mapApiLoaded = googleApiService.loadGoogleMapsApi();
  }
}
