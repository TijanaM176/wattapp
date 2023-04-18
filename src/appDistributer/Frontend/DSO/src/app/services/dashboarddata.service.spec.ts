import { TestBed } from '@angular/core/testing';

import { DashboarddataService } from './dashboarddata.service';

describe('DashboarddataService', () => {
  let service: DashboarddataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboarddataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
