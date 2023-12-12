import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEmployeeFileComponent } from './dialog-employee-file.component';

describe('DialogEmployeeFileComponent', () => {
  let component: DialogEmployeeFileComponent;
  let fixture: ComponentFixture<DialogEmployeeFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogEmployeeFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogEmployeeFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
