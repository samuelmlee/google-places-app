import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Observable } from 'rxjs';
import { GoogleApiService } from './shared/service/google-api-service';
import { DisplayedMarker, MapService } from './shared/service/map.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public markers$: Observable<DisplayedMarker[]> | undefined;
  public mapApiLoaded: Observable<boolean> | undefined;

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
    this.markers$ = this._mapService.displayedMarkers$;
  }
}
