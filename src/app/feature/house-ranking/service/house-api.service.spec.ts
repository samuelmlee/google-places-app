import { TestBed, inject } from '@angular/core/testing';

import { HouseApi } from './house-api.service';

describe('HouseApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HouseApi]
    });
  });

  it('should be created', inject([HouseApi], (service: HouseApi) => {
    expect(service).toBeTruthy();
  }));
});
