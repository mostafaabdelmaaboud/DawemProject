import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogJustificationTypeFileComponent } from './dialog-justification-type-file.component';

describe('DialogJustificationTypeFileComponent', () => {
  let component: DialogJustificationTypeFileComponent;
  let fixture: ComponentFixture<DialogJustificationTypeFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogJustificationTypeFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogJustificationTypeFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
