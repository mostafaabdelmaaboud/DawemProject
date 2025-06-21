import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogOvertimeRequestFileComponent } from './dialog-overtime-request-file.component';

describe('DialogOvertimeRequestFileComponent', () => {
  let component: DialogOvertimeRequestFileComponent;
  let fixture: ComponentFixture<DialogOvertimeRequestFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogOvertimeRequestFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogOvertimeRequestFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
