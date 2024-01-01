import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleLogsComponent } from './schedule-logs.component';

describe('ScheduleLogsComponent', () => {
  let component: ScheduleLogsComponent;
  let fixture: ComponentFixture<ScheduleLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleLogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
