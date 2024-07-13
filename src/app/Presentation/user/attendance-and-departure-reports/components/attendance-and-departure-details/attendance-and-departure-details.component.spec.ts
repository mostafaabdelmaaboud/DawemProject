import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceAndDepartureDetailsComponent } from './attendance-and-departure-details.component';

describe('AttendanceAndDepartureDetailsComponent', () => {
  let component: AttendanceAndDepartureDetailsComponent;
  let fixture: ComponentFixture<AttendanceAndDepartureDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceAndDepartureDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceAndDepartureDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
