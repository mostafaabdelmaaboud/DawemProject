import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCloseRadioButtonsComponent } from './dialog-close-radio-buttons.component';

describe('DialogCloseRadioButtonsComponent', () => {
  let component: DialogCloseRadioButtonsComponent;
  let fixture: ComponentFixture<DialogCloseRadioButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogCloseRadioButtonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCloseRadioButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
