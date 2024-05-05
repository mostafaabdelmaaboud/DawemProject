import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPermissionLogFileForAdminComponent } from './dialog-permission-log-file-for-admin.component';

describe('DialogPermissionLogFileForAdminComponent', () => {
  let component: DialogPermissionLogFileForAdminComponent;
  let fixture: ComponentFixture<DialogPermissionLogFileForAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogPermissionLogFileForAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogPermissionLogFileForAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
