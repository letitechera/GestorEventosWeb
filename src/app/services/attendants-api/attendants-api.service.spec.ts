import { TestBed, inject } from '@angular/core/testing';

import { AttendantsApiService } from './attendants-api.service';

describe('AttendantsApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AttendantsApiService]
    });
  });

  it('should be created', inject([AttendantsApiService], (service: AttendantsApiService) => {
    expect(service).toBeTruthy();
  }));
});
