import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionTypeDefaultComponent } from './permission-type-default.component';

describe('PermissionTypeDefaultComponent', () => {
  let component: PermissionTypeDefaultComponent;
  let fixture: ComponentFixture<PermissionTypeDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionTypeDefaultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissionTypeDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
