import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteActivatedEvent } from '@angular/material/autocomplete';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  Subscription,
} from 'rxjs';
import { PlacesResultsService } from '../places-results/service/places-results.service';
import { GoogleApiService } from '../shared/service/google-api-service';

@Component({
  selector: 'app-place-search',
  templateUrl: './place-search.component.html',
  styleUrls: ['./place-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceSearchComponent implements OnInit, OnDestroy {
  private _predictionsSubj = new BehaviorSubject<
    google.maps.places.AutocompletePrediction[]
  >([]);
  private _valueChangeSub: Subscription | undefined;

  public predictions$ = this._predictionsSubj.asObservable();
  public inputControl = new FormControl();

  constructor(
    private _googleApiService: GoogleApiService,
    private _placesResultsService: PlacesResultsService
  ) {}

  ngOnInit(): void {
    this._valueChangeSub = this.inputControl.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(300))
      .subscribe((searchValue): void => {
        this.launchAutoCompleteSearch(searchValue);
      });
  }

  ngOnDestroy(): void {
    this._valueChangeSub?.unsubscribe();
  }

  public async launchAutoCompleteSearch(searchValue: string): Promise<void> {
    this._predictionsSubj.next([]);
    if (!searchValue) {
      return;
    }
    const predictions = await this._googleApiService.getPlaceAutocomplete(
      searchValue
    );
    if (!predictions) {
      return;
    }
    this._predictionsSubj.next(predictions);
  }

  public displayFn(
    prediction: google.maps.places.AutocompletePrediction
  ): string {
    return prediction?.description ?? '';
  }

  public predictionSelected(event: MatAutocompleteActivatedEvent): void {
    if (!event.option) {
      return;
    }
    const prediction = event.option.value;
    // this._placesService.centerOnPlaceDescription(prediction.description);
    this._placesResultsService.nearbySearchFromPrediction(
      prediction,
      'restaurant'
    );
  }

  public clearInput(): void {
    this.inputControl.setValue('');
    this._placesResultsService.clearAllResults();
  }
}
