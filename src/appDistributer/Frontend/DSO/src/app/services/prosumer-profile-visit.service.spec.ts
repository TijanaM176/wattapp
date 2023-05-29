import { TestBed } from '@angular/core/testing';

import { ProsumerProfileVisitService } from './prosumer-profile-visit.service';

describe('ProsumerProfileVisitService', () => {
  let service: ProsumerProfileVisitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProsumerProfileVisitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
