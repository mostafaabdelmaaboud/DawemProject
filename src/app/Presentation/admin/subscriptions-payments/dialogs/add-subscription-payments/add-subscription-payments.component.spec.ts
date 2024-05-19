import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubscriptionPaymentsComponent } from './add-subscription-payments.component';

describe('AddSubscriptionPaymentsComponent', () => {
  let component: AddSubscriptionPaymentsComponent;
  let fixture: ComponentFixture<AddSubscriptionPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AddSubscriptionPaymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSubscriptionPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
