import { TestBed } from '@angular/core/testing';

import { SubscriptionsPaymentsService } from './subscriptions-payments.service';

describe('SubscriptionsPaymentsService', () => {
  let service: SubscriptionsPaymentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscriptionsPaymentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
