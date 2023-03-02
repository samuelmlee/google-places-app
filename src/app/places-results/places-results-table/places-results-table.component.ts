import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StarRatingComponent } from 'angular-star-rating';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlacesResultsService } from '../service/places-results.service';
import { SearchType } from './model/search-type';

type ColumConfiguration = {
  columnDef: string;
  header: string;
  width: string;
  cellTemplateRef: TemplateRef<unknown> | undefined;
};

@Component({
  selector: 'app-places-results-table',
  templateUrl: './places-results-table.component.html',
  styleUrls: ['./places-results-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlacesResultsTableComponent implements AfterViewInit {
  @Input() type: SearchType | undefined;

  @ViewChild('defaultCellTemplate') defaultCellTemplate:
    | TemplateRef<HTMLDivElement>
    | undefined;

  @ViewChild('ratingCellTemplate') ratingCellTemplate:
    | TemplateRef<StarRatingComponent>
    | undefined;

  @ViewChild('iconCellTemplate') iconCellTemplate:
    | TemplateRef<StarRatingComponent>
    | undefined;

  private _dataSourceSubj = new BehaviorSubject<
    MatTableDataSource<google.maps.places.PlaceResult>
  >(new MatTableDataSource<google.maps.places.PlaceResult>([]));

  public dataSource$ = this._dataSourceSubj.asObservable();
  public tableResult$: Observable<google.maps.places.PlaceResult[]> | undefined;
  public displayedColumns: string[] = [];
  public columns: ColumConfiguration[] = [];

  constructor(private _placesResultsSerevice: PlacesResultsService) {}

  async ngAfterViewInit(): Promise<void> {
    this.columns = [
      {
        columnDef: 'name',
        header: 'Name',
        width: '30%',
        cellTemplateRef: this.defaultCellTemplate,
      },
      {
        columnDef: 'rating',
        header: 'Ratings',
        width: '20%',
        cellTemplateRef: this.ratingCellTemplate,
      },
      {
        columnDef: 'opening_hours',
        header: 'Is open',
        width: '20%',
        cellTemplateRef: this.iconCellTemplate,
      },
    ];

    if (!this.type) {
      return;
    }
    this.tableResult$ = this._placesResultsSerevice.resolveResultsFromType(
      this.type
    );

    this.tableResult$?.subscribe((results): void => {
      this._dataSourceSubj.next(new MatTableDataSource(results));
    });
    this.displayedColumns = this.columns.map((c): string => c.columnDef);
  }
}
