import { TestBed } from '@angular/core/testing';

import { SchedualPlanService } from './schedual-plan.service';

describe('SchedualPlanService', () => {
  let service: SchedualPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchedualPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
