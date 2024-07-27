import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsReportOverAperiodGroupByMonthComponent } from './statistics-report-over-aperiod-group-by-month.component';

describe('StatisticsReportOverAperiodGroupByMonthComponent', () => {
  let component: StatisticsReportOverAperiodGroupByMonthComponent;
  let fixture: ComponentFixture<StatisticsReportOverAperiodGroupByMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatisticsReportOverAperiodGroupByMonthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticsReportOverAperiodGroupByMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
