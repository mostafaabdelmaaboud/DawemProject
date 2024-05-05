import { TestBed } from '@angular/core/testing';

import { PermissionLogService } from './permission-log.service';

describe('PermissionLogService', () => {
  let service: PermissionLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
