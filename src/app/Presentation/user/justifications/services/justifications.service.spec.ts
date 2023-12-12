import { TestBed } from '@angular/core/testing';

import { JustificationsService } from './justifications.service';

describe('JustificationsService', () => {
  let service: JustificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JustificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
