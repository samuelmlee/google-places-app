import { TestBed, inject } from '@angular/core/testing';

import { DistanceCalculatorService } from './distance-calculator.service';

describe('DistanceCalculatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DistanceCalculatorService]
    });
  });

  it('should be created', inject([DistanceCalculatorService], (service: DistanceCalculatorService) => {
    expect(service).toBeTruthy();
  }));
});
