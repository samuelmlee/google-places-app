import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { House } from '../model/house';
import { ColumnDef } from './model/column-def';

@Component({
  selector: 'app-house-ranking-table',
  templateUrl: './house-ranking-table.component.html',
  styleUrls: ['./house-ranking-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HouseRankingTableComponent implements OnChanges {
  @Input() displayedColumns: ColumnDef[] = [];

  columns: string[] = [];

  @Input() data: House[] = [];

  dataSource: CdkTableDataSourceInput<House> | undefined;

  @ViewChild(MatSort, { static: true }) sort: MatSort | undefined;

  // getProperty<T>(obj: T, path: string) {
  //   return path.split('.').reduce((o, p) => o && o[p], obj);
  // };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.dataSource = new MatTableDataSource(this.data);
      //   this.dataSource.sortingDataAccessor = (obj, property) =>
      //     this.getProperty(obj, property);
      // }
      if (changes['displayedColumns']) {
        this.columns = this.displayedColumns.map((dc) => dc.name);
      }
    }
  }
}
