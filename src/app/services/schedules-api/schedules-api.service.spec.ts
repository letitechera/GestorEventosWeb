import { TestBed, inject } from '@angular/core/testing';

import { SchedulesApiService } from './schedules-api.service';

describe('SchedulesApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SchedulesApiService]
    });
  });

  it('should be created', inject([SchedulesApiService], (service: SchedulesApiService) => {
    expect(service).toBeTruthy();
  }));
});
