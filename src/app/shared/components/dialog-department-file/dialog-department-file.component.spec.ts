import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDepartmentFileComponent } from './dialog-department-file.component';

describe('DialogDepartmentFileComponent', () => {
  let component: DialogDepartmentFileComponent;
  let fixture: ComponentFixture<DialogDepartmentFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogDepartmentFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDepartmentFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
