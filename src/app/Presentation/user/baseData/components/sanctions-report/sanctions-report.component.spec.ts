import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanctionsReportComponent } from './sanctions-report.component';

describe('SanctionsReportComponent', () => {
  let component: SanctionsReportComponent;
  let fixture: ComponentFixture<SanctionsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SanctionsReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SanctionsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
