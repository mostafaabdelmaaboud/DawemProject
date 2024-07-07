import { TestBed } from '@angular/core/testing';

import { StatisticsReportsService } from './statistics-reports.service';

describe('StatisticsReportsService', () => {
  let service: StatisticsReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatisticsReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
