import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LateEarlyArrivalGroupByEmployeeComponent } from './late-early-arrival-group-by-employee.component';

describe('LateEarlyArrivalGroupByEmployeeComponent', () => {
  let component: LateEarlyArrivalGroupByEmployeeComponent;
  let fixture: ComponentFixture<LateEarlyArrivalGroupByEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LateEarlyArrivalGroupByEmployeeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LateEarlyArrivalGroupByEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
