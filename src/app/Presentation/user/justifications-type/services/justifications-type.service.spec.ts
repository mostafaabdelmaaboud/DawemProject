import { TestBed } from '@angular/core/testing';

import { JustificationsTypeService } from './justifications-type.service';

describe('JustificationsTypeService', () => {
  let service: JustificationsTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JustificationsTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
