import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAssignmentTypeFileComponent } from './dialog-assignment-type-file.component';

describe('DialogAssignmentTypeFileComponent', () => {
  let component: DialogAssignmentTypeFileComponent;
  let fixture: ComponentFixture<DialogAssignmentTypeFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogAssignmentTypeFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAssignmentTypeFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
