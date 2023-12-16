import { TestBed } from '@angular/core/testing';

import { PermissionTypeService } from './permission-type.service';

describe('PermissionTypeService', () => {
  let service: PermissionTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
