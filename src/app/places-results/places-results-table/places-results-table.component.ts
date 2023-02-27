import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { PlacesResultsService } from '../service/places-results.service';
import { SearchType } from './model/search-type';

@Component({
  selector: 'app-places-results-table',
  templateUrl: './places-results-table.component.html',
  styleUrls: ['./places-results-table.component.scss'],
})
export class PlacesResultsTableComponent implements OnInit {
  @Input() type: SearchType | undefined;

  public tableResult$: Observable<google.maps.places.PlaceResult[]> | undefined;
  public dataSource!: MatTableDataSource<google.maps.places.PlaceResult>;
  public displayedColumns: string[] = [];
  public columns = [
    {
      columnDef: 'name',
      header: 'Name',
      cell: (element: google.maps.places.PlaceResult): string =>
        `${element.name}`,
    },
  ];

  constructor(private _placesResultsSerevice: PlacesResultsService) {}
  async ngOnInit(): Promise<void> {
    if (!this.type) {
      return;
    }
    this.tableResult$ = this._placesResultsSerevice.resolveResultsFromType(
      this.type
    );

    this.tableResult$?.subscribe((results): void => {
      this.dataSource = new MatTableDataSource(results);
    });
    this.displayedColumns = this.columns.map((c): string => c.columnDef);
  }
}
