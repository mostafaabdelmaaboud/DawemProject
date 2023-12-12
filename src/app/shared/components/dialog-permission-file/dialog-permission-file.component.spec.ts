import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPermissionFileComponent } from './dialog-permission-file.component';

describe('DialogPermissionFileComponent', () => {
  let component: DialogPermissionFileComponent;
  let fixture: ComponentFixture<DialogPermissionFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DialogPermissionFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogPermissionFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
