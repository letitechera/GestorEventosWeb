import { TestBed, inject } from '@angular/core/testing';

import { ActionsApiService } from './actions-api.service';

describe('ActionsApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActionsApiService]
    });
  });

  it('should be created', inject([ActionsApiService], (service: ActionsApiService) => {
    expect(service).toBeTruthy();
  }));
});
