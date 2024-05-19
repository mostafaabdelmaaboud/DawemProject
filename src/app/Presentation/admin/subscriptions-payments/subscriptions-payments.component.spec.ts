import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionsPaymentsComponent } from './subscriptions-payments.component';

describe('SubscriptionsPaymentsComponent', () => {
  let component: SubscriptionsPaymentsComponent;
  let fixture: ComponentFixture<SubscriptionsPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionsPaymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionsPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
