import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogVacationFileComponent } from './dialog-vacation-file.component';

describe('DialogVacationFileComponent', () => {
  let component: DialogVacationFileComponent;
  let fixture: ComponentFixture<DialogVacationFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogVacationFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogVacationFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
