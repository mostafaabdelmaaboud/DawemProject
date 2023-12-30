import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacationBalanceComponent } from './vacation-balance.component';

describe('VacationBalanceComponent', () => {
  let component: VacationBalanceComponent;
  let fixture: ComponentFixture<VacationBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacationBalanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacationBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
