import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestForOvertimeComponent } from './request-for-overtime.component';

describe('RequestForOvertimeComponent', () => {
  let component: RequestForOvertimeComponent;
  let fixture: ComponentFixture<RequestForOvertimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RequestForOvertimeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestForOvertimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
