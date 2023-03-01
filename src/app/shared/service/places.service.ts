import { Injectable } from '@angular/core';
import { SearchType } from 'src/app/places-results/places-results-table/model/search-type';
import { GoogleApiService } from './google-api-service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _googleMap: google.maps.Map | undefined;

  constructor(private _googleApiService: GoogleApiService) {}

  public initMap(map: google.maps.Map): void {
    if (!map) {
      return;
    }
    this._googleMap = map;
  }

  public async nearbySearchFromPrediction(
    prediction: google.maps.places.AutocompletePrediction,
    type: SearchType
  ): Promise<google.maps.places.PlaceResult[]> {
    const result = await this._googleApiService.getPlaceDetailsWithId(
      prediction.place_id
    );
    if (!result) {
      return [];
    }
    const geometry = result?.geometry;

    const nearbyRequest = {
      location: geometry?.location,
      radius: 1000,
      type: type,
    };

    const nearbyResults =
      await this._googleApiService.getNearbySearchFromRequest(nearbyRequest);

    const detailPromises = (
      nearbyResults as google.maps.places.PlaceResult[]
    ).map((result): Promise<google.maps.places.PlaceResult | null> => {
      if (!result.place_id) {
        return Promise.resolve(null);
      }
      return this._googleApiService.getPlaceDetailsWithId(result.place_id);
    });
    const nearbyResultsDetails = (await Promise.all(
      detailPromises
    )) as google.maps.places.PlaceResult[];

    return nearbyResultsDetails;
  }
}
