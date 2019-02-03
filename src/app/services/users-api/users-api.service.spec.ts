import { TestBed, inject } from '@angular/core/testing';

import { UsersApiService } from './users-api.service';

describe('UsersApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsersApiService]
    });
  });

  it('should be created', inject([UsersApiService], (service: UsersApiService) => {
    expect(service).toBeTruthy();
  }));
});
