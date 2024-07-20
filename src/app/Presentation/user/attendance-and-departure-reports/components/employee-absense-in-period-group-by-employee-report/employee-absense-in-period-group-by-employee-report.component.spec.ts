import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAbsenseInPeriodGroupByEmployeeReportComponent } from './employee-absense-in-period-group-by-employee-report.component';

describe('EmployeeAbsenseInPeriodGroupByEmployeeReportComponent', () => {
  let component: EmployeeAbsenseInPeriodGroupByEmployeeReportComponent;
  let fixture: ComponentFixture<EmployeeAbsenseInPeriodGroupByEmployeeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeAbsenseInPeriodGroupByEmployeeReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeAbsenseInPeriodGroupByEmployeeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
