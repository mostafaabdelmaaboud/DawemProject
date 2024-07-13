import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryOfAttendanceAndDepartureReportComponent } from './summary-of-attendance-and-departure-report.component';

describe('SummaryOfAttendanceAndDepartureReportComponent', () => {
  let component: SummaryOfAttendanceAndDepartureReportComponent;
  let fixture: ComponentFixture<SummaryOfAttendanceAndDepartureReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryOfAttendanceAndDepartureReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryOfAttendanceAndDepartureReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
