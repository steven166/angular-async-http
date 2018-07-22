import { TestBed, inject } from '@angular/core/testing';

import { AngularRestClientService } from './angular-rest-client.service';

describe('AngularRestClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AngularRestClientService]
    });
  });

  it('should be created', inject([AngularRestClientService], (service: AngularRestClientService) => {
    expect(service).toBeTruthy();
  }));
});
