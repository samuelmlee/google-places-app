import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-places-results',
  templateUrl: './places-results.component.html',
  styleUrls: ['./places-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlacesResultsComponent {}
