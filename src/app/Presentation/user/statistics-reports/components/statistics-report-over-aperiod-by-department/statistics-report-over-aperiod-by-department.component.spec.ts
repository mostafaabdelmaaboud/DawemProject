import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsReportOverAperiodByDepartmentComponent } from './statistics-report-over-aperiod-by-department.component';

describe('StatisticsReportOverAperiodByDepartmentComponent', () => {
  let component: StatisticsReportOverAperiodByDepartmentComponent;
  let fixture: ComponentFixture<StatisticsReportOverAperiodByDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatisticsReportOverAperiodByDepartmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticsReportOverAperiodByDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
