import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GoogleApiService } from 'src/app/shared/service/google-api-service';
import { SearchType } from '../places-results-table/model/search-type';

@Injectable({
  providedIn: 'root',
})
export class PlacesResultsService {
  private _nearbyRestaurantsSubj = new BehaviorSubject<
    google.maps.places.PlaceResult[]
  >([]);

  public nearbyRestaurants$ = this._nearbyRestaurantsSubj.asObservable();

  constructor(private _googleApiService: GoogleApiService) {}

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

    const nearbyRequest = {
      location: `${geometry?.location?.lat},${geometry?.location?.lng}`,
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

    this._nearbyRestaurantsSubj.next(nearbyResultsDetails);
  }

  public clearAllResults(): void {
    this._nearbyRestaurantsSubj.next([]);
  }
}
