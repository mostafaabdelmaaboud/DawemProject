import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BriefingSummonsInPeriodReportComponent } from './briefing-summons-in-period-report.component';

describe('BriefingSummonsInPeriodReportComponent', () => {
  let component: BriefingSummonsInPeriodReportComponent;
  let fixture: ComponentFixture<BriefingSummonsInPeriodReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BriefingSummonsInPeriodReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BriefingSummonsInPeriodReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
