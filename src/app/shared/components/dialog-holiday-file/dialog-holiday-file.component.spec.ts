import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogHolidayFileComponent } from './dialog-holiday-file.component';

describe('DialogHolidayFileComponent', () => {
  let component: DialogHolidayFileComponent;
  let fixture: ComponentFixture<DialogHolidayFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogHolidayFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogHolidayFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
