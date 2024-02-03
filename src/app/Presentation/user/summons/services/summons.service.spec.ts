import { TestBed } from '@angular/core/testing';

import { SummonsService } from './summons.service';

describe('SummonsService', () => {
  let service: SummonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SummonsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
