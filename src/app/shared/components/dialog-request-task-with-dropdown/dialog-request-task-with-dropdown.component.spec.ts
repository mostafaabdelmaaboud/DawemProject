import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRequestTaskWithDropdownComponent } from './dialog-request-task-with-dropdown.component';

describe('DialogRequestTaskWithDropdownComponent', () => {
  let component: DialogRequestTaskWithDropdownComponent;
  let fixture: ComponentFixture<DialogRequestTaskWithDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogRequestTaskWithDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogRequestTaskWithDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
