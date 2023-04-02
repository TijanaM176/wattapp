import { TestBed } from '@angular/core/testing';

import { ProsumerService } from './prosumer.service';

describe('ProsumerService', () => {
  let service: ProsumerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProsumerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
