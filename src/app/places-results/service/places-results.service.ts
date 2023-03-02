import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GoogleApiService } from 'src/app/shared/service/google-api-service';
import {
  DisplayedMarker,
  MapService,
} from 'src/app/shared/service/map.service';
import { SearchType } from '../places-results-table/model/search-type';

@Injectable({
  providedIn: 'root',
})
export class PlacesResultsService {
  private _nearbyRestaurantsSubj = new BehaviorSubject<
    google.maps.places.PlaceResult[]
  >([]);

  public nearbyRestaurants$ = this._nearbyRestaurantsSubj.asObservable();

  constructor(
    private _googleApiService: GoogleApiService,
    private _mapService: MapService
  ) {}

  public resolveResultsFromType(
    type: SearchType
  ): Observable<google.maps.places.PlaceResult[]> | undefined {
    switch (type) {
      case 'restaurant': {
        return this.nearbyRestaurants$;
      }
      default: {
        return;
      }
    }
  }

  public async nearbySearchFromPrediction(
    prediction: google.maps.places.AutocompletePrediction,
    type: SearchType
  ): Promise<void> {
    const result = await this._googleApiService.getPlaceDetailsWithId(
      prediction.place_id
    );
    if (!result) {
      return;
    }
    const geometry = result?.geometry;
    if (!geometry?.location?.lat || !geometry?.location?.lng) {
      return;
    }
    const resultLat = Number(geometry.location.lat);
    const resultLng = Number(geometry.location.lng);

    const nearbyRequest = {
      location: `${resultLat},${resultLng}`,
      radius: 1000,
      type: type,
    };

    const nearbyResults =
      await this._googleApiService.getNearbySearchFromRequest(nearbyRequest);

    if (!nearbyResults) {
      return;
    }

    this._nearbyRestaurantsSubj.next(nearbyResults);

    const coordinates = nearbyResults
      .map((result): DisplayedMarker | null =>
        this.fromPlaceResultToMarker(result)
      )
      .filter((marker): boolean => marker !== null) as DisplayedMarker[];
    this._mapService.updateMarkersOnMap(coordinates);
    const marker = this.fromPlaceResultToMarker(result);
    if (!marker) {
      return;
    }
    this._mapService.centerMapOnPosition(marker);
  }

  public clearAllResults(): void {
    this._nearbyRestaurantsSubj.next([]);
    this._mapService.updateMarkersOnMap([]);
  }

  private fromPlaceResultToMarker(
    result: google.maps.places.PlaceResult
  ): DisplayedMarker | null {
    const geometry = result?.geometry;
    if (!geometry?.location?.lat || !geometry?.location?.lng) {
      return null;
    }
    const resultLat = Number(geometry.location.lat);
    const resultLng = Number(geometry.location.lng);
    return { lat: resultLat, lng: resultLng, title: result.name ?? '' };
  }
}
