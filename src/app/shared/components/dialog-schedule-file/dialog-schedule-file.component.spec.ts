import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogScheduleFileComponent } from './dialog-schedule-file.component';

describe('DialogScheduleFileComponent', () => {
  let component: DialogScheduleFileComponent;
  let fixture: ComponentFixture<DialogScheduleFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogScheduleFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogScheduleFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
