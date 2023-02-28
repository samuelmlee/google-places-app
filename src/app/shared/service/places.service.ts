import { Injectable } from '@angular/core';
import { SearchType } from 'src/app/places-results/places-results-table/model/search-type';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _googleMap: google.maps.Map | undefined;
  private _placesService: google.maps.places.PlacesService | undefined;
  private _autocompleteService:
    | google.maps.places.AutocompleteService
    | undefined;

  public initServices(map: google.maps.Map): void {
    if (!map) {
      return;
    }
    this._googleMap = map;
    this._autocompleteService = new google.maps.places.AutocompleteService();
    this._placesService = new google.maps.places.PlacesService(map);
    this.centerOnPlaceDescription('Alexanderplatz');
  }

  public centerOnPlaceDescription(
    query: string,
    locationBias?: google.maps.places.LocationBias
  ): void {
    const request: google.maps.places.FindPlaceFromQueryRequest = {
      locationBias,
      fields: ['name', 'geometry'],
      query,
    };
    this._placesService?.findPlaceFromQuery(
      request,
      (results, status): void => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          if (!results[0] || !results[0]?.geometry?.location) {
            return;
          }
          this._googleMap?.setCenter(results[0].geometry.location);
        }
      }
    );
  }

  public async getPlacePredictions(
    address: string
  ): Promise<google.maps.places.AutocompletePrediction[]> {
    const request = {
      input: address,
      componentRestrictions: { country: 'de' },
      types: ['geocode'],
    };
    try {
      const response = await this._autocompleteService?.getPlacePredictions(
        request
      );
      return response?.predictions ?? [];
    } catch (error) {
      console.log('Error retrieving suggestions :', error);
      return [];
    }
  }

  public async nearbySearchFromPrediction(
    prediction: google.maps.places.AutocompletePrediction,
    type: SearchType
  ): Promise<google.maps.places.PlaceResult[]> {
    const placeResult = await this.getPlaceDetailsWithId(prediction.place_id);
    const geometry = (placeResult as google.maps.places.PlaceResult).geometry;

    const nearbyRequest = {
      location: geometry?.location,
      radius: 1000,
      type: type,
    };

    const nearbyResults = await new Promise((resolve): void =>
      this._placesService?.nearbySearch(
        nearbyRequest,
        (results: google.maps.places.PlaceResult[] | null): void =>
          resolve(results)
      )
    );

    // if more than 8 requests sent per minute, will get OVER_QUERY_LIMIT status for placesService.getDetails
    // const limitedNearbyResults = (
    //   nearbyResults as google.maps.places.PlaceResult[]
    // ).slice(0, 20);

    // const detailPromises = limitedNearbyResults.map(
    //   (result): Promise<google.maps.places.PlaceResult | null> => {
    //     if (!result.place_id) {
    //       return Promise.resolve(null);
    //     }
    //     return this.getPlaceDetailsWithId(result.place_id);
    //   }
    // );
    // const nearbyResultsDetails = await Promise.all(detailPromises);

    return nearbyResults as google.maps.places.PlaceResult[];
  }

  private async getPlaceDetailsWithId(
    placeId: string
  ): Promise<google.maps.places.PlaceResult | null> {
    const detailsRequest: google.maps.places.PlaceDetailsRequest = {
      placeId,
    };
    return new Promise((resolve): void => {
      this._placesService?.getDetails(
        detailsRequest,
        (result: google.maps.places.PlaceResult | null, status): void => {
          resolve(result);
        }
      );
    });
  }
}
