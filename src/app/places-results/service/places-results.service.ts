import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlacesService } from 'src/app/shared/service/places.service';
import { SearchType } from '../places-results-table/model/search-type';

@Injectable({
  providedIn: 'root',
})
export class PlacesResultsService {
  private _nearbyRestaurantsSubj = new BehaviorSubject<
    google.maps.places.PlaceResult[]
  >([]);

  public nearbyRestaurants$ = this._nearbyRestaurantsSubj.asObservable();

  constructor(private _placesService: PlacesService) {}

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
    prediction: google.maps.places.AutocompletePrediction
  ): Promise<void> {
    const placeResults = await this._placesService.nearbySearchFromPrediction(
      prediction,
      'restaurant'
    );
    this._nearbyRestaurantsSubj.next(placeResults);
  }

  public clearAllResults(): void {
    this._nearbyRestaurantsSubj.next([]);
  }
}
