import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulePlansReportComponent } from './schedule-plans-report.component';

describe('SchedulePlansReportComponent', () => {
  let component: SchedulePlansReportComponent;
  let fixture: ComponentFixture<SchedulePlansReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchedulePlansReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchedulePlansReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
