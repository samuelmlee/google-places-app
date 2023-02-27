import { TestBed } from '@angular/core/testing';

import { PlacesResultsService } from './places-results.service';

describe('PlacesResultsService', () => {
  let service: PlacesResultsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlacesResultsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
