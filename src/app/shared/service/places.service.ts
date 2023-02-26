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

  public initServices(map: google.maps.Map) {
    if (!map) {
      return;
    }
    const request = {
      query: 'Museum of Contemporary Art Australia',
      fields: ['name', 'geometry'],
    };
    this._placesService = new google.maps.places.PlacesService(map);
    this._placesService.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        if (!results[0] || !results[0]?.geometry?.location) {
          return;
        }
        this._googleMap?.setCenter(results[0].geometry.location);
      }
    });

    this._autocompleteService = new google.maps.places.AutocompleteService();
  }

  public async makeApiCall(
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
}
