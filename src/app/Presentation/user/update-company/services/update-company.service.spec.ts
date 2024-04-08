import { TestBed } from '@angular/core/testing';

import { UpdateCompanyService } from './update-company.service';

describe('UpdateCompanyService', () => {
  let service: UpdateCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateCompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
