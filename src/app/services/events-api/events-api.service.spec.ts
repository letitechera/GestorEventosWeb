import { TestBed, inject } from '@angular/core/testing';

import { EventsApiService } from './events-api.service';

describe('EventsApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventsApiService]
    });
  });

  it('should be created', inject([EventsApiService], (service: EventsApiService) => {
    expect(service).toBeTruthy();
  }));
});
