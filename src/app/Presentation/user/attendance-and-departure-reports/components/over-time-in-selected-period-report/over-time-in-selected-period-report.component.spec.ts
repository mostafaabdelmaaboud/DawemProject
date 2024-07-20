import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverTimeInSelectedPeriodReportComponent } from './over-time-in-selected-period-report.component';

describe('OverTimeInSelectedPeriodReportComponent', () => {
  let component: OverTimeInSelectedPeriodReportComponent;
  let fixture: ComponentFixture<OverTimeInSelectedPeriodReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverTimeInSelectedPeriodReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverTimeInSelectedPeriodReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
