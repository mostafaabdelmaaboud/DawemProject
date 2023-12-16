import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPermissionTypeFileComponent } from './dialog-permission-type-file.component';

describe('DialogPermissionTypeFileComponent', () => {
  let component: DialogPermissionTypeFileComponent;
  let fixture: ComponentFixture<DialogPermissionTypeFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogPermissionTypeFileComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DialogPermissionTypeFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
