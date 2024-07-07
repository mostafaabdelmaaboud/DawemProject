import { TestBed } from '@angular/core/testing';

import { RecallReportsService } from './recall-reports.service';

describe('RecallReportsService', () => {
  let service: RecallReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecallReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
