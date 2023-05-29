import { TestBed } from '@angular/core/testing';

import { NewEmployeeAddedService } from './new-employee-added.service';

describe('NewEmployeeAddedService', () => {
  let service: NewEmployeeAddedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewEmployeeAddedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
