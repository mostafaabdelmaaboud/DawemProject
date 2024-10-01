import { TestBed } from '@angular/core/testing';

import { DefaultLookupsService } from './default-lookups.service';

describe('DefaultLookupsService', () => {
  let service: DefaultLookupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DefaultLookupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
