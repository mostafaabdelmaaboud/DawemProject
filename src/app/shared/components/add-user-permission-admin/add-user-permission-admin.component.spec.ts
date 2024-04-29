import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserPermissionAdminComponent } from './add-user-permission-admin.component';

describe('AddUserPermissionAdminComponent', () => {
  let component: AddUserPermissionAdminComponent;
  let fixture: ComponentFixture<AddUserPermissionAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AddUserPermissionAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUserPermissionAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
