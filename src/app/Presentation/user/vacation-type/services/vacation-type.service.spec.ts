import { TestBed } from '@angular/core/testing';

import { VacationTypeService } from './vacation-type.service';

describe('VacationTypeService', () => {
  let service: VacationTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VacationTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
