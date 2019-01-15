import { TestBed, inject } from '@angular/core/testing';

import { LocationsApiService } from './locations-api.service';

describe('LocationsApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocationsApiService]
    });
  });

  it('should be created', inject([LocationsApiService], (service: LocationsApiService) => {
    expect(service).toBeTruthy();
  }));
});
