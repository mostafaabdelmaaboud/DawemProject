import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulePlanLogsReportComponent } from './schedule-plan-logs-report.component';

describe('SchedulePlanLogsReportComponent', () => {
  let component: SchedulePlanLogsReportComponent;
  let fixture: ComponentFixture<SchedulePlanLogsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchedulePlanLogsReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchedulePlanLogsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
