import { TestBed } from '@angular/core/testing';

import { VacationBalanceService } from './vacation-balance.service';

describe('VacationBalanceService', () => {
  let service: VacationBalanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VacationBalanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
