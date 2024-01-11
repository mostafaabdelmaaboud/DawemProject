import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUserPermissionFileComponent } from './dialog-user-permission-file.component';

describe('DialogUserPermissionFileComponent', () => {
  let component: DialogUserPermissionFileComponent;
  let fixture: ComponentFixture<DialogUserPermissionFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogUserPermissionFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogUserPermissionFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
