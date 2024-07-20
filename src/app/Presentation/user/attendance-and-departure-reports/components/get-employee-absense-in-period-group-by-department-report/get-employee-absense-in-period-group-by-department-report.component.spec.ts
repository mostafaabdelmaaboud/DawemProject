import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetEmployeeAbsenseInPeriodGroupByDepartmentReportComponent } from './get-employee-absense-in-period-group-by-department-report.component';

describe('GetEmployeeAbsenseInPeriodGroupByDepartmentReportComponent', () => {
  let component: GetEmployeeAbsenseInPeriodGroupByDepartmentReportComponent;
  let fixture: ComponentFixture<GetEmployeeAbsenseInPeriodGroupByDepartmentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetEmployeeAbsenseInPeriodGroupByDepartmentReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetEmployeeAbsenseInPeriodGroupByDepartmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
