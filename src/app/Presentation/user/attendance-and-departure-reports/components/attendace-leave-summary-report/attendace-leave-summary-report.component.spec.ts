import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendaceLeaveSummaryReportComponent } from './attendace-leave-summary-report.component';

describe('AttendaceLeaveSummaryReportComponent', () => {
  let component: AttendaceLeaveSummaryReportComponent;
  let fixture: ComponentFixture<AttendaceLeaveSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendaceLeaveSummaryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendaceLeaveSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
