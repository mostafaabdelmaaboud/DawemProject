import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonesReportComponent } from './zones-report.component';

describe('ZonesReportComponent', () => {
  let component: ZonesReportComponent;
  let fixture: ComponentFixture<ZonesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZonesReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZonesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
