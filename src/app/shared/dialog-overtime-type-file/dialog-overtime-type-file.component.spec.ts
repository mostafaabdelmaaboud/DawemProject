import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogOvertimeTypeFileComponent } from './dialog-overtime-type-file.component';

describe('DialogOvertimeTypeFileComponent', () => {
  let component: DialogOvertimeTypeFileComponent;
  let fixture: ComponentFixture<DialogOvertimeTypeFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogOvertimeTypeFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogOvertimeTypeFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
