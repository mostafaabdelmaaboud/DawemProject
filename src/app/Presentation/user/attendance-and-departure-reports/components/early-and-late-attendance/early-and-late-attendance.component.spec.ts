import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarlyAndLateAttendanceComponent } from './early-and-late-attendance.component';

describe('EarlyAndLateAttendanceComponent', () => {
  let component: EarlyAndLateAttendanceComponent;
  let fixture: ComponentFixture<EarlyAndLateAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarlyAndLateAttendanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EarlyAndLateAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
