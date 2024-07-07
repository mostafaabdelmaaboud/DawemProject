import { TestBed } from '@angular/core/testing';

import { OvertimeReportsService } from './overtime-reports.service';

describe('OvertimeReportsService', () => {
  let service: OvertimeReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OvertimeReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
