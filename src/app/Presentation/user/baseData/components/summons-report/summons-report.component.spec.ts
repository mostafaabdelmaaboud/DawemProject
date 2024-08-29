import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummonsReportComponent } from './summons-report.component';

describe('SummonsReportComponent', () => {
  let component: SummonsReportComponent;
  let fixture: ComponentFixture<SummonsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummonsReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummonsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
