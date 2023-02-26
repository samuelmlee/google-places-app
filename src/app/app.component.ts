import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { PlacesService } from './shared/service/places.service';

export const API_KEY = 'AIzaSyB7Mli9ai8l5sRgTwXfZTdOPaZ7YwS1Csk';

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
    this._placesService.initServices(map.googleMap);
  }

  constructor(
    private _placesService: PlacesService,
    private _httpClient: HttpClient
  ) {
    this.mapApiLoaded = _httpClient
      .jsonp(
        `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`,
        'callback'
      )
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }
}
