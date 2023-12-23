import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSchedulePlanFileComponent } from './dialog-schedule-plan-file.component';

describe('DialogSchedulePlanFileComponent', () => {
  let component: DialogSchedulePlanFileComponent;
  let fixture: ComponentFixture<DialogSchedulePlanFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogSchedulePlanFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogSchedulePlanFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
