import { TestBed } from '@angular/core/testing';

import { OvertimeRequestService } from './overtime-request.service';

describe('OvertimeRequestService', () => {
  let service: OvertimeRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OvertimeRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
