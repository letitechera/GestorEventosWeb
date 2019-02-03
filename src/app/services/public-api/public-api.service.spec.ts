import { TestBed, inject } from '@angular/core/testing';

import { PublicApiService } from './public-api.service';

describe('PublicApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PublicApiService]
    });
  });

  it('should be created', inject([PublicApiService], (service: PublicApiService) => {
    expect(service).toBeTruthy();
  }));
});
