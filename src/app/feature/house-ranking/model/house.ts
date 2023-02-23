import {LatLon} from './lat-lon';
import {HouseParam} from './house-param';

/**
 * House model
 */
export class House {
  coords: LatLon;
  params?: HouseParam;
  street: string;
}
