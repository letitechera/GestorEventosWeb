import { TestBed, inject } from '@angular/core/testing';

import { GeographicsApiService } from './geographics-api.service';

describe('GeographicsApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeographicsApiService]
    });
  });

  it('should be created', inject([GeographicsApiService], (service: GeographicsApiService) => {
    expect(service).toBeTruthy();
  }));
});
