import { Injectable } from '@angular/core';

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
    this.centerMapOnPlace();
  }

  private centerMapOnPlace(): void {
    const request = {
      query: 'Museum of Contemporary Art Australia',
      fields: ['name', 'geometry'],
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
    type: string
  ): Promise<google.maps.places.PlaceResult[]> {
    const detailsRequest: google.maps.places.PlaceDetailsRequest = {
      placeId: prediction.place_id,
    };

    const placeResult = await new Promise((resolve): void =>
      this._placesService?.getDetails(
        detailsRequest,
        async (result: google.maps.places.PlaceResult | null): Promise<void> =>
          resolve(result)
      )
    );
    const geometry = (placeResult as google.maps.places.PlaceResult).geometry;

    const nearbyRequest = {
      location: geometry?.location,
      radius: 1000,
      type: type,
    };

    const nearbyResults = await new Promise((resolve): void =>
      this._placesService?.nearbySearch(
        nearbyRequest,
        async (
          results: google.maps.places.PlaceResult[] | null
        ): Promise<void> => resolve(results)
      )
    );
    return nearbyResults as google.maps.places.PlaceResult[];
  }
}
