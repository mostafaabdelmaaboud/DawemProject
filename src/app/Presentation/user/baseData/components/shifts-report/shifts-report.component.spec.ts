import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftsReportComponent } from './shifts-report.component';

describe('ShiftsReportComponent', () => {
  let component: ShiftsReportComponent;
  let fixture: ComponentFixture<ShiftsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftsReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
