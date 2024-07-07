import { TestBed } from '@angular/core/testing';

import { BasicDataReportsService } from './basic-data-reports.service';

describe('BasicDataReportsService', () => {
  let service: BasicDataReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasicDataReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
