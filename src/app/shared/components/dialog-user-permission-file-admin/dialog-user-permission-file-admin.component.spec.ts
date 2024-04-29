import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUserPermissionFileAdminComponent } from './dialog-user-permission-file-admin.component';

describe('DialogUserPermissionFileAdminComponent', () => {
  let component: DialogUserPermissionFileAdminComponent;
  let fixture: ComponentFixture<DialogUserPermissionFileAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogUserPermissionFileAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogUserPermissionFileAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
