import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceAndDepartureFromDepartmentReportComponent } from './attendance-and-departure-from-department-report.component';

describe('AttendanceAndDepartureFromDepartmentReportComponent', () => {
  let component: AttendanceAndDepartureFromDepartmentReportComponent;
  let fixture: ComponentFixture<AttendanceAndDepartureFromDepartmentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceAndDepartureFromDepartmentReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceAndDepartureFromDepartmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
