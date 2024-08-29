import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummonLogsReportComponent } from './summon-logs-report.component';

describe('SummonLogsReportComponent', () => {
  let component: SummonLogsReportComponent;
  let fixture: ComponentFixture<SummonLogsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummonLogsReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummonLogsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
