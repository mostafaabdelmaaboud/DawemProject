import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionTypeComponent } from './permission-type.component';

describe('PermissionTypeComponent', () => {
  let component: PermissionTypeComponent;
  let fixture: ComponentFixture<PermissionTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
