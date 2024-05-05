import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPermissionLogFileComponent } from './dialog-permission-log-file.component';

describe('DialogPermissionLogFileComponent', () => {
  let component: DialogPermissionLogFileComponent;
  let fixture: ComponentFixture<DialogPermissionLogFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogPermissionLogFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogPermissionLogFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
