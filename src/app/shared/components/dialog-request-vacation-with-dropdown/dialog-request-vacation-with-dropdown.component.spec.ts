import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRequestVacationWithDropdownComponent } from './dialog-request-vacation-with-dropdown.component';

describe('DialogRequestVacationWithDropdownComponent', () => {
  let component: DialogRequestVacationWithDropdownComponent;
  let fixture: ComponentFixture<DialogRequestVacationWithDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogRequestVacationWithDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogRequestVacationWithDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
