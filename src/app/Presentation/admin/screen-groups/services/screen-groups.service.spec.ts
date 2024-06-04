import { TestBed } from '@angular/core/testing';

import { ScreenGroupsService } from './screen-groups.service';

describe('ScreenGroupsService', () => {
  let service: ScreenGroupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScreenGroupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
