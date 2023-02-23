import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HouseRankingTableComponent } from './feature/house-ranking/house-ranking-table/house-ranking-table.component';
import { HouseRankingDashboardComponent } from './feature/house-ranking/house-ranking-dashboard/house-ranking-dashboard.component';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TitledContainerComponent } from './widget/titled-container/titled-container.component';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [
    AppComponent,
    HouseRankingTableComponent,
    HouseRankingDashboardComponent,
    TitledContainerComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatTableModule,
    BrowserAnimationsModule,
    MatSortModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
