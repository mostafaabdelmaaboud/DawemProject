import { TestBed } from '@angular/core/testing';

import { ScheduleLogsService } from './schedule-logs.service';

describe('ScheduleLogsService', () => {
  let service: ScheduleLogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduleLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
