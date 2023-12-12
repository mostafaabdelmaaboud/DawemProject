import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRequestJustificationWithDropdownComponent } from './dialog-request-justification-with-dropdown.component';

describe('DialogRequestJustificationWithDropdownComponent', () => {
  let component: DialogRequestJustificationWithDropdownComponent;
  let fixture: ComponentFixture<DialogRequestJustificationWithDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogRequestJustificationWithDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogRequestJustificationWithDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
