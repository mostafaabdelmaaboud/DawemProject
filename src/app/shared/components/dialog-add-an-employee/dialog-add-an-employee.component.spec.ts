import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddAnEmployeeComponent } from './dialog-add-an-employee.component';

describe('DialogAddAnEmployeeComponent', () => {
  let component: DialogAddAnEmployeeComponent;
  let fixture: ComponentFixture<DialogAddAnEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogAddAnEmployeeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAddAnEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
