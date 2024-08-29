import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceAndDepartureForEmployeesComponent } from './attendance-and-departure-for-employees.component';

describe('AttendanceAndDepartureForEmployeesComponent', () => {
  let component: AttendanceAndDepartureForEmployeesComponent;
  let fixture: ComponentFixture<AttendanceAndDepartureForEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceAndDepartureForEmployeesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceAndDepartureForEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
