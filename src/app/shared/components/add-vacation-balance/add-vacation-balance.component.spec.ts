import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVacationBalanceComponent } from './add-vacation-balance.component';

describe('AddVacationBalanceComponent', () => {
  let component: AddVacationBalanceComponent;
  let fixture: ComponentFixture<AddVacationBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AddVacationBalanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVacationBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
