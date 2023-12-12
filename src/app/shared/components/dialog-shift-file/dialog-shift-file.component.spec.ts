import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogShiftFileComponent } from './dialog-shift-file.component';

describe('DialogShiftFileComponent', () => {
  let component: DialogShiftFileComponent;
  let fixture: ComponentFixture<DialogShiftFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogShiftFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogShiftFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
