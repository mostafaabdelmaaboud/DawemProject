import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionPaymentsInfoComponent } from './subscription-payments-info.component';

describe('SubscriptionPaymentsInfoComponent', () => {
  let component: SubscriptionPaymentsInfoComponent;
  let fixture: ComponentFixture<SubscriptionPaymentsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SubscriptionPaymentsInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionPaymentsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
