import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HousesDto } from '../model/houses-dto';
import { HouseApi } from '../service/house-api.service';
import { ColumnDef } from '../house-ranking-table/model/column-def';
import { HouseView, updateDistance } from '../model/house-view';
import { LatLon } from '../model/lat-lon';
import { House } from '../model/house';

@Component({
  selector: 'app-house-ranking-dashboard',
  templateUrl: './house-ranking-dashboard.component.html',
  styleUrls: ['./house-ranking-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HouseRankingDashboardComponent implements OnInit {
  // Coordinates for Eberswalder Straße 55
  distanceReference: LatLon = { lat: 52.5418739, lon: 13.4057378 };

  defaultColumns: ColumnDef[] = [
    { name: 'coords.lat', title: 'Latitude' },
    { name: 'coords.lon', title: 'Longitude' },
    { name: 'params.rooms', title: 'Rooms' },
    { name: 'params.value', title: 'Value' },
    { name: 'street', title: 'Street' },
    { name: 'distance', title: 'Distance' },
  ];

  houseDistanceList: HouseView[] = [];

  houseRoomList: HouseView[] = [];

  houseStreetList: HouseView[] = [];

  errorMessage: string | undefined;

  constructor(private houseApi: HouseApi) {}

  ngOnInit() {
    this.houseApi
      .getHouses()
      .then((h: HousesDto | undefined) => {
        const houses = h?.houses;
        if (!houses) {
          return;
        }
        const updatedHouses: HouseView[] = updateDistance(
          houses,
          this.distanceReference
        );
        this.houseDistanceList = [...updatedHouses].sort((a, b) =>
          a.distance < b.distance ? -1 : 1
        );
        if (!updatedHouses) {
          return;
        }
        this.houseRoomList = updatedHouses
          .filter((uh) => uh.params?.rooms && uh.params.rooms > 5)
          .sort((a, b) => {
            if (!a.params?.rooms || !b.params?.rooms) {
              return 0;
            }
            return a.params.rooms < b.params.rooms ? -1 : 1;
          });

        this.houseStreetList = updatedHouses
          .filter((uh) => !uh.params || !uh.params.rooms || !uh.params.value)
          .sort((a, b) => (a.street < b.street ? -1 : 1));
      })
      .catch((reason) => {
        this.errorMessage = 'Unable to fetch houses data';
        console.error(
          '[HouseRankingDashboardComponent] Unable to fetch houses data',
          reason
        );
      });
  }
}
