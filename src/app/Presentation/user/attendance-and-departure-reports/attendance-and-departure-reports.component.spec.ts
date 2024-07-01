import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceAndDepartureReportsComponent } from './attendance-and-departure-reports.component';

describe('AttendanceAndDepartureReportsComponent', () => {
  let component: AttendanceAndDepartureReportsComponent;
  let fixture: ComponentFixture<AttendanceAndDepartureReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceAndDepartureReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceAndDepartureReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
