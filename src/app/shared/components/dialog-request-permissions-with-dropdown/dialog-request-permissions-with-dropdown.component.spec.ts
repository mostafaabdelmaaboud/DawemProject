import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRequestPermissionsWithDropdownComponent } from './dialog-request-permissions-with-dropdown.component';

describe('DialogRequestPermissionsWithDropdownComponent', () => {
  let component: DialogRequestPermissionsWithDropdownComponent;
  let fixture: ComponentFixture<DialogRequestPermissionsWithDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogRequestPermissionsWithDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogRequestPermissionsWithDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
