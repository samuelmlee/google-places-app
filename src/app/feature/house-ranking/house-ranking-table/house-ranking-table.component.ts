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
import { BehaviorSubject } from 'rxjs';
import { HouseView } from '../model/house-view';
import { ColumnDef } from './model/column-def';

@Component({
  selector: 'app-house-ranking-table',
  templateUrl: './house-ranking-table.component.html',
  styleUrls: ['./house-ranking-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HouseRankingTableComponent implements OnChanges {
  @Input() displayedColumns: ColumnDef[] = [];

  columns: string[] = [];

  @Input() data: HouseView[] = [];

  dataSourceSubj = new BehaviorSubject<MatTableDataSource<HouseView>>(
    new MatTableDataSource<HouseView>([])
  );

  dataSource$ = this.dataSourceSubj.asObservable();

  @ViewChild(MatSort, { static: true }) sort: MatSort | undefined;

  getProperty<T>(obj: T, path: keyof T) {
    return obj[path];
    // return path.split('.').reduce((o, p) => o && o[p], obj);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      const newDataSource = new MatTableDataSource<HouseView>(this.data);
      this.dataSourceSubj.next(newDataSource);
      // newDataSource.sortingDataAccessor = (obj, property) =>
      //   this.getProperty(obj, property);
    }
    this.dataSourceSubj.next(new MatTableDataSource<HouseView>(this.data));
    if (changes['displayedColumns']) {
      this.columns = this.displayedColumns.map((dc) => dc.name);
    }
  }
}
