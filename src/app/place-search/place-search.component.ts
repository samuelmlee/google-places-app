import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';
import { PlacesService } from '../shared/service/places.service';

@Component({
  selector: 'app-place-search',
  templateUrl: './place-search.component.html',
  styleUrls: ['./place-search.component.scss'],
})
export class PlaceSearchComponent implements OnInit {
  private _predictionsSubj = new BehaviorSubject<
    google.maps.places.AutocompletePrediction[]
  >([]);

  public predictions$ = this._predictionsSubj.asObservable();
  public inputControl = new FormControl();

  constructor(private _placesService: PlacesService) {}

  ngOnInit(): void {
    this.inputControl.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(300))
      .subscribe((searchValue) => {
        this.launchAutoCompleteSearch(searchValue);
      });
  }

  public async launchAutoCompleteSearch(searchValue: string) {
    this._predictionsSubj.next([]);
    const predictions = await this._placesService.makeApiCall(searchValue);
    this._predictionsSubj.next(predictions);
  }

  public displayFn(
    prediction: google.maps.places.AutocompletePrediction
  ): string {
    return prediction.description;
  }

  public suggestionSelected(suggestion: any) {
    // this.setSelectedAddress(suggestion);
  }
}
