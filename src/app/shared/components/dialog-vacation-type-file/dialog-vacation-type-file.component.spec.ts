import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogVacationTypeFileComponent } from './dialog-vacation-type-file.component';

describe('DialogVacationTypeFileComponent', () => {
  let component: DialogVacationTypeFileComponent;
  let fixture: ComponentFixture<DialogVacationTypeFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogVacationTypeFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogVacationTypeFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
