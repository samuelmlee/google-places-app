import { LatLon } from './lat-lon';
import { HouseParam } from './house-param';

/**
 * House model
 */
export type House = {
  coords: LatLon | undefined;
  params: HouseParam;
  street: string;
};
