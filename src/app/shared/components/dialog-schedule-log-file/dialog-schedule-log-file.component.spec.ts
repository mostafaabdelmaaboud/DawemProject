import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogScheduleLogFileComponent } from './dialog-schedule-log-file.component';

describe('DialogScheduleLogFileComponent', () => {
  let component: DialogScheduleLogFileComponent;
  let fixture: ComponentFixture<DialogScheduleLogFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogScheduleLogFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogScheduleLogFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
