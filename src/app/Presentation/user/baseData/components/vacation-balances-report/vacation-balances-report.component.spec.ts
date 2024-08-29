import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacationBalancesReportComponent } from './vacation-balances-report.component';

describe('VacationBalancesReportComponent', () => {
  let component: VacationBalancesReportComponent;
  let fixture: ComponentFixture<VacationBalancesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacationBalancesReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacationBalancesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
