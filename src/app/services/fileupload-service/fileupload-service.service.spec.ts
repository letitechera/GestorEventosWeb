import { TestBed, inject } from '@angular/core/testing';

import { FileuploadServiceService } from './fileupload-service.service';

describe('FileuploadServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileuploadServiceService]
    });
  });

  it('should be created', inject([FileuploadServiceService], (service: FileuploadServiceService) => {
    expect(service).toBeTruthy();
  }));
});
