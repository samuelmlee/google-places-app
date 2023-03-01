import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  catchError,
  firstValueFrom,
  map,
  Observable,
  of,
  throwError,
} from 'rxjs';
import { CONSTANTS } from 'src/app/config/constants';
import { environment } from 'src/environments/environment';

type PlaceDetailsResponse = {
  data: google.maps.places.PlaceResult;
};

type AutoCompleteResponse = {
  data: google.maps.places.AutocompletePrediction[];
};

type NearbySearchResponse = {
  data: google.maps.places.PlaceResult[];
};

const QUERY_OUTPUT = 'json';
const GOOGLE_MAPS_ENDPOINT = CONSTANTS.GOOGLE_MAPS_ENDPOINT;

@Injectable({ providedIn: 'root' })
export class GoogleApiService {
  constructor(private _httpClient: HttpClient) {}

  public loadGoogleMapsApi(): Observable<boolean> {
    return this._httpClient
      .jsonp(
        `https://maps.googleapis.com/maps/api/js?key=${environment.googleApiKey}`,
        'callback'
      )
      .pipe(
        map((): boolean => true),
        catchError((): Observable<boolean> => of(false))
      );
  }

  public async getPlaceAutocomplete(
    address: string
  ): Promise<google.maps.places.AutocompletePrediction[] | null> {
    const params = {
      input: address,
      key: environment.googleApiKey,
      components: 'country:de',
      types: 'geocode',
    };
    const url = `${GOOGLE_MAPS_ENDPOINT}/autocomplete/${QUERY_OUTPUT}`;
    const resultObs = this._httpClient.get(url, { params }).pipe(
      map(
        (response): google.maps.places.AutocompletePrediction[] =>
          (response as AutoCompleteResponse).data
      ),
      catchError((error): Observable<null> => {
        return this.errorHandler(error, 'getPlaceAutocomplete');
      })
      //   retry(3)
    );
    return firstValueFrom(resultObs);
  }

  public getPlaceDetailsWithId(
    placeId: string
  ): Promise<google.maps.places.PlaceResult | null> {
    const params = {
      key: environment.googleApiKey,
      place_id: placeId,
    };
    const url = `${GOOGLE_MAPS_ENDPOINT}/details/${QUERY_OUTPUT}`;
    const resultObs = this._httpClient.get(url, { params }).pipe(
      map(
        (response): google.maps.places.PlaceResult =>
          (response as PlaceDetailsResponse).data
      ),
      catchError((error): Observable<null> => {
        return this.errorHandler(error, 'getPlaceDetailsWithId');
      })
      //   retry(3)
    );
    return firstValueFrom(resultObs);
  }

  public getNearbySearchFromRequest(
    request: object
  ): Promise<google.maps.places.PlaceResult[] | null> {
    const params = {
      key: environment.googleApiKey,
      ...request,
    };
    const url = `${GOOGLE_MAPS_ENDPOINT}/nearbysearch/${QUERY_OUTPUT}`;
    const resultObs = this._httpClient.get(url, { params }).pipe(
      map(
        (response): google.maps.places.PlaceResult[] =>
          (response as NearbySearchResponse).data
      ),
      catchError((error): Observable<null> => {
        return this.errorHandler(error, 'getNearbySearchFromRequest');
      })
      //   retry(3)
    );
    return firstValueFrom(resultObs);
  }

  private errorHandler(
    error: HttpErrorResponse,
    apiName: string
  ): Observable<null> {
    if (error.error instanceof ErrorEvent) {
      console.error(
        `[Google API ${apiName}] : an error occurred:`,
        error.error.message
      );
    } else {
      console.error(
        `[Google API ${apiName}] : returned status ${error.status}, error message: ${error.error}`
      );
    }
    return throwError((): void => {
      new Error(`[Google API ${apiName}] : returned unknown error: ${error}`);
    });
  }
}
