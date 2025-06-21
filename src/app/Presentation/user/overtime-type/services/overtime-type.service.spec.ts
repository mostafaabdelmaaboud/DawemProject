import { TestBed } from '@angular/core/testing';

import { OvertimeTypeService } from './overtime-type.service';

describe('OvertimeTypeService', () => {
  let service: OvertimeTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OvertimeTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
