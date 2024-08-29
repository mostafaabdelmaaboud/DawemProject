import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulesReportComponent } from './schedules-report.component';

describe('SchedulesReportComponent', () => {
  let component: SchedulesReportComponent;
  let fixture: ComponentFixture<SchedulesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchedulesReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchedulesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
