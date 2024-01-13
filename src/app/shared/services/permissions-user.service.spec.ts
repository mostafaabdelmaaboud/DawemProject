import { TestBed } from '@angular/core/testing';

import { PermissionsUserService } from './permissions-user.service';

describe('PermissionsUserService', () => {
  let service: PermissionsUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionsUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
