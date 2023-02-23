import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DistanceCalculatorService {

  static degreesToRadians(degrees): number {
    return degrees * Math.PI / 180;
  }

  static distanceInKmBetweenCoordinates(lat1Inp, lon1Inp, lat2Inp, lon2Inp): number {
    const earthRadiusKm = 6371;

    const dLat = DistanceCalculatorService.degreesToRadians(lat2Inp - lat1Inp);
    const dLon = DistanceCalculatorService.degreesToRadians(lon2Inp - lon1Inp);

    const lat1 = DistanceCalculatorService.degreesToRadians(lat1Inp);
    const lat2 = DistanceCalculatorService.degreesToRadians(lat2Inp);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  }
}
